"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/costumize", label: "Customize" },
  { href: "/admin/dashboard", label: "Admin" },
  { href: "/login", label: "Login" },
  { href: "/cart", label: "Cart" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-black/95 text-white backdrop-blur-md shadow-lg border-b border-white/10 safe-area-top">
      <div className="page-container flex h-14 md:h-16 items-center justify-between gap-4">
        {/* Logo + brand — visible on all devices, no circular crop */}
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2 overflow-visible sm:gap-3"
          onClick={closeMenu}
        >
          <span className="relative block h-9 w-auto shrink-0 overflow-visible sm:h-10">
            <Image
              src="/logo.png"
              alt="Zeromade"
              width={100}
              height={40}
              className="h-9 w-auto max-h-10 object-contain object-center sm:h-10"
              priority
              unoptimized={false}
            />
          </span>
          <span className="truncate text-xs font-semibold tracking-widest text-white transition-colors hover:text-gray-200 sm:text-sm md:text-base">
            ZEROMADE
          </span>
        </Link>

        {/* Desktop: main nav row (links + actions) */}
        <nav className="hidden lg:flex lg:items-center lg:gap-1 xl:gap-2">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 hover:text-gray-100"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            Shop
          </Link>
          <Link
            href="/costumize"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            Customize
          </Link>
          <Link
            href="/admin/dashboard"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            Admin
          </Link>
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/cart"
            className="ml-1 rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white hover:text-black xl:ml-2"
          >
            Cart
          </Link>
        </nav>

        {/* Mobile: hamburger button */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 lg:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="relative block h-5 w-6">
            <span
              className={`absolute left-0 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0.5"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 rounded-full bg-current transition-all duration-300 ${
                menuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "top-[13px]"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu overlay + slide panel */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
        />

        {/* Slide panel from right — full height, responsive width */}
        <div
          className={`absolute right-0 top-0 h-full w-[85vw] min-w-[280px] max-w-[400px] border-l border-white/10 bg-black shadow-2xl transition-transform duration-300 ease-out md:max-w-sm ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-14 items-center justify-between border-b border-white/10 px-4 safe-area-top">
            <span className="text-sm font-semibold tracking-widest text-white">
              <span className="hidden xs:inline">Menu — Home, Shop, Cart & more</span>
              <span className="xs:hidden">Menu</span>
            </span>
            <button
              type="button"
              onClick={closeMenu}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white active:bg-white/15"
              aria-label="Close menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col overflow-y-auto py-2 safe-area-bottom">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="min-h-[48px] border-b border-white/5 px-5 py-3.5 text-base font-medium text-gray-200 transition-colors hover:bg-white/10 hover:text-white active:bg-white/15 flex items-center"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
