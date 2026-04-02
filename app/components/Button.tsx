type ButtonProps = {
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
};

export default function Button({ onClick, children, type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full py-3.5 text-[1.05rem] font-bold rounded-[10px] bg-[#1c1c1e] text-white cursor-pointer tracking-[0.03em] transition-[background,transform] duration-200 hover:bg-[#3c3c3e] active:scale-[0.98]"
    >
      {children}
    </button>
  );
}
