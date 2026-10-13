import { whatsAppHref } from "@/lib/whatsapp";

interface WhatsAppActionProps {
  /** Pre-filled WhatsApp message. */
  message?: string;
  /** Classes for the link itself. Reused as-is on the disabled fallback. */
  className: string;
  /** Button contents — icon plus label. */
  children: React.ReactNode;
  /** Tooltip shown while WhatsApp ordering is switched off. */
  unavailableTitle?: string;
}

/**
 * A WhatsApp CTA that refuses to lie.
 *
 * When `NEXT_PUBLIC_WHATSAPP_NUMBER` is missing or still a placeholder, the
 * store cannot receive WhatsApp orders — so instead of opening a chat with a
 * stranger's number (or nobody at all) the control renders inert, dimmed and
 * `aria-disabled`, with the reason exposed to assistive tech and as a tooltip.
 * The page-level setup banner carries the full explanation.
 */
export default function WhatsAppAction({
  message,
  className,
  children,
  unavailableTitle = "WhatsApp ordering is not set up yet — add NEXT_PUBLIC_WHATSAPP_NUMBER to enable it.",
}: WhatsAppActionProps) {
  const href = whatsAppHref(message);

  if (!href) {
    return (
      <span
        className={`${className} cursor-not-allowed opacity-55`}
        title={unavailableTitle}
        aria-disabled="true"
      >
        {children}
        <span className="sr-only">
          {" "}
          — unavailable: this store has not configured a WhatsApp number yet.
        </span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
