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
    primary:
      "bg-slate-800 text-white active:bg-slate-900 cursor-pointer rounded-lg",
    flat: "rounded-lg cursor-pointer bg-slate-100 text-slate-500 border-1 border-slate-300",
    loading:
      "rounded-lg cursor-pointer bg-slate-300 text-slate-600 border-1 border-slate-500",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 font-semibold",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
}
