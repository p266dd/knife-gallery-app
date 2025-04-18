"use client";

export default function Button({
  type = "button",
  variant = "primary",
  onClick = () => {},
  children,
}) {
  const styles = {
    primary:
      "px-4 py-3 bg-slate-800 text-white active:bg-slate-900 cursor-pointer font-semibold rounded-lg",
    flat: "rounded-lg px-4 py-3 cursor-pointer bg-slate-100 text-slate-500 border-1 border-slate-300",
    loading:
      "rounded-lg px-4 py-3 cursor-pointer bg-slate-300 text-slate-600 border-1 border-slate-500",
  };

  return (
    <button type={type} onClick={onClick} className={`${styles[variant]}`}>
      {children}
    </button>
  );
}
