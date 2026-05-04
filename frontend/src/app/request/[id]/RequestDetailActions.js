"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import Button from "@/components/Button";

export default function RequestDetailActions({ requestId, isSolved, isAuthor, onResponseAdded, onSolved }) {
  const [showForm, setShowForm]   = useState(false);
  const [text, setText]           = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");

  async function handleRespond(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const data = await apiFetch(`/api/requests/${requestId}/respond`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      setText("");
      setShowForm(false);
      onResponseAdded(data.response);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMarkSolved() {
    try {
      await apiFetch(`/api/requests/${requestId}/solve`, { method: "PATCH" });
      onSolved();
    } catch (err) {
      setError(err.message);
    }
  }

  if (isSolved) {
    return (
      <div className="mt-5 pt-4 border-t border-slate-100">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          ✓ This question has been solved
        </span>
      </div>
    );
  }

  return (
    <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
      <div className="flex flex-wrap gap-2">
        {!isAuthor && (
          <Button variant="primary" size="sm" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "✍️ Write an Answer"}
          </Button>
        )}
        {isAuthor && (
          <Button variant="success" size="sm" onClick={handleMarkSolved}>
            ✅ Mark as Solved
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleRespond} className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            required
            placeholder="Write your answer here…"
            className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
          />
          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}
          <div className="flex gap-2">
            <Button type="submit" variant="primary" size="sm" disabled={submitting}>
              {submitting ? "Posting…" : "Post Answer"}
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
