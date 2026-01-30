import ImageRow from './ImageRow';

export default function DateCard({ memory, onClick }) {
  return (
    <div
      className="cursor-pointer rounded-2xl bg-white p-5 shadow-card transition-transform duration-300 hover:-translate-y-1"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") onClick?.();
      }}
    >
      <div className="text-xs uppercase tracking-[0.2em] text-vault-muted">{memory.dateOfDate}</div>
      <h3 className="mt-2 text-lg font-semibold text-vault-ink">{memory.restaurantName}</h3>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm text-slate-500">Rating</span>
        <span className="text-sm font-semibold text-vault-navy">{memory.rating}/10</span>
      </div>
      <p className="mt-2 max-h-10 overflow-hidden text-sm text-slate-500">
        {memory.feedback || 'No notes yet.'}
      </p>
      <div className="mt-4">
        <ImageRow images={memory.images} />
      </div>
    </div>
  );
}
