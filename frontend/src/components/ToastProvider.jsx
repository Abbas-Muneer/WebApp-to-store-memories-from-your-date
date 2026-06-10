import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((current) => [...current, { id, message, type }]);
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed z-50 flex flex-col gap-3"
        style={{
          top: 'max(5rem, calc(env(safe-area-inset-top, 0px) + 4.5rem))',
          right: 'max(1.25rem, calc(env(safe-area-inset-right, 0px) + 1rem))',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-2xl border px-4 py-3 text-sm font-medium shadow-card backdrop-blur-sm ${
              toast.type === 'error'
                ? 'border-rose-300/50 bg-rose-500/90 text-white'
                : toast.type === 'success'
                ? 'border-emerald-300/50 bg-emerald-500/90 text-white'
                : 'border-vault-lavender/40 bg-vault-navy/90 text-white'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
