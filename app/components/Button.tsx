type ButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  className?: string;
};

export default function Button({ onClick, children, type = "button", variant = "primary", disabled = false, className = "" }: Readonly<ButtonProps>) {
  const base = "w-full py-3.5 text-[1.05rem] font-bold rounded-[10px] cursor-pointer tracking-[0.03em] transition-[background,transform] duration-200 active:scale-[0.98]";
  const styles = {
    primary: "bg-[#0369a1] text-white hover:bg-[#0284c7] disabled:opacity-40 disabled:cursor-not-allowed",
    secondary: "border-2 border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed",
    ghost: "bg-transparent disabled:opacity-40 disabled:cursor-not-allowed",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
