import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { login } from '../api/auth';
import { setAuth } from '../utils/auth';
import { useToast } from '../components/ToastProvider';
import FloatingParticles from '../components/birthdayExperience/FloatingParticles';

export default function Login() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [params] = useSearchParams();
  const inviteEmail = params.get('email');
  const [form, setForm] = useState({ email: inviteEmail || '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(form);
      setAuth(data.token, data.user);
      addToast('Welcome back! 💕', 'success');
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10" style={{ minHeight: '100dvh' }}>
      <FloatingParticles count={10} />
      <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

        {/* Left copy */}
        <div className="hidden lg:block">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-vault-muted">AMNA ❤️</div>
          <h1 className="mt-4 text-4xl font-semibold text-vault-ink">
            Welcome back to your memory vault.
          </h1>
          <p className="mt-4 text-vault-muted">
            Relive your best dates, add new moments, and keep everything private between you two.
          </p>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} className="romantic-card p-8">
          <div className="mb-1 text-center text-2xl lg:hidden">AMNA ❤️</div>
          <h2 className="text-2xl font-semibold text-vault-ink">Log in</h2>
          <p className="mt-1.5 text-sm text-vault-muted">Let's continue your story 💕</p>

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-vault-muted">Email</label>
              <input
                name="email"
                type="email"
                className="mt-2 w-full rounded-2xl border-vault-accent/40 bg-white/70 px-4 py-3 text-vault-ink"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-vault-muted">Password</label>
              <input
                name="password"
                type="password"
                className="mt-2 w-full rounded-2xl border-vault-accent/40 bg-white/70 px-4 py-3 text-vault-ink"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="romantic-primary mt-6 w-full px-4 py-3 text-sm"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in 💌'}
          </button>

          <p className="mt-5 text-center text-sm text-vault-muted">
            New here?{' '}
            <Link to="/register" className="font-semibold text-vault-navy hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
