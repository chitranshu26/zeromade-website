import Link from "next/link";
import { toProduct, type ApiProduct } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getProduct(slug: string): Promise<ApiProduct | null> {
  try {
    const res = await fetch(`${API_BASE}/api/products/${encodeURIComponent(slug)}`, { cache: "no-store" });
    const data = await res.json();
    return data.success && data.data ? data.data : null;
  } catch {
    return null;
  }
}

type ProductPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function ProductPage(props: ProductPageProps) {
  const params = await Promise.resolve(props.params);
  const { slug } = params;

  const apiProduct = await getProduct(slug);
  const product = apiProduct ? toProduct(apiProduct) : null;

  if (!product) {
    return (
      <main className="page-container py-12 text-center">
        <h2 className="text-xl font-semibold sm:text-2xl">Product not found</h2>
        <Link href="/shop" className="mt-4 inline-block text-gray-600 hover:text-black">Back to shop</Link>
      </main>
    );
  }

  const sizes = ["S", "M", "L", "XL"];

  return (
    <main className="page-container py-8 sm:py-12 md:py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
          <img
            src={product.image}
            alt={product.name}
            className="h-64 w-full object-cover sm:h-80 md:h-[420px]"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>
          <p className="mt-2 text-xl text-gray-600">₹{product.price}</p>
          <p className="mt-4 text-gray-700 sm:mt-6">
            Premium quality fabric, designed for comfort and durability.
          </p>
          <div className="mt-6">
            <p className="mb-2 font-medium">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  className="min-h-[44px] min-w-[44px] rounded-lg border border-gray-300 px-4 py-2.5 transition hover:border-black hover:bg-black hover:text-white"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
            <button className="min-h-[48px] rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800">
              Add to Cart
            </button>
            <Link
              href="/costumize"
              className="inline-flex min-h-[48px] items-center rounded-lg border border-black px-6 py-3 font-medium transition hover:bg-black hover:text-white"
            >
              Customize
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
