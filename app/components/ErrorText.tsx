type ErrorTextProps = {
  children: React.ReactNode;
  show?: boolean;
  className?: string;
};

export default function ErrorText({ children, show = false, className = "" }: Readonly<ErrorTextProps>) {
  if (!show) return null;
  return (
    <p className={`text-sm text-red-500 ${className}`}>{children}</p>
  );
}
