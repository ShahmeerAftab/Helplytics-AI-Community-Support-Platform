import Link from "next/link";
import Badge from "./Badge";

export default function RequestCard({
  id, title, description, tags, category,
  status, author, avatar, createdAt, helperCount, isOwn,
}) {

  const isSolved = status === "solved";

  return (
    <div className="bg-white border border-slate-200 rounded-xl question-card flex overflow-hidden shadow-sm">

      {/* Stats column */}
      <div className="hidden sm:flex flex-col items-center justify-center gap-2.5 px-4 py-5 bg-slate-50 border-r border-slate-200 min-w-[76px] text-center shrink-0">
        <div>
          <p className="text-base font-bold text-slate-700">{helperCount}</p>
          <p className="text-xs text-slate-400 leading-tight">helpers</p>
        </div>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${
          isSolved
            ? "bg-emerald-500 text-white shadow-sm"
            : helperCount > 0
              ? "border-2 border-emerald-400 text-emerald-600"
              : "border-2 border-slate-200 text-slate-400"
        }`}>
          {isSolved ? "✓" : helperCount}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 min-w-0">
        <Link href={`/request/${id}`}>
          <h3 className="text-sm font-semibold text-brand hover:text-brand-dark leading-snug mb-2 line-clamp-2 transition-colors">
            {title}
          </h3>
        </Link>

        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag) => <Badge key={tag} variant="tag">{tag}</Badge>)}
          <Badge variant="category">{category}</Badge>
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Badge variant={isSolved ? "solved" : "open"}>
              {isSolved ? "✓ Solved" : "Open"}
            </Badge>
            <Link
              href={`/request/${id}`}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                isOwn || isSolved
                  ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  : "bg-brand text-white hover:bg-brand-dark shadow-sm"
              }`}
            >
              {isOwn ? "View" : isSolved ? "View" : "Answer →"}
            </Link>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <div className="w-5 h-5 bg-brand rounded-full flex items-center justify-center text-xs font-bold text-white">
              {avatar}
            </div>
            <span className="text-xs text-brand font-medium">{author}</span>
            <span className="text-xs text-slate-400">{createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
