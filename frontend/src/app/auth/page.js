"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { apiFetch, saveAuthData, isLoggedIn } from "@/lib/api";


export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab]   = useState("login");
  const [loginForm, setLoginForm]   = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ username: "", email: "", password: "" });
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) router.replace("/dashboard");
  }, [router]);

  async function handleLogin(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: loginForm.email, password: loginForm.password }),
      });
      saveAuthData(data.token, data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    if (!selectedRole) { setError("Please select a role."); setLoading(false); return; }
    try {
      const data = await apiFetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          username: signupForm.username,
          email:    signupForm.email,
          password: signupForm.password,
          role:     selectedRole.replace(/-/g, "_"),
          skills:   [],
        }),
      });
      saveAuthData(data.token, data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const roles = [
    { id: "need-help", icon: "🙋", label: "Need Help",  desc: "Ask questions, get support" },
    { id: "can-help",  icon: "🧑‍🏫", label: "Can Help",   desc: "Answer questions, mentor others" },
    { id: "both",      icon: "⚡",  label: "Both",       desc: "Learn and contribute together" },
  ];

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel — brand / testimonial ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Orange top stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-brand" />

        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M12 2C8.5 6 7 9 8 12.5c.5 2 2 3.5 4 4-1-1.5-1.5-3-.5-5 1 2.5 3 4 5 4 0-3-1-5.5-5-13.5z"/>
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Helplytics<span className="text-brand">AI</span>
          </span>
        </Link>

        {/* Middle content */}
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
            The community where<br />
            <span className="text-brand">developers get unstuck</span><br />
            fast.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Post a question, get matched with the right expert, mark it solved.
            Build your reputation by helping others.
          </p>
        </div>

        <p className="text-slate-600 text-xs relative z-10">
          © 2025 Helplytics AI · Free forever
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col bg-slate-50">
        {/* Mobile logo bar */}
        <header className="lg:hidden bg-white border-b border-slate-200 h-14 flex items-center px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand rounded flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
                <path d="M12 2C8.5 6 7 9 8 12.5c.5 2 2 3.5 4 4-1-1.5-1.5-3-.5-5 1 2.5 3 4 5 4 0-3-1-5.5-5-13.5z"/>
              </svg>
            </div>
            <span className="font-bold text-slate-900 text-sm">
              Helplytics<span className="text-brand">AI</span>
            </span>
          </Link>
        </header>

        {/* Centered form */}
        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-sm">

            {/* Tab switcher */}
            <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden mb-6 shadow-sm">
              {["login", "signup"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setError(""); }}
                  className={`flex-1 py-3 text-sm font-semibold transition-all ${
                    activeTab === tab
                      ? "bg-brand text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab === "login" ? "Log in" : "Sign up"}
                </button>
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">

              {/* LOGIN FORM */}
              {activeTab === "login" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="mb-5">
                    <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Sign in to continue</p>
                  </div>

                  <Input
                    label="Email" type="email" name="email"
                    placeholder="you@example.com" value={loginForm.email}
                    onChange={(e) => { setLoginForm({ ...loginForm, email: e.target.value }); setError(""); }}
                    required
                  />

                  <div>
                    <Input
                      label="Password" type="password" name="password"
                      placeholder="Your password" value={loginForm.password}
                      onChange={(e) => { setLoginForm({ ...loginForm, password: e.target.value }); setError(""); }}
                      required
                    />
                    <div className="text-right mt-1.5">
                      <button type="button" className="text-xs text-brand hover:underline">Forgot password?</button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2.5 rounded">
                      <span className="shrink-0 mt-0.5">⚠</span>
                      <span>{error}</span>
                    </div>
                  )}

                  <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                    {loading ? "Signing in…" : "Log in"}
                  </Button>

                  <p className="text-center text-xs text-slate-500 pt-1">
                    No account?{" "}
                    <button
                      type="button"
                      onClick={() => { setActiveTab("signup"); setError(""); }}
                      className="text-brand font-semibold hover:underline"
                    >
                      Sign up free
                    </button>
                  </p>
                </form>
              )}

              {/* SIGNUP FORM */}
              {activeTab === "signup" && (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="mb-5">
                    <h2 className="text-xl font-bold text-slate-900">Create account</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Join in under a minute — free forever</p>
                  </div>

                  <Input
                    label="Username" name="username" placeholder="johndoe123"
                    value={signupForm.username}
                    onChange={(e) => { setSignupForm({ ...signupForm, username: e.target.value }); setError(""); }}
                    required
                  />

                  <Input
                    label="Email" type="email" name="email" placeholder="you@example.com"
                    value={signupForm.email}
                    onChange={(e) => { setSignupForm({ ...signupForm, email: e.target.value }); setError(""); }}
                    required
                  />

                  <Input
                    label="Password" type="password" name="password" placeholder="Min 8 characters"
                    value={signupForm.password}
                    onChange={(e) => { setSignupForm({ ...signupForm, password: e.target.value }); setError(""); }}
                    required
                  />

                  {/* Role */}
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">
                      I want to… <span className="text-red-500">*</span>
                    </p>
                    <div className="space-y-2">
                      {roles.map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setSelectedRole(role.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all ${
                            selectedRole === role.id
                              ? "border-brand bg-brand-50"
                              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <span className="text-base">{role.icon}</span>
                          <div className="flex-1">
                            <span className="text-sm font-semibold text-slate-800">{role.label}</span>
                            <span className="text-xs text-slate-500 ml-2">{role.desc}</span>
                          </div>
                          {selectedRole === role.id && (
                            <span className="text-brand text-sm font-bold">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-2.5 rounded">
                      <span className="shrink-0 mt-0.5">⚠</span>
                      <span>{error}</span>
                    </div>
                  )}

                  <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                    {loading ? "Creating account…" : "Create account"}
                  </Button>

                  <p className="text-center text-xs text-slate-400 pt-1">
                    By signing up you agree to our{" "}
                    <span className="text-brand cursor-pointer hover:underline">Terms</span>
                    {" "}and{" "}
                    <span className="text-brand cursor-pointer hover:underline">Privacy Policy</span>
                  </p>
                </form>
              )}
            </div>

            <p className="text-center text-xs text-slate-400 mt-5">
              <Link href="/" className="hover:text-slate-600 transition-colors">← Back to home</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
