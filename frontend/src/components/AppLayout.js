"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "./Sidebar";

export default function AppLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto transition-transform duration-300 lg:translate-x-0 lg:self-stretch ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <Sidebar onClose={() => setSidebarOpen(false)} onLogout={logout} user={user} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header bar */}
        <header className="bg-white border-b border-slate-200 h-14 flex items-center px-4 sm:px-6 shrink-0 shadow-sm">
          <div className="flex items-center justify-between w-full">

            {/* Left: hamburger + page title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              {title && <h1 className="text-base font-bold text-slate-800">{title}</h1>}
            </div>

            {/* Right: username + avatar */}
            <div className="flex items-center gap-2.5">
              <span className="hidden sm:block text-sm font-medium text-slate-600">
                {user?.username}
              </span>
              <div
                className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                title={user?.username}
              >
                {user?.username?.slice(0, 2).toUpperCase() ?? "??"}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-7">
          {children}
        </main>
      </div>
    </div>
  );
}
