type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
};

export default function Select({ value, onChange, options }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm rounded-lg border-2 border-[#bae6fd] bg-white text-gray-700 outline-none focus:border-[#0ea5e9] focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] transition-[border-color,box-shadow] duration-200 cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
