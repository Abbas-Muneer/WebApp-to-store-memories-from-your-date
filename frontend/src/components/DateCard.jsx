import ImageRow from './ImageRow';

export default function DateCard({ memory, onClick }) {
  return (
    <div
      className="romantic-card cursor-pointer p-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-soft"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(); }}
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-vault-muted">
        {memory.dateOfDate}
      </div>
      <h3 className="mt-2 text-lg font-semibold text-vault-ink">{memory.restaurantName}</h3>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-sm text-vault-muted">Rating</span>
        <span className="rounded-full bg-gradient-to-r from-vault-pink/20 to-vault-lavender/20 px-2.5 py-0.5 text-sm font-bold text-vault-navy">
          {memory.rating}/10
        </span>
      </div>
      <p className="mt-2 max-h-10 overflow-hidden text-sm text-vault-muted">
        {memory.feedback || 'No notes yet.'}
      </p>
      <div className="mt-4">
        <ImageRow images={memory.images} />
      </div>
    </div>
  );
}
