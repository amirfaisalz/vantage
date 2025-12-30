"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { name: "Product", href: "/product" },
  { name: "Solutions", href: "/solutions" },
  { name: "Pricing", href: "/pricing" },
  { name: "Docs", href: "/docs" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pathname, setPathname] = useState("/");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 pt-2 ${
          scrolled
            ? "bg-black/90 backdrop-blur-xl border-b border-orange-500/20 shadow-lg shadow-orange-500/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group relative">
              <div className="relative w-40 h-40">
                <Image
                  src="/vantage_logo.png"
                  alt="Vantage Logo"
                  fill
                  priority
                  className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group ${
                      pathname === link.href
                        ? "text-orange-500"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {link.name}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-orange-500 to-orange-600 transition-all duration-300 ${
                        pathname === link.href
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-3 ml-4">
                <a
                  href="/login"
                  className="px-5 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </a>
                <a
                  href="/start"
                  className="group relative px-6 py-2.5 bg-linear-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/50 hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </div>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-orange-500 transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-zinc-950/98 backdrop-blur-xl border-t border-orange-500/20">
            <div className="px-6 py-6 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                {navLinks.map((link, idx) => (
                  <a
                    key={link.name}
                    href={link.href}
                    style={{ animationDelay: `${idx * 50}ms` }}
                    className={`px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                      pathname === link.href
                        ? "text-orange-500 bg-orange-500/10"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                    } ${isOpen ? "animate-in slide-in-from-left" : ""}`}
                    onClick={() => setPathname(link.href)}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <div className="h-px bg-linear-to-r from-transparent via-orange-500/30 to-transparent" />
              <div className="flex flex-col gap-3">
                <a
                  href="/login"
                  className="px-4 py-3 text-base font-medium text-center text-zinc-300 hover:text-white rounded-lg border border-zinc-700 hover:border-orange-500/50 transition-all duration-300"
                >
                  Sign In
                </a>
                <a
                  href="/start"
                  className="px-4 py-3 text-base font-semibold text-center text-white bg-linear-to-r from-orange-500 to-orange-600 rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
