export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index);

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-500 disabled:opacity-40"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`rounded-full px-4 py-2 text-sm ${
            p === page ? 'bg-vault-navy text-white' : 'bg-white text-slate-600'
          }`}
        >
          {p + 1}
        </button>
      ))}
      <button
        className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-500 disabled:opacity-40"
        disabled={page === totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
