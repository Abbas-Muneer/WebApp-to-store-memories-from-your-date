import { Link } from 'react-router-dom';

export default function TopBannerInviteReminder({ show }) {
  if (!show) return null;
  return (
    <div className="sticky top-0 z-20 bg-vault-navy text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="text-sm">
          Invite your partner to unlock your shared vault.
        </div>
        <Link
          to="/invite"
          className="rounded-full bg-white px-4 py-1 text-xs font-semibold text-vault-navy"
        >
          Invite now
        </Link>
      </div>
    </div>
  );
}
