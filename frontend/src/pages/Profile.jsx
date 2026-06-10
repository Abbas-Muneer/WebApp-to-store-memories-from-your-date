import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, deleteAccount } from '../api/profile';
import { clearAuth, getUser } from '../utils/auth';
import { setBirthdayExperiencePending, clearBirthdayExperienceCompleted } from '../utils/birthdayExperience';
import Spinner from '../components/Spinner';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../components/ToastProvider';

export default function Profile() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const { data, isLoading } = useQuery({ queryKey: ['profile'], queryFn: fetchProfile });

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
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
