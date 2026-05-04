"use client";

export default function Input({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all
          ${error ? "border-red-400" : "border-slate-300 hover:border-slate-400"}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

/**
 * Textarea — Multi-line input (brand focus ring)
 */
export function Textarea({
  label,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  rows = 5,
  className = "",
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-white text-slate-900 placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all resize-none
          ${error ? "border-red-400" : "border-slate-300 hover:border-slate-400"}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
