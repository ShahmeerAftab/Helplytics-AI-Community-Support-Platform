"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  const [form, setForm] = useState({ username: "", email: "", skills: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username ?? "",
        email:    user.email    ?? "",
        skills:   user.skills?.join(", ") ?? "",
      });
    }
  }, [user]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(false);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      await apiFetch("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          username: form.username.trim(),
          email:    form.email.trim(),
          skills:   form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPwError(""); setPwSuccess(false);
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("New passwords do not match."); return;
    }
    setPwSaving(true);
    try {
      await apiFetch("/api/auth/password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      setPwSuccess(true);
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwSaving(false);
    }
  }

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <AppLayout title="Profile">
      <div className="max-w-xl space-y-6">

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-lg ring-4 ring-brand/20">
            {initials}
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">{user?.username}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <span className="inline-block mt-1 text-xs font-medium bg-brand-50 text-brand border border-brand-100 px-2 py-0.5 rounded-full capitalize">
              {user?.role?.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Edit Information</h2>

            <Input
              label="Username"
              name="username"
              required
              value={form.username}
              onChange={handleChange}
              placeholder="your_username"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Skills</label>
              <input
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="e.g. React, Node.js, Python"
                className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent hover:border-slate-400 transition-colors"
              />
              <p className="text-xs text-slate-400">Comma-separated list of your skills</p>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2.5 rounded-lg">
                <span className="shrink-0 mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2.5 rounded-lg">
                <span>✓</span>
                <span>Profile updated successfully.</span>
              </div>
            )}

            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
        {/* Change password */}
        <form onSubmit={handlePasswordChange}>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-5">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Change Password</h2>

            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              required
              value={pwForm.currentPassword}
              onChange={(e) => { setPwForm({ ...pwForm, currentPassword: e.target.value }); setPwError(""); setPwSuccess(false); }}
              placeholder="Your current password"
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              required
              value={pwForm.newPassword}
              onChange={(e) => { setPwForm({ ...pwForm, newPassword: e.target.value }); setPwError(""); setPwSuccess(false); }}
              placeholder="Min 8 characters"
            />
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              required
              value={pwForm.confirmPassword}
              onChange={(e) => { setPwForm({ ...pwForm, confirmPassword: e.target.value }); setPwError(""); setPwSuccess(false); }}
              placeholder="Repeat new password"
            />

            {pwError && (
              <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2.5 rounded-lg">
                <span className="shrink-0 mt-0.5">⚠</span><span>{pwError}</span>
              </div>
            )}
            {pwSuccess && (
              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2.5 rounded-lg">
                <span>✓</span><span>Password changed successfully.</span>
              </div>
            )}

            <Button type="submit" variant="primary" disabled={pwSaving}>
              {pwSaving ? "Changing…" : "Change Password"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
