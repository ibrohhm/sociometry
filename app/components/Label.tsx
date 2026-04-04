type LabelProps = {
  htmlFor?: string;
  children: React.ReactNode;
};

export default function Label({ htmlFor, children }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {children}
    </label>
  );
}
