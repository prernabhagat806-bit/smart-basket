import React from 'react';
import { Bell, CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'alert' | 'info';
  title: string;
  message: string;
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg backdrop-blur-md flex items-start justify-between gap-3 animate-in slide-in-from-bottom duration-200 ${
            toast.type === 'alert'
              ? 'bg-rose-900 text-white border-rose-700'
              : toast.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {toast.type === 'alert' ? (
              <Bell className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-xs font-bold leading-tight">{toast.title}</div>
              <div className="text-[11px] text-slate-200 mt-0.5 leading-snug">{toast.message}</div>
            </div>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white transition-colors p-0.5"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
