import { AlertIcon } from "./icons";

/** Shared styling for site forms (contact, checkout). */
export const inputClass =
  "w-full rounded-xl border border-divider bg-surface px-5 py-4 text-[15px] text-ink transition-all placeholder:text-muted/70 focus:border-navy focus:bg-white focus:outline-none focus:ring-4 focus:ring-navy/10 aria-invalid:border-rose-deep aria-invalid:bg-blush";

/** id, name, validity and error wiring for an input named `name`. */
export function fieldProps<T extends string>(name: T, errors: Partial<Record<T, string>>, required = true) {
  return {
    id: name,
    name,
    required,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    className: inputClass,
  };
}

export function Field({
  name,
  label,
  error,
  optional = false,
  className = "",
  children,
}: {
  name: string;
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={name} className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">
        {label}
        {optional && <span className="ml-1.5 normal-case tracking-normal text-muted">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-rose-deep">
          <AlertIcon size={14} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
