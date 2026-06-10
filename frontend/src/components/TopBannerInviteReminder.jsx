import { Link } from 'react-router-dom';

export default function TopBannerInviteReminder({ show }) {
  if (!show) return null;
  return (
    <div
      className="sticky top-0 z-20"
      style={{
        background: 'linear-gradient(135deg, #f472b6, #c084fc)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="text-sm font-medium text-white">
          💌 Invite your partner to unlock your shared vault.
        </div>
        <Link
          to="/invite"
          className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-vault-navy shadow transition hover:opacity-90 active:scale-95"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        >
          Invite now
        </Link>
      </div>
    </div>
  );
}
