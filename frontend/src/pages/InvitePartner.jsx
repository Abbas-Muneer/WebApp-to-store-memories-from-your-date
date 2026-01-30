import { useState } from 'react';
import { createInvite } from '../api/invites';
import { useToast } from '../components/ToastProvider';

export default function InvitePartner() {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await createInvite({ partnerEmail: email });
      setStatus(data);
      addToast('Invite sent!', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Invite failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl bg-white p-8 shadow-card">
        <h1 className="text-2xl font-semibold text-vault-ink">Invite your partner</h1>
        <p className="mt-2 text-sm text-slate-500">
          Send an invite link to unlock your shared vault together.
        </p>

        {error && <div className="mt-4 rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-slate-500">Partner email</label>
            <input
              type="email"
              className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-vault-navy px-4 py-3 text-sm font-semibold text-white"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send invite'}
          </button>
        </form>

        {status && (
          <div className="mt-6 rounded-2xl bg-vault-accent/30 px-4 py-4 text-sm text-slate-600">
            Invite status: <span className="font-semibold text-vault-navy">{status.status}</span>
            <div className="mt-2">Sent to: {status.partnerEmailMasked}</div>
            <div className="mt-1">Expires at: {new Date(status.expiresAt).toLocaleString()}</div>
          </div>
        )}
      </div>
    </div>
  );
}
