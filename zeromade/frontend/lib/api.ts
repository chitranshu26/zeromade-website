const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://zeromade-website.onrender.com";

type RequestOptions = RequestInit & {
  params?: Record<string, string>;
};

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...init } = options;

  const url = new URL(
    path.startsWith("http") ? path : `${API_BASE}${path}`
  );

  if (params) {
    Object.entries(params).forEach(([k, v]) =>
      url.searchParams.set(k, v)
    );
  }

  const res = await fetch(url.toString(), {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

/* ========================
   API METHODS
======================== */

export const api = {
  /* AUTH */
  register: (body: any) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: any) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  logout: () =>
    request("/api/auth/logout", { method: "POST" }),

  getMe: () =>
    request<{ success: boolean; user: ApiUser }>("/api/auth/me"),

  /* PRODUCTS */
  getProducts: () =>
    request<{ success: boolean; data: ApiProduct[] }>("/api/products"),

  getProduct: (id: string) =>
    request<{ success: boolean; data: ApiProduct }>(
      `/api/products/${id}`
    ),

  createProduct: (body: Partial<ApiProduct>) =>
    request("/api/products", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateProduct: (id: string, body: Partial<ApiProduct>) =>
    request(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteProduct: (id: string) =>
    request(`/api/products/${id}`, {
      method: "DELETE",
    }),

  /* MATERIALS */
  getMaterials: () =>
    request<{ success: boolean; data: ApiMaterial[] }>(
      "/api/materials"
    ),

  createMaterial: (body: Partial<ApiMaterial>) =>
    request("/api/materials", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  /* USERS */
  getUsers: () =>
    request<{ success: boolean; data: ApiUser[] }>("/api/users"),
};

/* ========================
   TYPES
======================== */

export type ApiProduct = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  slug?: string;
  category?: string;
  size?: string[];
  color?: string[];
  material?: ApiMaterial | string | null;
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

/* ========================
   PRODUCT MAPPER
======================== */

export function toProduct(p: ApiProduct) {
  return {
    id: p._id,
    name: p.name,
    price: p.price,
    image: p.images?.[0] || "/products/hoodie1.png",
    slug: p.slug || p._id,
  };
}
