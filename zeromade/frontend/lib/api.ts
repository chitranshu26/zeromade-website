const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://zeromade-website.onrender.com";

type RequestOptions = RequestInit & { params?: Record<string, string> };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...init } = options;

  const url = new URL(`${API_BASE}${path}`);

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

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  login: (body: any) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  register: (body: any) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getProducts: () => request("/api/products"),
};
