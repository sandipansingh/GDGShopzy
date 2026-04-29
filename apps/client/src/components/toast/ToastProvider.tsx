import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastVariant = "success" | "error" | "warning" | "info";

type Toast = {
  id: number;
  title?: string;
  message: string;
  variant: ToastVariant;
};

type ToastInput = Omit<Toast, "id">;

type ToastContextValue = {
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  dismiss: (id: number) => void;
};

const toastStyles: Record<ToastVariant, string> = {
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-100",
  error: "border-red-500/40 bg-red-500/10 text-red-100",
  warning: "border-amber-500/40 bg-amber-500/10 text-amber-100",
  info: "border-border bg-card text-foreground",
};

export const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutsRef = useRef<Map<number, number>>(new Map());

  const dismiss = useCallback((id: number) => {
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: ToastInput) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((current) => [...current.slice(-3), { ...toast, id }]);
      const timeoutId = window.setTimeout(() => dismiss(id), 4001);
      timeoutsRef.current.set(id, timeoutId);
    },
    [dismiss],
  );

  useEffect(
    () => () => {
      timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutsRef.current.clear();
    },
    [],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (message, title) => pushToast({ message, title, variant: "success" }),
      error: (message, title) => pushToast({ message, title, variant: "error" }),
      warning: (message, title) => pushToast({ message, title, variant: "warning" }),
      info: (message, title) => pushToast({ message, title, variant: "info" }),
      dismiss,
    }),
    [dismiss, pushToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-atomic="true"
        aria-live="polite"
        className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto border p-4 shadow-lg ${toastStyles[toast.variant]}`}
            role={toast.variant === "error" || toast.variant === "warning" ? "alert" : "status"}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                {toast.title && (
                  <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em]">
                    {toast.title}
                  </p>
                )}
                <p className="text-sm">{toast.message}</p>
              </div>
              <button
                type="button"
                aria-label={`Dismiss ${toast.title ?? toast.variant} notification`}
                className="text-xs uppercase tracking-wider font-mono hover:underline"
                onClick={() => dismiss(toast.id)}
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
