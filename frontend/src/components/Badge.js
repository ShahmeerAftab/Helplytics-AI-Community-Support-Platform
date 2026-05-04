
export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default:  "bg-slate-100 text-slate-600 border border-slate-200",
    tag:      "bg-brand-50 text-brand border border-brand-100 hover:bg-brand-100 cursor-pointer",
    category: "bg-amber-50 text-amber-700 border border-amber-200",
    high:     "bg-red-50 text-red-600 border border-red-200",
    medium:   "bg-yellow-50 text-yellow-700 border border-yellow-200",
    low:      "bg-emerald-50 text-emerald-700 border border-emerald-200",
    solved:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
    open:     "bg-sky-50 text-sky-700 border border-sky-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium transition-colors ${variants[variant] ?? variants.default} ${className}`}
    >
      {children}
    </span>
  );
}
