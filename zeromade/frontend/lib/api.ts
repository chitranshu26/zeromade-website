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

export const api = {
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

  getProducts: () =>
    request<{ success: boolean; data: ApiProduct[] }>(
      "/api/products"
    ),

  getProduct: (id: string) =>
    request<{ success: boolean; data: ApiProduct }>(
      `/api/products/${id}`
    ),
};

/* TYPES */

export type ApiProduct = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  slug?: string;
};

/* IMPORTANT EXPORT */

export function toProduct(p: ApiProduct) {
  return {
    id: p._id,
    name: p.name,
    price: p.price,
    image: p.images?.[0] || "/products/hoodie1.png",
    slug: p.slug || p._id,
  };
}
