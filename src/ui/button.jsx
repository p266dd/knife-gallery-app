"use client";

export default function Button({
  type = "button",
  variant = "primary",
  size = "md",
  onClick = () => {},
  disabled = false,
  children,
}) {
  const styles = {
    base: "flex items-center justify-center gap-3 cursor-pointer rounded-lg",
    primary: "bg-slate-800 text-white active:bg-slate-900",
    danger: "bg-red-200 text-red-600 active:bg-red-300",
    flat: "bg-slate-100 text-slate-600 border-1 border-slate-300",
    loading: "bg-slate-200 text-slate-600 border-1 border-slate-300",
    ghost: "bg-transparent text-slate-800",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2",
    lg: "px-4 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles["base"]} ${styles[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
}
