import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: "light" | "dark";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, id, variant = "light", ...props }, ref) => {
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
        <input
          ref={ref}
          id={id}
          className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:opacity-50 ${
            isDark
              ? "border-white/12 bg-white/8 text-white placeholder:text-white/40 focus:border-violet focus:ring-violet"
              : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:ring-brand-500"
          } ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""} ${className}`}
          {...props}
        />
        {error && <p className={`text-sm ${isDark ? "text-red-400" : "text-red-600"}`}>{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
