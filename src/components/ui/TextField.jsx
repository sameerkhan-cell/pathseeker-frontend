import { forwardRef } from "react";

/**
 * TextField — Styled text input with label, error state, helper text.
 *
 * Props:
 * - label: string (rendered above input)
 * - name: string (input name + id)
 * - type: string (default "text")
 * - value: string
 * - onChange: change handler
 * - error: string (error message — shows red border + message)
 * - placeholder: string
 * - required: boolean
 * - disabled: boolean
 * - className: extra wrapper classes
 * - inputClassName: extra input classes
 * - ...rest: forwarded to <input>
 */
const TextField = forwardRef(function TextField(
  {
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    placeholder,
    required = false,
    disabled = false,
    className = "",
    inputClassName = "",
    ...rest
  },
  ref
) {
  const inputId = name || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-body-sm font-medium text-text-primary"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`
          w-full
          px-4 py-2.5
          text-body-base text-text-primary
          placeholder:text-text-muted/60
          bg-[var(--bg-input)]
          border rounded-button
          ${error ? "border-red-500" : "border-border-subtle"}
          focus:outline-none focus:ring-2 focus:ring-[var(--ring-focus)] focus:border-accent-gold
          disabled:opacity-50 disabled:cursor-not-allowed
          theme-transition
          ${inputClassName}
        `.trim()}
        {...rest}
      />

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-caption text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export default TextField;
