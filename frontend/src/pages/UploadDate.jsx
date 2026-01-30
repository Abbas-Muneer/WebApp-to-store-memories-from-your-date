import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMemory, uploadImages } from '../api/memories';
import { useToast } from '../components/ToastProvider';

export default function UploadDate() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    dateOfDate: '',
    restaurantName: '',
    rating: 5,
    feedback: ''
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiles = (event) => {
    const incoming = Array.from(event.target.files || []);
    const next = [...files, ...incoming].slice(0, 5);
    setFiles(next);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const memory = await createMemory({
        dateOfDate: form.dateOfDate,
        restaurantName: form.restaurantName,
        rating: Number(form.rating),
        feedback: form.feedback
      });

      if (files.length) {
        await uploadImages(memory.id, files);
      }

      addToast('Date saved!', 'success');
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-card md:p-8">
        <h1 className="text-2xl font-semibold text-vault-ink">Log a new date</h1>
        <p className="mt-2 text-sm text-slate-500">Capture the highlights and add up to 5 photos.</p>

        {error && <div className="mt-4 rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-700">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-500">Date</label>
              <input
                name="dateOfDate"
                type="date"
                className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                value={form.dateOfDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-500">Restaurant</label>
              <input
                name="restaurantName"
                className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                value={form.restaurantName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-500">Rating (0-10)</label>
              <input
                name="rating"
                type="number"
                min="0"
                max="10"
                className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                value={form.rating}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-500">Photos (max 5)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                onChange={handleFiles}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-500">Feedback</label>
            <textarea
              name="feedback"
              rows="4"
              maxLength="500"
              className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-sm"
              value={form.feedback}
              onChange={handleChange}
            />
          </div>

          {files.length > 0 && (
            <div>
              <div className="text-sm text-slate-500">Previews</div>
              <div className="mt-3 flex flex-wrap gap-3">
                {files.map((file, index) => (
                  <div key={file.name + index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      className="absolute -right-2 -top-2 rounded-full bg-rose-500 px-2 py-1 text-xs text-white"
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
              className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-500 md:w-auto"
              onClick={() => navigate('/home')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-full bg-vault-navy px-4 py-3 text-sm font-semibold text-white md:w-auto"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save date memory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
