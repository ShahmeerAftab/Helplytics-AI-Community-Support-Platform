import Link from "next/link";
import Navbar from "@/components/Navbar";
import { features, communityStats } from "@/lib/data";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero-bg border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left — copy */}
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand bg-brand-50 border border-brand-100 px-3 py-1 rounded-full mb-5">
                🚀 Built for developers
              </span>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-5">
                Get unstuck.<br />
                <span className="gradient-text">Help others.</span><br />
                Grow together.
              </h1>

              <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                Post your coding question, get matched with the right expert, and build a reputation by helping others in return.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors shadow-md text-sm"
                >
                  Get started free
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 px-6 py-3 text-slate-700 font-medium border border-slate-300 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-colors text-sm"
                >
                  Log in
                </Link>
              </div>

              <p className="text-xs text-slate-400 mt-4">Free forever · No credit card required</p>
            </div>

            {/* Right — mock question card */}
            <div className="flex-1 w-full max-w-md lg:max-w-none">
              <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                <div className="h-1 bg-brand" />
                <div className="p-5">
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs font-medium bg-brand-50 text-brand border border-brand-100 px-2 py-0.5 rounded-full">Backend</span>
                    <span className="text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">Open</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">How do I implement JWT refresh tokens in Node.js?</h3>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">I'm building a REST API and need to handle token expiry gracefully. Currently users get logged out every 15 minutes...</p>
                  <div className="flex gap-1.5 mb-4">
                    {["Node.js", "JWT", "Express"].map((t) => (
                      <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    {[
                      { name: "Maria C.", rep: 1240, msg: "Use a short-lived access token (15m) + long-lived refresh token (7d). Happy to share a working example!" },
                      { name: "James O.", rep: 890,  msg: "Check out the express-jwt package — it simplifies middleware setup significantly." },
                    ].map((h) => (
                      <div key={h.name} className="flex gap-2.5">
                        <div className="w-7 h-7 bg-brand rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {h.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="bg-slate-50 rounded-lg px-3 py-2 flex-1">
                          <p className="text-xs font-semibold text-slate-800">{h.name} <span className="text-brand font-normal">⭐ {h.rep}</span></p>
                          <p className="text-xs text-slate-500 mt-0.5">{h.msg}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {communityStats.map((s) => (
              <div key={s.label} className="bg-white border border-slate-200 rounded-lg p-5 text-center shadow-sm">
                <p className="text-2xl sm:text-3xl font-extrabold text-brand">{s.value}</p>
                <p className="text-slate-500 text-sm mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">How it works</h2>
            <p className="text-slate-500 text-sm">From stuck to solved in three steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "01", icon: "✍️", title: "Post your question", desc: "Describe your problem clearly with tags and category. Takes less than a minute." },
              { step: "02", icon: "🤝", title: "Get matched with helpers", desc: "Developers with the right skills are notified and jump in to help." },
              { step: "03", icon: "✅", title: "Mark it solved", desc: "Accept the best answer, mark it solved, and build your reputation." },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className="w-14 h-14 bg-brand-50 border-2 border-brand-100 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-brand uppercase tracking-widest">{item.step}</span>
                <h3 className="text-base font-bold text-slate-900 mt-1 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Everything you need to get help fast</h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm">No fluff. Just the tools that get you from stuck to shipping.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:border-brand hover:shadow-md transition-all group card-hover"
              >
                <div className="w-11 h-11 bg-brand-50 border border-brand-100 rounded-lg flex items-center justify-center text-xl mb-4 group-hover:bg-brand group-hover:border-brand transition-all">
                  {f.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,128,36,0.15),transparent_60%)]" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
            Ready to stop being stuck?
          </h2>
          <p className="text-slate-400 mb-8 text-base leading-relaxed">
            Join thousands of developers helping each other every day.<br className="hidden sm:block" />
            It's free, and always will be.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark transition-colors text-sm shadow-lg"
            >
              Create your free account
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-brand rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="currentColor">
                  <path d="M12 2C8.5 6 7 9 8 12.5c.5 2 2 3.5 4 4-1-1.5-1.5-3-.5-5 1 2.5 3 4 5 4 0-3-1-5.5-5-13.5z"/>
                </svg>
              </div>
              <span className="text-slate-300 text-sm font-bold">Helplytics<span className="text-brand">AI</span></span>
            </div>
            <p className="text-slate-600 text-xs">© 2025 Helplytics AI · Built for developers</p>
            <div className="flex gap-5 text-xs text-slate-500">
              <Link href="/auth"    className="hover:text-brand transition-colors">Sign up</Link>
              <Link href="/auth"    className="hover:text-brand transition-colors">Log in</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
