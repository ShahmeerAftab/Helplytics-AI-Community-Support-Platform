"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isLoggedIn, clearAuthData, getStoredUser } from "@/lib/api";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const loggedIn = isLoggedIn();
  const user = getStoredUser();
  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "??";

  function logout() {
    clearAuthData();
    router.push("/auth");
  }

  const navLinks = [
    { label: "Explore",      href: "/explore" },
    { label: "Dashboard",    href: "/dashboard" },
    { label: "Ask Question", href: "/create" },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="h-[3px] bg-brand" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 bg-brand rounded flex items-center justify-center shadow-sm group-hover:bg-brand-dark transition-colors">
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-white" fill="currentColor">
                <path d="M12 2C8.5 6 7 9 8 12.5c.5 2 2 3.5 4 4-1-1.5-1.5-3-.5-5 1 2.5 3 4 5 4 0-3-1-5.5-5-13.5z"/>
              </svg>
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">
              Helplytics<span className="text-brand">AI</span>
            </span>
          </Link>

          {/* Desktop nav links — only shown when logged in */}
          {loggedIn && (
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-brand hover:bg-brand-50 rounded transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-2">
            {loggedIn ? (
              <>
                <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white text-xs font-bold" title={user?.username}>
                  {initials}
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-1.5 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth" className="px-4 py-1.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-colors">
                  Log in
                </Link>
                <Link href="/auth" className="px-4 py-1.5 text-sm font-semibold text-white bg-brand rounded-lg hover:bg-brand-dark transition-colors shadow-sm">
                  Sign up free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 space-y-0.5">
            {loggedIn && navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand hover:bg-brand-50 rounded"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2 mt-1">
              {loggedIn ? (
                <div className="flex items-center justify-between px-3">
                  <span className="text-sm font-medium text-slate-700">@{user?.username}</span>
                  <button onClick={logout} className="text-sm text-red-500 font-medium hover:underline">Sign out</button>
                </div>
              ) : (
                <>
                  <Link href="/auth" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-center text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50">
                    Log in
                  </Link>
                  <Link href="/auth" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-center text-sm font-semibold text-white bg-brand rounded-lg hover:bg-brand-dark">
                    Sign up free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
