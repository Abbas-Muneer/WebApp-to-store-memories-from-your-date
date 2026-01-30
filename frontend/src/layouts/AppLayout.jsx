import { Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import TopBannerInviteReminder from '../components/TopBannerInviteReminder';
import { inviteStatus } from '../api/invites';

export default function AppLayout() {
  const { data } = useQuery({
    queryKey: ['invite-status'],
    queryFn: inviteStatus
  });

  const showBanner = data?.hasCouple && !data?.partnerLinked;

  return (
    <div className="min-h-screen bg-vault-cream">
      <TopBannerInviteReminder show={showBanner} />
      <Navbar />
      <div className="gradient-veil">
        <main className="mx-auto max-w-6xl px-4 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
