import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { login } from '../api/auth';
import { setAuth } from '../utils/auth';
import { useToast } from '../components/ToastProvider';

export default function Login() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [params] = useSearchParams();
  const inviteEmail = params.get('email');
  const [form, setForm] = useState({ email: inviteEmail || '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(form);
      setAuth(data.token, data.user);
      addToast('Welcome back!', 'success');
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vault-cream">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4">
        <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="text-sm uppercase tracking-[0.3em] text-vault-muted">CoupleDateVault</div>
            <h1 className="mt-4 text-4xl font-semibold text-vault-ink">Welcome back to your memory vault.</h1>
            <p className="mt-4 text-slate-500">
              Relive your best dates, add new moments, and keep everything private between you two.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-8 shadow-card">
            <h2 className="text-2xl font-semibold text-vault-navy">Log in</h2>
            <p className="mt-2 text-sm text-slate-500">Let’s continue your story.</p>

            {error && <div className="mt-4 rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div>}

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-slate-500">Email</label>
                <input
                  name="email"
                  type="email"
                  className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-slate-500">Password</label>
                <input
                  name="password"
                  type="password"
                  className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-vault-navy px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <p className="mt-6 text-center text-sm text-slate-500">
              New here?{' '}
              <Link to="/register" className="font-semibold text-vault-navy">
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
