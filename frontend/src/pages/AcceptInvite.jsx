import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { validateInvite } from '../api/invites';
import Spinner from '../components/Spinner';
import { setBirthdayExperiencePending } from '../utils/birthdayExperience';
import FloatingParticles from '../components/birthdayExperience/FloatingParticles';

export default function AcceptInvite() {
  const [params] = useSearchParams();
  const token = params.get('token');

  // status: 'validating' | 'valid' | 'invalid' | 'network-error'
  const [status, setStatus] = useState('validating');
  const [data, setData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      setErrorMsg('This link is missing its invite token. Please ask for a new one.');
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const result = await validateInvite(token);
        if (cancelled) return;
        // Store pending birthday experience for the invited partner
        if (result?.partnerEmail) {
          setBirthdayExperiencePending(result.partnerEmail);
        }
        setData(result);
        setStatus('valid');
      } catch (err) {
        if (cancelled) return;
        const msg = err.response?.data?.message || '';
        if (!err.response) {
          setStatus('network-error');
          setErrorMsg('Couldn\'t reach the server. Check your connection and try again.');
        } else if (msg.toLowerCase().includes('expired')) {
          setStatus('invalid');
          setErrorMsg('This invite link has expired. Ask for a fresh one 💌');
        } else if (msg.toLowerCase().includes('used') || msg.toLowerCase().includes('already')) {
          setStatus('invalid');
          setErrorMsg('This invite has already been used. You might already be linked 💕');
        } else {
          setStatus('invalid');
          setErrorMsg(msg || 'This invite link isn\'t valid. Double-check the link and try again.');
        }
      }
    })();

    return () => { cancelled = true; };
  }, [token]);

  return (
    <div
      className="bday-bg flex min-h-screen items-center justify-center px-4 py-10"
      style={{ minHeight: '100dvh' }}
    >
      <FloatingParticles count={10} />
      <div className="w-full max-w-lg">
        <div className="romantic-card p-8 md:p-10">

          {/* ── Validating ── */}
          {status === 'validating' && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <Spinner size={28} />
              <p className="text-vault-muted">Checking your invite…</p>
            </div>
          )}

          {/* ── Valid ── */}
          {status === 'valid' && data && (
            <>
              <div className="text-center">
                <div className="mb-3 text-4xl">💌</div>
                <h1 className="text-2xl font-semibold text-vault-ink">You've been invited</h1>
                <p className="mt-3 text-sm text-vault-muted">
                  This invite is for{' '}
                  <span className="font-semibold text-vault-ink">{data.partnerEmail}</span>.
                  <br />
                  Log in or create your account to join your shared vault.
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={`/register?email=${encodeURIComponent(data.partnerEmail)}`}
                  className="romantic-primary flex-1 px-5 py-3 text-center text-sm font-semibold"
                >
                  Create account
                </Link>
                <Link
                  to={`/login?email=${encodeURIComponent(data.partnerEmail)}`}
                  className="romantic-pill flex-1 px-5 py-3 text-center text-sm font-semibold"
                >
                  Log in
                </Link>
              </div>
            </>
          )}

          {/* ── Invalid / expired ── */}
          {status === 'invalid' && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="text-4xl">💔</div>
              <h1 className="text-xl font-semibold text-vault-ink">Hmm, something's off</h1>
              <p className="text-sm text-vault-muted">{errorMsg}</p>
              <Link
                to="/login"
                className="romantic-pill mt-2 px-5 py-2 text-sm font-semibold"
              >
                Go to login
              </Link>
            </div>
          )}

          {/* ── Network error ── */}
          {status === 'network-error' && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="text-4xl">🌐</div>
              <h1 className="text-xl font-semibold text-vault-ink">Connection issue</h1>
              <p className="text-sm text-vault-muted">{errorMsg}</p>
              <button
                className="romantic-primary mt-2 px-6 py-2.5 text-sm font-semibold"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
