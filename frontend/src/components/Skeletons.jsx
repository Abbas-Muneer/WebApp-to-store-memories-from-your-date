export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl bg-white shadow-card p-5">
      <div className="h-4 w-24 rounded-full bg-slate-100" />
      <div className="mt-3 h-5 w-3/4 rounded-full bg-slate-100" />
      <div className="mt-4 h-3 w-full rounded-full bg-slate-100" />
      <div className="mt-2 h-3 w-2/3 rounded-full bg-slate-100" />
      <div className="mt-4 flex gap-2">
        <div className="h-16 w-16 rounded-xl bg-slate-100" />
        <div className="h-16 w-16 rounded-xl bg-slate-100" />
        <div className="h-16 w-16 rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
