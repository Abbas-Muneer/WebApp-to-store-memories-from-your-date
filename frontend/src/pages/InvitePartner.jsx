import { useState } from 'react';
import { createInvite } from '../api/invites';
import { useToast } from '../components/ToastProvider';

export default function InvitePartner() {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await createInvite({ partnerEmail: email });
      setStatus(data);
      addToast('Invite link ready! Copy and share it 💌', 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create invite. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!status?.inviteLink) return;
    navigator.clipboard.writeText(status.inviteLink);
    setCopied(true);
    addToast('Link copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
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
          <div className="mt-6 rounded-2xl border border-vault-accent/40 bg-vault-accent/15 px-4 py-4 text-sm text-vault-ink space-y-3">
            <div className="font-semibold text-vault-navy">Invite link ready 💌</div>
            <div className="text-vault-muted">Share this link with your partner:</div>
            <div className="flex items-center gap-2 rounded-xl border border-vault-accent/40 bg-white/60 px-3 py-2">
              <span className="flex-1 break-all text-xs text-vault-ink">{status.inviteLink}</span>
              <button
                onClick={handleCopy}
                className="shrink-0 rounded-lg p-1.5 transition hover:bg-vault-accent/30"
                title="Copy link"
              >
                {copied ? (
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
            <div className="text-xs text-vault-muted">Expires: {new Date(status.expiresAt).toLocaleDateString()}</div>
          </div>
        )}
      </div>
    </div>
  );
}
