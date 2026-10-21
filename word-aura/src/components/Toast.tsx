export type ToastTone = "ok" | "error" | "info";

export interface ToastMessage {
  id: number;
  text: string;
  tone: ToastTone;
}

export function Toast({ toast }: { toast: ToastMessage | null }) {
  if (!toast) return null;
  return (
    <div key={toast.id} className={`toast toast-${toast.tone}`} role="status" aria-live="polite">
      {toast.text}
    </div>
  );
}
