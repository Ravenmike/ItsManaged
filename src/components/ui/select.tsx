import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  variant?: "light" | "dark";
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", label, error, id, options, placeholder, variant = "light", ...props }, ref) => {
    const isDark = variant === "dark";
    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={id}
            className={`block text-sm font-medium ${isDark ? "text-white/80" : "text-gray-700"}`}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:opacity-50 ${
            isDark
              ? "border-white/12 bg-white/8 text-white focus:border-violet focus:ring-violet"
              : "border-gray-300 bg-white text-gray-900 focus:border-brand-500 focus:ring-brand-500"
          } ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className={`text-sm ${isDark ? "text-red-400" : "text-red-600"}`}>{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
