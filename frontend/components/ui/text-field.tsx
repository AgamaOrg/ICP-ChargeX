import { useId, type InputHTMLAttributes } from "react";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  hint?: string;
  error?: string;
};

export function TextField({ label, hint, error, className = "", ...rest }: TextFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-base font-medium text-ink">
        {label}
      </label>
      <input
        {...rest}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        className={`h-14 rounded-md border bg-surface px-4 text-lg text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${error ? "border-danger" : "border-line"} ${className}`}
      />
      {message && (
        <p id={messageId} className={`text-sm ${error ? "text-danger" : "text-ink-muted"}`}>
          {error && <span aria-hidden="true">⚠ </span>}
          {message}
        </p>
      )}
    </div>
  );
}
