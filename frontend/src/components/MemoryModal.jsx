import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import ProtectedImage from './ProtectedImage';
import { updateMemory, deleteMemory, uploadImages, deleteImage } from '../api/memories';
import { useToast } from './ToastProvider';
import ConfirmDialog from './ConfirmDialog';

export default function MemoryModal({ memory, onClose }) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    dateOfDate:     memory.dateOfDate,
    restaurantName: memory.restaurantName,
    rating:         memory.rating,
    feedback:       memory.feedback || ''
  });
  const [images, setImages] = useState(memory.images || []);
  const [newFiles, setNewFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [removeId, setRemoveId] = useState(null);

  const remainingSlots = useMemo(() => Math.max(0, 5 - images.length), [images.length]);
  const activeImage = images[activeIndex];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['memories'] });
    queryClient.invalidateQueries({ queryKey: ['recent-memories'] });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMemory(memory.id, {
        dateOfDate:     form.dateOfDate,
        restaurantName: form.restaurantName,
        rating:         Number(form.rating),
        feedback:       form.feedback
      });
      if (newFiles.length) {
        const result = await uploadImages(memory.id, newFiles);
        setImages((prev) => [...prev, ...(result.uploaded || [])]);
        setNewFiles([]);
      }
      addToast('Memory updated 💕', 'success');
      refresh();
      setIsEditing(false);
    } catch (err) {
      addToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setShowConfirm(false);
    try {
      await deleteMemory(memory.id);
      addToast('Memory deleted', 'success');
      refresh();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const handleRemoveImage = async (imageId) => {
    try {
      await deleteImage(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      addToast('Image removed', 'success');
      refresh();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to remove image', 'error');
    } finally {
      setRemoveId(null);
    }
  };

  const handleNewFiles = (e) => {
    const incoming = Array.from(e.target.files || []);
    setNewFiles(incoming.slice(0, remainingSlots));
  };

  useEffect(() => {
    if (activeIndex >= images.length) setActiveIndex(Math.max(0, images.length - 1));
  }, [images, activeIndex]);

  const goPrev = () => {
    if (!images.length) return;
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  const goNext = () => {
    if (!images.length) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  // Shared input class
  const inputClass = 'mt-2 w-full rounded-2xl border-vault-accent/40 bg-white/70 px-3 py-2 text-sm text-vault-ink';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/35 px-4 py-6 backdrop-blur-sm">
      <div className="romantic-card my-auto w-full max-w-4xl p-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-vault-muted">Date memory</div>
            <h2 className="mt-1.5 text-2xl font-semibold text-vault-ink">{memory.restaurantName}</h2>
          </div>
          <button
            className="rounded-full bg-white/60 px-3 py-1.5 text-sm text-vault-muted transition hover:bg-white active:scale-95"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          {/* Left: form fields */}
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-vault-muted">Date</label>
                <input name="dateOfDate" type="date" disabled={!isEditing}
                  className={inputClass} value={form.dateOfDate} onChange={handleChange} />
              </div>
              <div>
                <label className="text-xs font-medium text-vault-muted">Rating</label>
                <input name="rating" type="number" min="0" max="10" disabled={!isEditing}
                  className={inputClass} value={form.rating} onChange={handleChange} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-vault-muted">Restaurant</label>
              <input name="restaurantName" disabled={!isEditing}
                className={inputClass} value={form.restaurantName} onChange={handleChange} />
            </div>
            <div>
              <label className="text-xs font-medium text-vault-muted">Feedback</label>
              <textarea name="feedback" rows="4" disabled={!isEditing}
                className={inputClass} value={form.feedback} onChange={handleChange} />
            </div>
          </div>

          {/* Right: photos */}
          <div>
            <div className="text-xs font-medium text-vault-muted">Photos</div>
            {!images.length && (
              <div className="mt-3 text-xs text-vault-muted">No images yet</div>
            )}
            {images.length > 0 && (
              <div className="mt-3 space-y-3">
                <div
                  className="relative h-56 w-full cursor-zoom-in overflow-hidden rounded-2xl bg-vault-cream"
                  onClick={() => setZoomOpen(true)}
                >
                  <ProtectedImage src={activeImage?.url} alt="Memory" className="h-full w-full object-cover" />
                  <button
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-1 text-xs shadow backdrop-blur-sm"
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  >←</button>
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-1 text-xs shadow backdrop-blur-sm"
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                  >→</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      className={`relative h-16 w-full cursor-pointer overflow-hidden rounded-xl bg-vault-cream ${
                        idx === activeIndex ? 'ring-2 ring-vault-pink' : ''
                      }`}
                      onClick={() => setActiveIndex(idx)}
                    >
                      <ProtectedImage src={img.url} alt="thumb" className="h-full w-full object-cover" />
                      {isEditing && (
                        <button
                          className="absolute right-1 top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] text-white"
                          onClick={(e) => { e.stopPropagation(); setRemoveId(img.id); }}
                        >✕</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isEditing && remainingSlots > 0 && (
              <div className="mt-4">
                <label className="text-xs font-medium text-vault-muted">
                  Add photos (max {remainingSlots})
                </label>
                <input
                  type="file" multiple accept="image/*"
                  className="mt-2 w-full rounded-2xl border-vault-accent/40 bg-white/70 px-3 py-2 text-sm"
                  onChange={handleNewFiles}
                />
                {!!newFiles.length && (
                  <div className="mt-1.5 text-xs text-vault-muted">{newFiles.length} new image(s) selected</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {!isEditing && (
              <button className="romantic-pill px-4 py-2 text-xs font-medium" onClick={() => setIsEditing(true)}>
                Edit
              </button>
            )}
            {isEditing && (
              <button className="romantic-primary px-4 py-2 text-xs" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            )}
            {isEditing && (
              <button className="romantic-pill px-4 py-2 text-xs font-medium" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            )}
            <button className="romantic-pill w-full px-4 py-2 text-xs font-medium md:w-auto" onClick={onClose}>
              Close
            </button>
          </div>
          <button
            className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-600 active:scale-95"
            onClick={() => setShowConfirm(true)}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Confirm dialogs */}
      <ConfirmDialog open={showConfirm} title="Delete this memory?" message="This will permanently remove the date and its images."
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setShowConfirm(false)} />
      <ConfirmDialog open={!!removeId} title="Remove this image?" message="This image will be permanently deleted from this memory."
        confirmText="Remove" onConfirm={() => handleRemoveImage(removeId)} onCancel={() => setRemoveId(null)} />

      {/* Zoom overlay */}
      {zoomOpen && activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl">
            <div className="h-[70vh] w-full overflow-hidden rounded-3xl bg-black">
              <ProtectedImage src={activeImage.url} alt="Zoom" className="h-full w-full object-contain" />
            </div>
            <button className="absolute right-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs backdrop-blur-sm"
              onClick={() => setZoomOpen(false)}>Close</button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-1 text-xs backdrop-blur-sm"
              onClick={goPrev}>←</button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-1 text-xs backdrop-blur-sm"
              onClick={goNext}>→</button>
          </div>
        </div>
      )}
    </div>
  );
}
