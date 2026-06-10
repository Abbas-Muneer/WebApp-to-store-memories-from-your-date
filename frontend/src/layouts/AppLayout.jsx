import { Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import TopBannerInviteReminder from '../components/TopBannerInviteReminder';
import FloatingParticles from '../components/birthdayExperience/FloatingParticles';
import { inviteStatus } from '../api/invites';

export default function AppLayout() {
  const { data } = useQuery({
    queryKey: ['invite-status'],
    queryFn: inviteStatus
  });

  const showBanner = data?.hasCouple && !data?.partnerLinked;

  return (
    // No hard background here – let the body gradient show through
    <div className="min-h-screen">
      <FloatingParticles count={10} />
      <TopBannerInviteReminder show={showBanner} />
      <Navbar />
      <div className="gradient-veil">
        <main
          className="mx-auto max-w-6xl px-4 py-10"
          style={{
            paddingBottom: 'max(2.5rem, calc(env(safe-area-inset-bottom, 0px) + 2.5rem))',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
