"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import StatsCard from "@/components/StatsCard";
import RequestCard from "@/components/RequestCard";
import Button from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    if (loading) return;
    apiFetch("/api/requests/my")
      .then((data) => {
        setStats(data.stats);
        const normalized = data.requests.slice(0, 5).map((r) => ({
          id: r._id,
          title: r.title,
          description: r.description,
          tags: r.tags || [],
          category: r.category,
          status: r.status,
          author: user?.username ?? "me",
          avatar: (user?.username ?? "me").slice(0, 2).toUpperCase(),
          createdAt: new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          helperCount: r.helpers?.length ?? 0,
        }));
        setRecentRequests(normalized);
      })
      .catch((err) => console.error("[Dashboard] failed to load stats:", err.message));
  }, [loading]);

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-7">

        {/* Stats */}
        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Overview</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard icon="📝" label="My Questions"  value={stats?.total  ?? "—"} change={`${stats?.open ?? 0} open`} positive={true} />
            <StatsCard icon="✅" label="Solved"        value={stats?.solved ?? "—"} change={stats ? `${stats.total ? Math.round((stats.solved / stats.total) * 100) : 0}% solve rate` : "—"} positive={true} />
            <StatsCard icon="🤝" label="Helped Others" value={stats?.helped ?? "—"} change="total contributions" positive={true} />
            <StatsCard icon="🔓" label="Open"          value={stats?.open   ?? "—"} change="awaiting help" positive={stats?.open === 0} />
          </div>
        </section>

        {/* Recent questions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">My Recent Questions</h3>
            <Link href="/explore" className="text-sm text-brand hover:underline font-medium">View all →</Link>
          </div>
          {recentRequests.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
              <p className="text-2xl mb-2">💬</p>
              <p className="text-sm font-semibold text-slate-700 mb-1">No questions yet</p>
              <p className="text-xs text-slate-400 mb-4">Ask your first question and get help from the community.</p>
              <Link href="/create"><Button variant="primary" size="sm">+ Ask a Question</Button></Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentRequests.map((r) => <RequestCard key={r.id} {...r} />)}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
