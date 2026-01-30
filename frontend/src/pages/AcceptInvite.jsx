import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { validateInvite } from '../api/invites';
import Spinner from '../components/Spinner';

export default function AcceptInvite() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [state, setState] = useState({ loading: true, data: null, error: '' });

  useEffect(() => {
    const run = async () => {
      try {
        const data = await validateInvite(token);
        setState({ loading: false, data, error: '' });
      } catch (err) {
        setState({ loading: false, data: null, error: err.response?.data?.message || 'Invite invalid' });
      }
    };
    if (token) {
      run();
    } else {
      setState({ loading: false, data: null, error: 'Missing invite token' });
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-vault-cream">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4">
        <div className="w-full rounded-3xl bg-white p-10 shadow-card">
          <h1 className="text-3xl font-semibold text-vault-navy">You’ve been invited</h1>

          {state.loading && (
            <div className="mt-6 flex items-center gap-3 text-slate-500">
              <Spinner size={20} />
              Validating invite...
            </div>
          )}

          {!state.loading && state.error && (
            <div className="mt-6 rounded-2xl bg-rose-100 px-4 py-3 text-sm text-rose-700">
              {state.error}
            </div>
          )}

          {!state.loading && state.data && (
            <div className="mt-6 space-y-4">
              <p className="text-slate-500">
                This invite is for <span className="font-semibold text-vault-ink">{state.data.partnerEmail}</span>.
                Log in or create your account to join the shared vault.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/register?email=${encodeURIComponent(state.data.partnerEmail)}`}
                  className="rounded-full bg-vault-navy px-5 py-2 text-sm font-semibold text-white"
                >
                  Create account
                </Link>
                <Link
                  to={`/login?email=${encodeURIComponent(state.data.partnerEmail)}`}
                  className="rounded-full border border-vault-navy px-5 py-2 text-sm font-semibold text-vault-navy"
                >
                  Log in
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
