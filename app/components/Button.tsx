type ButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost" | "success";
  size?: "md" | "sm";
  hidden?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function Button({ onClick, children, type = "button", variant = "primary", size = "md", hidden = false, disabled = false, className = "" }: Readonly<ButtonProps>) {
  if (hidden) return null;
  const base = "cursor-pointer tracking-[0.03em] transition-[background,transform] duration-200 active:scale-[0.98] font-bold rounded-[10px]";
  const sizes = {
    md: "w-full py-3.5 text-[1.05rem]",
    sm: "px-3 py-1.5 text-xs",
  };
  const styles = {
    primary: "bg-[#0369a1] text-white hover:bg-[#0284c7] disabled:opacity-40 disabled:cursor-not-allowed",
    secondary: "border-2 border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed",
    ghost: "bg-transparent disabled:opacity-40 disabled:cursor-not-allowed",
    success: "bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-40 disabled:cursor-not-allowed",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
