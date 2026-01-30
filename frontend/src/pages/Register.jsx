import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { register } from '../api/auth';
import { setAuth } from '../utils/auth';
import { useToast } from '../components/ToastProvider';

export default function Register() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [params] = useSearchParams();
  const invitedEmail = params.get('email');
  const [form, setForm] = useState({ name: '', email: invitedEmail || '', password: '' });
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
      const data = await register(form);
      setAuth(data.token, data.user);
      addToast('Account created!', 'success');
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
            <h1 className="mt-4 text-4xl font-semibold text-vault-ink">Start your shared vault.</h1>
            <p className="mt-4 text-slate-500">
              Save date night highlights, photos, and ratings in a private space just for you two.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-8 shadow-card">
            <h2 className="text-2xl font-semibold text-vault-navy">Create your account</h2>
            {invitedEmail && (
              <div className="mt-4 rounded-2xl bg-vault-accent/40 px-4 py-3 text-sm text-slate-700">
                You’ve been invited — creating your shared vault now.
              </div>
            )}
            {error && <div className="mt-4 rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div>}

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-slate-500">Name</label>
                <input
                  name="name"
                  className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
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
              {loading ? 'Creating...' : 'Create account'}
            </button>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-vault-navy">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
