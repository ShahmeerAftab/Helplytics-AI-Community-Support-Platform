
export default function StatsCard({ icon, label, value, change, positive = true }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Subtle top accent */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${positive ? "bg-brand" : "bg-red-400"}`} />

      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center text-xl">
          {icon}
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
        }`}>
          {change}
        </span>
      </div>

      <p className="text-3xl font-extrabold text-slate-900 mb-0.5 leading-none">{value}</p>
      <p className="text-xs text-slate-500 font-medium mt-1">{label}</p>
    </div>
  );
}
