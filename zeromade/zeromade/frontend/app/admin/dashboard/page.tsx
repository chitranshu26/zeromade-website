"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, type ApiProduct, type ApiMaterial, type ApiUser } from "@/lib/api";

type Tab = "products" | "materials" | "users";

export default function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [materials, setMaterials] = useState<ApiMaterial[]>([]);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Add product form
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productImage, setProductImage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [materialDesc, setMaterialDesc] = useState("");

  const loadProducts = async () => {
    try {
      const res = await api.getProducts();
      if (res.success && res.data) setProducts(res.data);
    } catch (e) {
      setError("Failed to load products. Are you logged in as admin?");
    }
  };

  const loadMaterials = async () => {
    try {
      const res = await api.getMaterials();
      if (res.success && res.data) setMaterials(res.data);
    } catch {
      setError("Failed to load materials.");
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.getUsers();
      if (res.success && res.data) setUsers(res.data);
    } catch {
      setError("Failed to load users. Admin only.");
    }
  };

  useEffect(() => {
    setError("");
    setLoading(true);
    Promise.all([loadProducts(), loadMaterials(), loadUsers()]).finally(() => setLoading(false));
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.createProduct({
        name: productName,
        price: Number(productPrice) || 0,
        stock: Number(productStock) || 0,
        images: productImage ? [productImage] : [],
      });
      setMessage("Product added.");
      setProductName("");
      setProductPrice("");
      setProductStock("");
      setProductImage("");
      loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    setError("");
    try {
      await api.deleteProduct(id);
      setMessage("Product deleted.");
      loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const startEdit = (p: ApiProduct) => {
    setEditingId(p._id);
    setEditName(p.name);
    setEditPrice(String(p.price));
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setError("");
    try {
      await api.updateProduct(editingId, { name: editName, price: Number(editPrice) });
      setMessage("Product updated.");
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.createMaterial({ name: materialName, description: materialDesc });
      setMessage("Material added.");
      setMaterialName("");
      setMaterialDesc("");
      loadMaterials();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add material");
    }
  };

  return (
    <main className="page-container max-w-4xl py-8 sm:py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Admin Dashboard</h1>
        <Link href="/" className="text-gray-600 hover:text-black sm:shrink-0">Back to site</Link>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto border-b pb-px sm:gap-4">
        <button
          type="button"
          className={`shrink-0 rounded-t px-3 py-2.5 text-sm font-medium sm:px-4 ${tab === "products" ? "border-b-2 border-black bg-gray-50" : "text-gray-500 hover:text-black"}`}
          onClick={() => setTab("products")}
        >
          Products
        </button>
        <button
          type="button"
          className={`shrink-0 rounded-t px-3 py-2.5 text-sm font-medium sm:px-4 ${tab === "materials" ? "border-b-2 border-black bg-gray-50" : "text-gray-500 hover:text-black"}`}
          onClick={() => setTab("materials")}
        >
          Materials
        </button>
        <button
          type="button"
          className={`shrink-0 rounded-t px-3 py-2.5 text-sm font-medium sm:px-4 ${tab === "users" ? "border-b-2 border-black bg-gray-50" : "text-gray-500 hover:text-black"}`}
          onClick={() => setTab("users")}
        >
          Users
        </button>
      </div>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          {tab === "products" && (
            <div className="space-y-6">
              <form onSubmit={handleAddProduct} className="max-w-md space-y-3 rounded-xl border bg-white p-4 sm:p-5">
                <h2 className="font-semibold sm:text-lg">Add product</h2>
                <input
                  placeholder="Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={productStock}
                  onChange={(e) => setProductStock(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
                <input
                  placeholder="Image URL (optional)"
                  value={productImage}
                  onChange={(e) => setProductImage(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button type="submit" className="w-full rounded-lg bg-black px-4 py-3 text-white sm:w-auto">
                  Add product
                </button>
              </form>
              <div>
                <h2 className="mb-2 font-semibold sm:text-lg">All products</h2>
                <ul className="divide-y overflow-hidden rounded-xl border bg-white">
                  {products.length === 0 ? (
                    <li className="p-4 text-gray-500 sm:p-5">No products</li>
                  ) : (
                    products.map((p) => (
                      <li key={p._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5">
                        {editingId === p._id ? (
                          <form onSubmit={handleUpdateProduct} className="flex flex-wrap gap-2 sm:flex-1">
                            <input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                              required
                            />
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                              required
                            />
                            <button type="submit" className="rounded-lg bg-black px-3 py-2 text-sm text-white">Save</button>
                            <button type="button" className="text-gray-500" onClick={() => setEditingId(null)}>Cancel</button>
                          </form>
                        ) : (
                          <>
                            <span className="truncate">{p.name} – ₹{p.price}</span>
                            <span className="flex gap-2">
                              <button type="button" className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100" onClick={() => startEdit(p)}>Edit</button>
                              <button type="button" className="rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50" onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                            </span>
                          </>
                        )}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}

          {tab === "materials" && (
            <div className="space-y-6">
              <form onSubmit={handleAddMaterial} className="max-w-md space-y-3 rounded-xl border bg-white p-4 sm:p-5">
                <h2 className="font-semibold sm:text-lg">Add material</h2>
                <input
                  placeholder="Name"
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
                <input
                  placeholder="Description (optional)"
                  value={materialDesc}
                  onChange={(e) => setMaterialDesc(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button type="submit" className="w-full rounded-lg bg-black px-4 py-3 text-white sm:w-auto">
                  Add material
                </button>
              </form>
              <div>
                <h2 className="mb-2 font-semibold sm:text-lg">All materials</h2>
                <ul className="divide-y overflow-hidden rounded-xl border bg-white">
                  {materials.length === 0 ? (
                    <li className="p-4 text-gray-500 sm:p-5">No materials</li>
                  ) : (
                    materials.map((m) => (
                      <li key={m._id} className="p-4 sm:p-5">{m.name} {m.description && `– ${m.description}`}</li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}

          {tab === "users" && (
            <div>
              <h2 className="mb-2 font-semibold sm:text-lg">All users</h2>
              <ul className="divide-y overflow-hidden rounded-xl border bg-white">
                {users.length === 0 ? (
                  <li className="p-4 text-gray-500 sm:p-5">No users or access denied</li>
                ) : (
                  users.map((u) => (
                    <li key={u._id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                      <span className="truncate">{u.name} ({u.email})</span>
                      <span className="text-gray-500">{u.role}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </>
      )}
    </main>
  );
}
