import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* HERO — scales for mobile, tablet, laptop */}
      <section className="hero-bg text-white pb-12 pt-14 xs:pb-16 xs:pt-16 sm:pb-20 sm:pt-20 md:pb-24 md:pt-24">
        <div className="page-container flex flex-col items-center text-center">
          <h1 className="text-3xl font-extrabold tracking-tight xs:text-4xl sm:text-4xl md:text-5xl lg:text-[3.25rem]">
            Zeromade – Apna Time, Apna Design
          </h1>

          <p className="mt-3 max-w-xl text-sm text-gray-300 xs:mt-4 xs:text-base md:text-base">
            Custom & pre-designed clothing made just for you.
          </p>

          <div className="mt-6 flex w-full flex-wrap justify-center gap-3 px-2 xs:mt-8 xs:gap-4 xs:px-0">
            <Link
              href="/shop"
              className="min-h-[44px] flex-1 min-w-[140px] rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:bg-gray-100 xs:flex-none xs:px-8"
            >
              Shop Now
            </Link>

            <Link
              href="/costumize"
              className="min-h-[44px] flex-1 min-w-[140px] rounded-full border border-white/70 px-6 py-3 text-sm font-medium text-white/90 transition hover:-translate-y-0.5 hover:bg-white/10 xs:flex-none xs:px-8"
            >
              Customize
            </Link>
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section className="pb-12 pt-8 sm:pb-16 sm:pt-10 md:pb-20 md:pt-12">
        <div className="page-container grid gap-4 sm:gap-6 md:grid-cols-3">
          
          {/* Card 1 */}
          <div className="group rounded-2xl bg-white p-5 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
            <h3 className="mb-3 text-base font-semibold">
              Trending Hoodies
            </h3>

            <p className="mb-3 text-xs text-gray-500">
              Handpicked designs inspired by your favorite shows & artists.
            </p>

            <div className="overflow-hidden rounded-xl">
              <img
                src="/products/hoodie1.png"
                alt="Trending Hoodies"
                className="w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Card 2 */}
          <div className="group rounded-2xl bg-white p-5 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
            <h3 className="mb-3 text-base font-semibold">
              New T-Shirts
            </h3>

            <p className="mb-3 text-xs text-gray-500">
              Fresh drops with bold typography and clean fits.
            </p>

            <div className="overflow-hidden rounded-xl">
              <img
                src="/products/tshirt1.png"
                alt="New T-Shirts"
                className="w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
            <div>
              <h3 className="mb-2 text-base font-semibold">
                Create Your Own
              </h3>

              <p className="text-sm text-gray-500">
                Upload your design & preview instantly
              </p>
            </div>

            <div className="mt-6">
              <Link
                href="/costumize"
                className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-gray-900"
              >
                Start Designing
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
