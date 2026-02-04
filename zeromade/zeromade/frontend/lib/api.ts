/**
 * API client for Zeromade backend.
 * Uses NEXT_PUBLIC_API_URL (e.g. http://localhost:5000) and credentials for cookies.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type RequestOptions = RequestInit & { params?: Record<string, string> };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...init } = options;
  const url = new URL(path.startsWith("http") ? path : `${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  let res: Response;
  try {
    res = await fetch(url.toString(), {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init.headers as Record<string, string>),
      },
    });
  } catch (err) {
    throw new Error(
      "Could not connect to backend. Ensure it is running on " +
        (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string }).message || "Request failed");
  }
  return data as T;
}

export const api = {
  // Auth
  register: (body: { name: string; email: string; password: string }) =>
    request<{ success: boolean; user: { id: string; name: string; email: string; role: string }; token: string }>(
      "/api/auth/register",
      { method: "POST", body: JSON.stringify(body) }
    ),
  login: (body: { email: string; password: string; role: "user" | "admin" }) =>
    request<{ success: boolean; user: { id: string; name: string; email: string; role: string }; token: string }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify(body) }
    ),
  logout: () => request<{ success: boolean }>("/api/auth/logout", { method: "POST" }),
  getMe: () =>
    request<{ success: boolean; user: { id: string; name: string; email: string; role: string } }>("/api/auth/me"),

  // Products (public)
  getProducts: () =>
    request<{ success: boolean; data: ApiProduct[] }>("/api/products"),
  getProduct: (idOrSlug: string) =>
    request<{ success: boolean; data: ApiProduct }>(`/api/products/${encodeURIComponent(idOrSlug)}`),

  // Products (admin)
  createProduct: (body: Partial<ApiProduct>) =>
    request<{ success: boolean; data: ApiProduct }>("/api/products", { method: "POST", body: JSON.stringify(body) }),
  updateProduct: (id: string, body: Partial<ApiProduct>) =>
    request<{ success: boolean; data: ApiProduct }>(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteProduct: (id: string) =>
    request<{ success: boolean }>(`/api/products/${id}`, { method: "DELETE" }),

  // Materials
  getMaterials: () =>
    request<{ success: boolean; data: ApiMaterial[] }>("/api/materials"),
  createMaterial: (body: { name: string; description?: string }) =>
    request<{ success: boolean; data: ApiMaterial }>("/api/materials", { method: "POST", body: JSON.stringify(body) }),

  // Users (admin)
  getUsers: () =>
    request<{ success: boolean; data: ApiUser[] }>("/api/users"),
};

export type ApiProduct = {
  _id: string;
  name: string;
  slug?: string;
  category?: string;
  price: number;
  size?: string[];
  color?: string[];
  material?: { _id: string; name: string; description?: string } | string | null;
  images: string[];
  stock?: number;
  createdAt?: string;
};

export type ApiMaterial = {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
};

export type ApiUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
};

/** Map API product to frontend shape (id, image from images[0]) */
export function toProduct(p: ApiProduct) {
  return {
    id: p._id,
    name: p.name,
    price: p.price,
    image: Array.isArray(p.images) && p.images[0] ? p.images[0] : "/products/hoodie1.png",
    slug: p.slug || p._id,
  };
}
