import Link from "next/link";
import { toProduct, type ApiProduct } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getProducts(): Promise<ApiProduct[]> {
  try {
    const res = await fetch(`${API_BASE}/api/products`, { cache: "no-store" });
    const data = await res.json();
    return data.success && data.data ? data.data : [];
  } catch {
    return [];
  }
}

export default async function ShopPage() {
  const data = await getProducts();
  const products = data.map((p) => toProduct(p));

  return (
    <main className="page-container py-8 sm:py-12 md:py-16">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl md:mb-8">Shop All</h1>
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.length === 0 ? (
          <p className="col-span-full text-gray-500">No products yet. Check back soon.</p>
        ) : (
          products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group overflow-hidden rounded-xl border bg-white transition hover:shadow-lg"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-56 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-64 md:h-[280px]"
              />
              <div className="p-4 sm:p-5">
                <h2 className="font-semibold text-base sm:text-lg">{product.name}</h2>
                <p className="mt-1 text-gray-600">₹{product.price}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
