"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import RequestCard from "@/components/RequestCard";
import Button from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch, getStoredUser } from "@/lib/api";
import { categories } from "@/lib/data";

const LIMIT = 10;

export default function ExplorePage() {
  const { loading } = useAuth();
  const currentUser = getStoredUser();

  const [requests, setRequests]                 = useState([]);
  const [fetching, setFetching]                 = useState(true);
  const [search, setSearch]                     = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]         = useState(0);

  useEffect(() => {
    if (loading) return;
    setFetching(true);
    const params = new URLSearchParams({ page, limit: LIMIT });
    if (search)                          params.set("search",   search);
    if (selectedCategory !== "All")      params.set("category", selectedCategory);
    apiFetch(`/api/requests?${params}`)
      .then((data) => {
        const normalized = data.requests.map((r) => ({
          id: r._id,
          title: r.title,
          description: r.description,
          tags: r.tags || [],
          category: r.category,
          status: r.status,
          author: r.user?.username ?? "unknown",
          avatar: (r.user?.username ?? "??").slice(0, 2).toUpperCase(),
          createdAt: new Date(r.createdAt).toLocaleDateString(),
          helperCount: r.helpers?.length ?? 0,
          isOwn: r.user?._id?.toString() === currentUser?.id?.toString(),
        }));
        setRequests(normalized);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [loading, page, search, selectedCategory]);

  // reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [search, selectedCategory]);

  const filteredRequests = requests;

  const myRequests        = filteredRequests.filter((r) =>  r.isOwn);
  const communityRequests = filteredRequests.filter((r) => !r.isOwn);

  return (
    <AppLayout title="Explore Questions">
      <div className="space-y-4">

        {/* Search + actions bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Search by title or tag…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>
          <Link href="/create">
            <Button variant="primary" size="md">+ Ask Question</Button>
          </Link>
        </div>

<div className="flex flex-col lg:flex-row gap-5">

          {/* Category filter */}
          <aside className="w-full lg:w-44 shrink-0">
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-brand-50 border-b border-brand-100">
                <p className="text-xs font-bold text-brand uppercase tracking-wide">Category</p>
              </div>
              <div className="p-2 space-y-0.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      selectedCategory === cat ? "bg-brand-50 text-brand font-semibold" : "text-slate-600 hover:bg-slate-50 hover:text-brand"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            {selectedCategory !== "All" && (
              <button
                onClick={() => setSelectedCategory("All")}
                className="w-full mt-2 text-xs text-red-500 hover:bg-red-50 py-2 rounded border border-red-200 transition-colors"
              >
                ✕ Clear filter
              </button>
            )}
          </aside>

          {/* Question list */}
          <div className="flex-1 space-y-6">
            {fetching ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-7 h-7 border-[3px] border-brand border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                <p className="text-3xl mb-3">🔍</p>
                <h3 className="text-base font-bold text-slate-800 mb-1">No questions found</h3>
                <p className="text-sm text-slate-500 mb-4">Try different search terms or filters.</p>
                <Button variant="secondary" size="sm" onClick={() => { setSearch(""); setSelectedCategory("All"); }}>
                  Reset filters
                </Button>
              </div>
            ) : (
              <>
                {myRequests.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">My Questions</h3>
                    <div className="space-y-2">
                      {myRequests.map((r) => <RequestCard key={r.id} {...r} />)}
                    </div>
                  </div>
                )}

                {communityRequests.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Community Questions</h3>
                    <div className="space-y-2">
                      {communityRequests.map((r) => <RequestCard key={r.id} {...r} />)}
                    </div>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-slate-400">
                      Page {page} of {totalPages} · {total} question{total !== 1 ? "s" : ""}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPage((p) => p - 1)}
                        disabled={page === 1}
                        className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        ← Prev
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                        .reduce((acc, p, idx, arr) => {
                          if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((item, idx) =>
                          item === "..." ? (
                            <span key={`dots-${idx}`} className="px-2 text-xs text-slate-400">…</span>
                          ) : (
                            <button
                              key={item}
                              onClick={() => setPage(item)}
                              className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors ${
                                page === item
                                  ? "bg-brand text-white"
                                  : "border border-slate-300 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {item}
                            </button>
                          )
                        )}

                      <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page === totalPages}
                        className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
