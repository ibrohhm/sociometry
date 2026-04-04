type RadioGroupProps = {
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export default function RadioGroup({ name, options, value, onChange }: RadioGroupProps) {
  return (
    <div className="flex flex-col gap-1">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="accent-[#0ea5e9]"
          />
          {option}
        </label>
      ))}
    </div>
  );
}
