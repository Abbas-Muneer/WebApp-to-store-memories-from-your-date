import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { register } from '../api/auth';
import { setAuth } from '../utils/auth';
import { useToast } from '../components/ToastProvider';
import FloatingParticles from '../components/birthdayExperience/FloatingParticles';

export default function Register() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [params] = useSearchParams();
  const invitedEmail = params.get('email');
  const [form, setForm] = useState({ name: '', email: invitedEmail || '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await register(form);
      setAuth(data.token, data.user);
      addToast('Account created! 💖', 'success');
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <h1 className="mt-4 text-4xl font-semibold text-vault-ink">Start your shared vault.</h1>
          <p className="mt-4 text-vault-muted">
            Save date night highlights, photos, and ratings in a private space just for you two.
          </p>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} className="romantic-card p-8">
          <div className="mb-1 text-center text-2xl lg:hidden">AMNA ❤️</div>
          <h2 className="text-2xl font-semibold text-vault-ink">Create your account</h2>

          {invitedEmail && (
            <div className="mt-3 rounded-2xl border border-vault-accent/40 bg-vault-accent/20 px-4 py-3 text-sm text-vault-ink">
              💌 You've been invited — creating your shared vault now.
            </div>
          )}

          {error && (
            <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {error}
            </div>
          )}

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-medium text-vault-muted">Name</label>
              <input
                name="name"
                className="mt-2 w-full rounded-2xl border-vault-accent/40 bg-white/70 px-4 py-3 text-vault-ink"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>
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
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="romantic-primary mt-6 w-full px-4 py-3 text-sm"
            disabled={loading}
          >
            {loading ? 'Creating…' : 'Create account 💌'}
          </button>

          <p className="mt-5 text-center text-sm text-vault-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-vault-navy hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
