"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import { categories } from "@/lib/data";
import RequestDetailActions from "./RequestDetailActions";

export default function RequestDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [request, setRequest]   = useState(null);
  const [fetching, setFetching] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [editing, setEditing]       = useState(false);
  const [editForm, setEditForm]     = useState({ title: "", description: "", category: "", tags: "" });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError]   = useState("");
  const [deleting, setDeleting]     = useState(false);

  useEffect(() => {
    if (authLoading) return;
    apiFetch(`/api/requests/${id}`)
      .then((data) => {
        setRequest(data.request);
        const r = data.request;
        setEditForm({
          title:       r.title,
          description: r.description,
          category:    r.category,
          tags:        (r.tags || []).join(", "),
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setFetching(false));
  }, [authLoading, id]);

  async function handleEditSave(e) {
    e.preventDefault();
    setEditSaving(true);
    setEditError("");
    try {
      const data = await apiFetch(`/api/requests/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title:       editForm.title,
          description: editForm.description,
          category:    editForm.category,
          tags:        editForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      setRequest((prev) => ({ ...prev, ...data.request }));
      setEditing(false);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this question? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/requests/${id}`, { method: "DELETE" });
      router.push("/explore");
    } catch {
      setDeleting(false);
    }
  }

  // Show loading spinner while fetching
  if (fetching) {
    return (
      <AppLayout title="Question">
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-[3px] border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  // Show not-found message if the question doesn't exist
  if (notFound || !request) {
    return (
      <AppLayout>
        <div className="max-w-lg mx-auto py-24 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Question not found</h2>
          <p className="text-sm text-slate-500 mb-6">This question may have been removed or the link is incorrect.</p>
          <Link href="/explore" className="text-sm text-brand hover:underline font-medium">← Back to all questions</Link>
        </div>
      </AppLayout>
    );
  }

  // Derive display values from the loaded request
  const author   = request.user?.username ?? "unknown";
  const avatar   = author.slice(0, 2).toUpperCase();
  const postedAt = new Date(request.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const isAuthor = user?.id === request.user?._id?.toString();

  return (
    <AppLayout title={request.title.slice(0, 60) + "…"}>
      <div className="max-w-3xl space-y-5">

        {/* Question card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="h-1 bg-brand" />
          <div className="p-6">

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="category">{request.category}</Badge>
              <Badge variant={request.status === "solved" ? "solved" : "open"}>
                {request.status === "solved" ? "✓ Solved" : "Open"}
              </Badge>
            </div>

            {/* Title row with edit/delete buttons for the author */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <h1 className="text-xl font-bold text-slate-900 leading-snug">{request.title}</h1>
              {isAuthor && !editing && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setEditing(true)} className="text-xs text-slate-400 hover:text-brand transition-colors font-medium">Edit</button>
                  <button onClick={handleDelete} disabled={deleting} className="text-xs text-slate-400 hover:text-red-500 transition-colors font-medium">
                    {deleting ? "Deleting…" : "Delete"}
                  </button>
                </div>
              )}
            </div>

            {/* Inline edit form (only visible when editing) */}
            {editing ? (
              <form onSubmit={handleEditSave} className="space-y-3 mb-5">
                <input
                  value={editForm.title}
                  required
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <textarea
                  value={editForm.description}
                  required
                  rows={5}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand resize-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  >
                    {categories.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <input
                    value={editForm.tags}
                    placeholder="Tags, comma-separated"
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
                {editError && <p className="text-xs text-red-600">{editError}</p>}
                <div className="flex gap-2">
                  <Button type="submit" variant="primary" size="sm" disabled={editSaving}>{editSaving ? "Saving…" : "Save"}</Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-slate-600 leading-relaxed mb-5 whitespace-pre-line">{request.description}</p>
            )}

            {request.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {request.tags.map((tag) => <Badge key={tag} variant="tag">{tag}</Badge>)}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 bg-brand-50 rounded-full flex items-center justify-center text-xs font-bold text-brand">{avatar}</div>
                <span>Asked by <span className="font-semibold text-brand">{author}</span></span>
              </div>
              <span>· {postedAt}</span>
              <span>· {request.responses?.length ?? 0} answer{request.responses?.length !== 1 ? "s" : ""}</span>
            </div>

            <RequestDetailActions
              requestId={id}
              isSolved={request.status === "solved"}
              isAuthor={isAuthor}
              onResponseAdded={(newResponse) => {
                setRequest((prev) => ({ ...prev, responses: [...(prev.responses ?? []), newResponse] }));
              }}
              onSolved={() => setRequest((prev) => ({ ...prev, status: "solved" }))}
            />
          </div>
        </div>

        {/* Answers section */}
        <div>
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">
            {request.responses?.length ?? 0} Answer{request.responses?.length !== 1 ? "s" : ""}
          </h2>

          {(!request.responses || request.responses.length === 0) ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
              <p className="text-2xl mb-2">💬</p>
              <p className="text-sm text-slate-500">No answers yet. Be the first to help!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {request.responses.map((resp) => {
                const respName   = resp.user?.username ?? "user";
                const respAvatar = respName.slice(0, 2).toUpperCase();
                const respDate   = new Date(resp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
                return (
                  <div key={resp._id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{respAvatar}</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{respName}</p>
                        <p className="text-xs text-slate-400">{respDate}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{resp.text}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Link href="/explore" className="inline-block text-sm text-brand hover:underline font-medium">← Back to all questions</Link>
      </div>
    </AppLayout>
  );
}
