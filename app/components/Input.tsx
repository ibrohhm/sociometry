import { forwardRef } from "react";

type InputProps = {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, value, onChange, placeholder, onKeyDown, maxLength, inputMode, className = "" }, ref) => {
    return (
      <input
        id={id}
        ref={ref}
        type="text"
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        className={`px-3 py-2 text-sm rounded-lg border-2 border-[#bae6fd] outline-none focus:border-[#0ea5e9] transition-colors ${className}`}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
