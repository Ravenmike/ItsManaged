interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  theme?: "light" | "dark";
  className?: string;
}

const lightVariants = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-700",
  info: "bg-brand-100 text-brand-700",
};

const darkVariants = {
  default: "bg-white/10 text-white/70",
  success: "bg-green-500/15 text-green-400",
  warning: "bg-yellow-500/15 text-yellow-400",
  danger: "bg-red-500/15 text-red-400",
  info: "bg-violet/15 text-violet-light",
};

export function Badge({
  children,
  variant = "default",
  theme = "light",
  className = "",
}: BadgeProps) {
  const styles = theme === "dark" ? darkVariants : lightVariants;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
