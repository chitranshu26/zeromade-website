"use client";

import { useState } from "react";

export default function CustomizePage() {
  const [design, setDesign] = useState<string | null>(null);
  const [size, setSize] = useState(150);
  const [x, setX] = useState(50);
  const [y, setY] = useState(120);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setDesign(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  return (
    <main className="min-h-screen bg-[#f1f3f6] page-container py-8 sm:py-10 md:py-12">
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
        Customize Your Clothing
      </h1>
      <p className="mb-6 text-gray-600 sm:mb-8">
        Upload your design & preview it instantly
      </p>

      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:gap-10">

        {/* ===== PREVIEW AREA ===== */}
        <div className="relative flex justify-center rounded-2xl bg-white p-4 shadow-md sm:p-6">
          <div className="relative w-full max-w-[350px]">
            <img
              src="/products/hoodie1.png"
              alt="Hoodie"
              className="w-full max-w-[280px] sm:max-w-[350px]"
            />
            {design && (
              <img
                src={design}
                alt="Design"
                style={{
                  width: size,
                  left: x,
                  top: y,
                }}
                className="absolute cursor-move touch-none"
              />
            )}
          </div>
        </div>

        {/* ===== CONTROLS ===== */}
        <div className="rounded-2xl bg-white p-4 shadow-md sm:p-6">
          <h2 className="mb-4 text-lg font-semibold sm:text-xl">
            Design Controls
          </h2>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block font-medium">
                Upload Design
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-black file:px-4 file:py-2 file:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Size</label>
              <input
                type="range"
                min={50}
                max={300}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="h-3 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-black"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Move Left / Right</label>
              <input
                type="range"
                min={0}
                max={250}
                value={x}
                onChange={(e) => setX(Number(e.target.value))}
                className="h-3 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-black"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Move Up / Down</label>
              <input
                type="range"
                min={0}
                max={300}
                value={y}
                onChange={(e) => setY(Number(e.target.value))}
                className="h-3 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-black"
              />
            </div>
          </div>

          <button className="mt-6 w-full rounded-lg bg-black py-3.5 font-medium text-white transition hover:bg-gray-800">
            Add Customized Product to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
