export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        className="romantic-pill px-4 py-2 text-sm disabled:opacity-40"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        ← Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            p === page
              ? 'bg-gradient-to-r from-vault-pink to-vault-lavender text-white shadow-soft'
              : 'bg-white/60 text-vault-muted hover:bg-vault-accent/20 hover:text-vault-navy'
          }`}
        >
          {p + 1}
        </button>
      ))}

      <button
        className="romantic-pill px-4 py-2 text-sm disabled:opacity-40"
        disabled={page === totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </button>
    </div>
  );
}
