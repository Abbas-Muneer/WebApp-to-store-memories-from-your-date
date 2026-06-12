import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMemory, uploadImages } from '../api/memories';
import { useToast } from '../components/ToastProvider';

export default function UploadDate() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState({ dateOfDate: '', restaurantName: '', rating: 5, feedback: '' });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiles = (e) => {
    const incoming = Array.from(e.target.files || []);
    const combined = [...files, ...incoming].slice(0, 5);
    setFiles(combined);
    const readers = combined.map((file) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(file);
      })
    );
    Promise.all(readers).then(setPreviews);
  };

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const memory = await createMemory({
        dateOfDate: form.dateOfDate,
        restaurantName: form.restaurantName,
        rating: Number(form.rating),
        feedback: form.feedback
      });
      if (files.length) await uploadImages(memory.id, files);
      addToast('Date saved! 💕', 'success');
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="romantic-card p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-vault-ink">Log a new date ✨</h1>
        <p className="mt-1.5 text-sm text-vault-muted">Capture the highlights and add up to 5 photos.</p>

        {error && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-vault-muted">Date</label>
              <input
                name="dateOfDate"
                type="date"
                className="mt-2 w-full rounded-2xl border-vault-accent/40 bg-white/70 px-4 py-3 text-vault-ink"
                value={form.dateOfDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-vault-muted">Restaurant / Venue</label>
              <input
                name="restaurantName"
                className="mt-2 w-full rounded-2xl border-vault-accent/40 bg-white/70 px-4 py-3 text-vault-ink"
                value={form.restaurantName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-vault-muted">Rating (0–10)</label>
              <input
                name="rating"
                type="number"
                min="0"
                max="10"
                className="mt-2 w-full rounded-2xl border-vault-accent/40 bg-white/70 px-4 py-3 text-vault-ink"
                value={form.rating}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-vault-muted">Photos (max 5)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="mt-2 w-full rounded-2xl border-vault-accent/40 bg-white/70 px-4 py-3 text-sm text-vault-muted"
                onChange={handleFiles}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-vault-muted">Feedback / Notes</label>
            <textarea
              name="feedback"
              rows="4"
              maxLength="500"
              className="mt-2 w-full rounded-2xl border-vault-accent/40 bg-white/70 px-4 py-3 text-vault-ink"
              value={form.feedback}
              onChange={handleChange}
            />
          </div>

          {previews.length > 0 && (
            <div>
              <div className="text-sm font-medium text-vault-muted">Previews</div>
              <div className="mt-3 flex flex-wrap gap-3">
                {previews.map((src, index) => (
                  <div key={index} className="relative">
                    <img
                      src={src}
                      alt={`preview ${index + 1}`}
                      className="h-20 w-20 rounded-xl object-cover shadow-soft"
                    />
                    <button
                      type="button"
                      className="absolute -right-2 -top-2 rounded-full bg-rose-500 px-2 py-1 text-xs text-white shadow"
                      onClick={() => removeFile(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              className="romantic-pill w-full px-4 py-3 text-sm font-medium md:w-auto"
              onClick={() => navigate('/home')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="romantic-primary w-full px-4 py-3 text-sm md:w-auto"
              disabled={loading}
            >
              {loading ? 'Saving…' : 'Save date memory 💕'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
