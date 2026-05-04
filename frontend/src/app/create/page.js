"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { Textarea } from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import { categories } from "@/lib/data";

export default function CreatePage() {
  const { loading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ title: "", description: "", tags: "", category: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await apiFetch("/api/requests", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      router.push("/explore");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const categoryOptions = categories.filter((c) => c !== "All");

  return (
    <AppLayout title="Ask a Question">
      <div className="max-w-2xl">
        <p className="text-sm text-slate-500 mb-6">Describe your problem clearly to get the best help.</p>

        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-5">

            <Input
              label="Title"
              name="title"
              required
              placeholder="e.g. How do I fix a CORS error in Express.js?"
              value={form.title}
              onChange={handleChange}
            />

            <Textarea
              label="Description"
              name="description"
              rows={6}
              required
              placeholder={"Describe your problem in detail:\n• What are you trying to do?\n• What have you already tried?\n• Any error messages?"}
              value={form.description}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent hover:border-slate-400 transition-colors"
                >
                  <option value="" disabled>Select a category</option>
                  {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <Input
                label="Tags"
                name="tags"
                placeholder="React, Node.js, TypeScript"
                value={form.tags}
                onChange={handleChange}
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Tips for a great question</p>
              <ul className="text-xs text-slate-500 space-y-1">
                {["Keep the title short and specific", "Include any error messages you see", "Mention what you've already tried", "Add tags so the right experts find it"].map((tip) => (
                  <li key={tip} className="flex items-start gap-1.5">
                    <span className="text-brand font-bold mt-0.5">›</span>{tip}
                  </li>
                ))}
              </ul>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2.5 rounded-lg">
                <span className="shrink-0 mt-0.5">⚠</span><span>{error}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Posting…" : "Post Question"}
              </Button>
              <Link href="/explore">
                <Button variant="secondary">Cancel</Button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
