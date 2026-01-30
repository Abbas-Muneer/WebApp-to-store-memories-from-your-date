import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import ProtectedImage from "./ProtectedImage";
import { updateMemory, deleteMemory, uploadImages, deleteImage } from "../api/memories";
import { useToast } from "./ToastProvider";
import ConfirmDialog from "./ConfirmDialog";

export default function MemoryModal({ memory, onClose }) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    dateOfDate: memory.dateOfDate,
    restaurantName: memory.restaurantName,
    rating: memory.rating,
    feedback: memory.feedback || ""
  });
  const [images, setImages] = useState(memory.images || []);
  const [newFiles, setNewFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [removeId, setRemoveId] = useState(null);

  const remainingSlots = useMemo(() => Math.max(0, 5 - images.length), [images.length]);
  const activeImage = images[activeIndex];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["memories"] });
    queryClient.invalidateQueries({ queryKey: ["recent-memories"] });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMemory(memory.id, {
        dateOfDate: form.dateOfDate,
        restaurantName: form.restaurantName,
        rating: Number(form.rating),
        feedback: form.feedback
      });

      if (newFiles.length) {
        const result = await uploadImages(memory.id, newFiles);
        setImages((prev) => [...prev, ...(result.uploaded || [])]);
        setNewFiles([]);
      }

      addToast("Memory updated", "success");
      refresh();
      setIsEditing(false);
    } catch (err) {
      addToast(err.response?.data?.message || "Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setShowConfirm(false);
    try {
      await deleteMemory(memory.id);
      addToast("Memory deleted", "success");
      refresh();
      onClose();
    } catch (err) {
      addToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const handleRemoveImage = async (imageId) => {
    try {
      await deleteImage(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      addToast("Image removed", "success");
      refresh();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to remove image", "error");
    } finally {
      setRemoveId(null);
    }
  };

  const handleNewFiles = (event) => {
    const incoming = Array.from(event.target.files || []);
    const allowed = incoming.slice(0, remainingSlots);
    setNewFiles(allowed);
  };

  useEffect(() => {
    if (activeIndex >= images.length) {
      setActiveIndex(Math.max(0, images.length - 1));
    }
  }, [images, activeIndex]);

  const goPrev = () => {
    if (!images.length) return;
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goNext = () => {
    if (!images.length) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-card max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-vault-muted">Date memory</div>
            <h2 className="mt-2 text-2xl font-semibold text-vault-ink">{memory.restaurantName}</h2>
          </div>
          <button className="text-xl text-slate-400" onClick={onClose}>
            X
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs text-slate-500">Date</label>
                <input
                  name="dateOfDate"
                  type="date"
                  disabled={!isEditing}
                  className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  value={form.dateOfDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Rating</label>
                <input
                  name="rating"
                  type="number"
                  min="0"
                  max="10"
                  disabled={!isEditing}
                  className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  value={form.rating}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500">Restaurant</label>
              <input
                name="restaurantName"
                disabled={!isEditing}
                className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                value={form.restaurantName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Feedback</label>
              <textarea
                name="feedback"
                rows="4"
                disabled={!isEditing}
                className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                value={form.feedback}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-500">Photos</div>
            {!images.length && (
              <div className="mt-3 text-xs text-slate-400">No images yet</div>
            )}
            {images.length > 0 && (
              <div className="mt-3 space-y-3">
                <div
                  className="relative h-56 w-full overflow-hidden rounded-2xl bg-slate-100"
                  onClick={() => setZoomOpen(true)}
                >
                  <ProtectedImage src={activeImage?.url} alt="Memory" className="h-full w-full object-cover" />
                  <button
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      goPrev();
                    }}
                  >
                    Prev
                  </button>
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-1 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      goNext();
                    }}
                  >
                    Next
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, index) => (
                    <div
                      key={img.id}
                      className={
                        "relative h-16 w-full overflow-hidden rounded-xl bg-slate-100 " +
                        (index === activeIndex ? "ring-2 ring-vault-navy" : "")
                      }
                      onClick={() => setActiveIndex(index)}
                    >
                      <ProtectedImage src={img.url} alt="Memory thumb" className="h-full w-full object-cover" />
                      {isEditing && (
                        <button
                          className="absolute right-1 top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRemoveId(img.id);
                          }}
                        >
                          X
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isEditing && remainingSlots > 0 && (
              <div className="mt-4">
                <label className="text-xs text-slate-500">Add photos (max {remainingSlots})</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="mt-2 w-full rounded-2xl border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  onChange={handleNewFiles}
                />
                {!!newFiles.length && (
                  <div className="mt-2 text-xs text-slate-500">{newFiles.length} new image(s) selected</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {!isEditing && (
              <button
                className="rounded-full border border-vault-navy px-4 py-2 text-xs font-semibold text-vault-navy"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}
            {isEditing && (
              <button
                className="rounded-full bg-vault-navy px-4 py-2 text-xs font-semibold text-white"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            )}
            {isEditing && (
              <button
                className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-500"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            )}
            <button
              className="w-full rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-500 md:w-auto"
              onClick={onClose}
            >
              Close
            </button>
          </div>
          <button
            className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white"
            onClick={() => setShowConfirm(true)}
          >
            Delete
          </button>
        </div>
      </div>
      <ConfirmDialog
        open={showConfirm}
        title="Delete this memory?"
        message="This will permanently remove the date and its images."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
      <ConfirmDialog
        open={!!removeId}
        title="Remove this image?"
        message="This image will be permanently deleted from this memory."
        confirmText="Remove"
        onConfirm={() => handleRemoveImage(removeId)}
        onCancel={() => setRemoveId(null)}
      />
      {zoomOpen && activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="relative w-full max-w-4xl">
            <div className="h-[70vh] w-full overflow-hidden rounded-3xl bg-black">
              <ProtectedImage src={activeImage.url} alt="Zoom" className="h-full w-full object-contain" />
            </div>
            <button
              className="absolute right-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs"
              onClick={() => setZoomOpen(false)}
            >
              Close
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-1 text-xs"
              onClick={goPrev}
            >
              Prev
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-1 text-xs"
              onClick={goNext}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
