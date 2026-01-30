export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-card">
        <h3 className="text-lg font-semibold text-vault-ink">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{message}</p>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            className="rounded-full border border-slate-200 px-4 py-2 text-xs text-slate-500"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
