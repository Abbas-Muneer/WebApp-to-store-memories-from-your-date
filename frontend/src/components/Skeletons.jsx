export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl p-5 shadow-card" style={{ background: 'rgba(255,255,255,0.6)' }}>
      <div className="h-4 w-24 rounded-full bg-vault-accent/30" />
      <div className="mt-3 h-5 w-3/4 rounded-full bg-vault-accent/20" />
      <div className="mt-4 h-3 w-full rounded-full bg-vault-accent/20" />
      <div className="mt-2 h-3 w-2/3 rounded-full bg-vault-accent/20" />
      <div className="mt-4 flex gap-2">
        <div className="h-16 w-16 rounded-xl bg-vault-accent/20" />
        <div className="h-16 w-16 rounded-xl bg-vault-accent/20" />
        <div className="h-16 w-16 rounded-xl bg-vault-accent/20" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
