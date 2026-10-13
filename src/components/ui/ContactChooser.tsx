"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { site, telHref, whatsappLink, type ContactLine } from "@/lib/site";
import { ArrowRightIcon, CloseIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";

type Props = {
  channel: "call" | "whatsapp";
  /** WhatsApp prefill. Use `getMessage` instead when it depends on state at click time. */
  message?: string;
  getMessage?: () => string;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
};

const defaultMessage = `Hi ${site.name}! I'd like to know more about your equipment.`;

/**
 * A call or WhatsApp link that first asks which line to use (UAE or India).
 * Without JS the href still works: calls go to the UAE line, WhatsApp to the India line.
 */
export function ContactChooser({ channel, message, getMessage, className, children, ...rest }: Props) {
  const [prefill, setPrefill] = useState<string | null>(null);
  const isCall = channel === "call";
  const fallback = isCall
    ? telHref(site.lines[0])
    : whatsappLink(message ?? defaultMessage, site.lines[1]);

  return (
    <>
      <a
        href={fallback}
        {...(!isCall && { target: "_blank", rel: "noopener noreferrer" })}
        aria-haspopup="dialog"
        className={className}
        onClick={(e) => {
          // Let modified clicks (new tab, etc.) use the fallback link.
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          e.preventDefault();
          setPrefill(getMessage?.() ?? message ?? defaultMessage);
        }}
        {...rest}
      >
        {children}
      </a>
      {prefill !== null && (
        <ChooserDialog channel={channel} message={prefill} onClose={() => setPrefill(null)} />
      )}
    </>
  );
}

function ChooserDialog({
  channel,
  message,
  onClose,
}: {
  channel: Props["channel"];
  message: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const isCall = channel === "call";

  useEffect(() => {
    // No close() in cleanup: unmounting removes it from the top layer, and a queued
    // `close` event would otherwise dismiss the re-opened dialog under Strict Mode.
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const hrefFor = (line: ContactLine) => (isCall ? telHref(line) : whatsappLink(message, line));
  const Icon = isCall ? PhoneIcon : WhatsAppIcon;

  return createPortal(
    <dialog
      ref={ref}
      aria-labelledby="contact-chooser-title"
      onClose={onClose}
      // A click on the backdrop lands on the <dialog> itself.
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      className="m-auto w-[min(calc(100vw-32px),420px)] rounded-3xl bg-white p-0 text-ink shadow-[0_30px_60px_rgb(11_28_49/0.3)] backdrop:bg-navy-deep/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 md:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className={`flex size-12 shrink-0 items-center justify-center rounded-full ${
                isCall ? "bg-mist text-navy" : "bg-whatsapp/10 text-whatsapp"
              }`}
            >
              <Icon size={22} />
            </span>
            <div>
              <h2 id="contact-chooser-title" className="font-display text-[22px] font-medium leading-tight">
                {isCall ? "Call us" : "Chat on WhatsApp"}
              </h2>
              <p className="text-sm text-muted">Which number would you like to reach?</p>
            </div>
          </div>
          <button
            type="button"
            autoFocus
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <ul className="flex flex-col gap-3">
          {site.lines.map((line) => (
            <li key={line.id}>
              <a
                href={hrefFor(line)}
                {...(!isCall && { target: "_blank", rel: "noopener noreferrer" })}
                onClick={() => ref.current?.close()}
                className="group flex items-center gap-4 rounded-2xl border border-divider p-4 transition-all hover:border-navy hover:bg-surface"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-bold tracking-[0.12em] text-white">
                  {line.id === "uae" ? "UAE" : "IN"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                    {line.region}
                  </span>
                  <span className="block text-lg font-bold">{line.display}</span>
                </span>
                <ArrowRightIcon size={18} className="shrink-0 text-rose-deep transition-transform group-hover:translate-x-1" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </dialog>,
    document.body,
  );
}
