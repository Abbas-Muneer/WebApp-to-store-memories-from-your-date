export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
      <div className="romantic-card w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-vault-ink">{title}</h3>
        <p className="mt-2 text-sm text-vault-muted">{message}</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            className="romantic-pill px-4 py-2 text-xs font-medium"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-600 active:scale-95"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
