import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, deleteAccount } from '../api/profile';
import { clearAuth, getUser } from '../utils/auth';
import { setBirthdayExperiencePending, clearBirthdayExperienceCompleted } from '../utils/birthdayExperience';
import { inviteStatus } from '../api/invites';
import Spinner from '../components/Spinner';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/ToastProvider';

export default function Profile() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const { data, isLoading } = useQuery({ queryKey: ['profile'], queryFn: fetchProfile });
  const { data: inviteData } = useQuery({ queryKey: ['inviteStatus'], queryFn: inviteStatus });

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleCopyLink = () => {
    const link = inviteData?.pendingInvite?.inviteLink;
    if (!link) return;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    addToast('Link copied!', 'success');
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleReplayQuiz = () => {
    const user = getUser();
    if (!user?.email) return;
    clearBirthdayExperienceCompleted(user.email);
    setBirthdayExperiencePending(user.email);
    navigate('/amna-birthday');
  };

  const handleDelete = async () => {
    setShowConfirm(false);
    try {
      await deleteAccount();
      clearAuth();
      addToast('Account deleted', 'success');
      navigate('/register');
    } catch (err) {
      addToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="romantic-card p-8">
        <h1 className="text-2xl font-semibold text-vault-ink">Your profile 💖</h1>

        {isLoading && (
          <div className="mt-6 flex items-center gap-3 text-sm text-vault-muted">
            <Spinner size={20} />
            Loading profile…
          </div>
        )}

        {!isLoading && (
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex gap-2">
              <span className="text-vault-muted">Name:</span>
              <span className="font-medium text-vault-ink">{data?.userName}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-vault-muted">Email:</span>
              <span className="font-medium text-vault-ink">{data?.userEmail}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-vault-muted">Partner:</span>
              <span className="font-medium text-vault-ink">{data?.partnerName || 'Not linked yet'}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-vault-muted">Partner email:</span>
              <span className="font-medium text-vault-ink">{data?.partnerEmail || 'Pending invite'}</span>
            </div>
          </div>
        )}

        {/* Invite status */}
        {inviteData && (
          <div className="mt-6 border-t border-vault-accent/20 pt-5">
            {inviteData.partnerLinked ? (
              <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <span className="text-lg">💑</span>
                <span className="font-medium">Invitation accepted — you're linked!</span>
              </div>
            ) : inviteData.pendingInvite ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-vault-muted">Pending invite link — copy &amp; share:</p>
                <div className="flex items-center gap-2 rounded-xl border border-vault-accent/40 bg-white/60 px-3 py-2">
                  <span className="flex-1 break-all text-xs text-vault-ink">{inviteData.pendingInvite.inviteLink}</span>
                  <button
                    onClick={handleCopyLink}
                    className="shrink-0 rounded-lg p-1.5 transition hover:bg-vault-accent/30"
                    title="Copy link"
                  >
                    {linkCopied ? (
                      <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-vault-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-vault-muted">Expires: {new Date(inviteData.pendingInvite.expiresAt).toLocaleDateString()}</p>
              </div>
            ) : null}
          </div>
        )}

        {/* Replay Quiz */}
        <div className="mt-7 border-t border-vault-accent/20 pt-6">
          <p className="mb-3 text-sm text-vault-muted">Revisit our little world anytime ✨</p>
          <button
            onClick={handleReplayQuiz}
            className="romantic-primary px-6 py-2.5 text-sm font-semibold"
          >
            Replay Quiz 💌
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-vault-accent/20 pt-6">
          <button
            onClick={handleLogout}
            className="romantic-pill px-5 py-2 text-sm font-semibold"
          >
            Logout
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 active:scale-95"
          >
            Delete account
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Delete your account?"
        message="Your partner will remain, but your account will be removed permanently."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
