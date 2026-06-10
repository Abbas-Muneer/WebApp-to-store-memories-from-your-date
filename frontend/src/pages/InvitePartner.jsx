import { useState } from 'react';
import { createInvite } from '../api/invites';
import { useToast } from '../components/ToastProvider';

export default function InvitePartner() {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await createInvite({ partnerEmail: email });
      setStatus(data);
      addToast('Invite sent! 💌', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send invite. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="romantic-card p-8">
        <h1 className="text-2xl font-semibold text-vault-ink">Invite your partner 💌</h1>
        <p className="mt-2 text-sm text-vault-muted">
          Send an invite link to unlock your shared vault together.
        </p>

        {error && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-vault-muted">Partner email</label>
            <input
              type="email"
              className="mt-2 w-full rounded-2xl border-vault-accent/40 bg-white/70 px-4 py-3 text-vault-ink"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <button
            type="submit"
            className="romantic-primary w-full px-4 py-3 text-sm"
            disabled={loading}
          >
            {loading ? 'Sending…' : 'Send invite 💕'}
          </button>
        </form>

        {status && (
          <div className="mt-6 rounded-2xl border border-vault-accent/40 bg-vault-accent/15 px-4 py-4 text-sm text-vault-ink">
            <div>Invite status: <span className="font-semibold text-vault-navy">{status.status}</span></div>
            <div className="mt-1.5">Sent to: {status.partnerEmailMasked}</div>
            <div className="mt-1">Expires: {new Date(status.expiresAt).toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  );
}
