type RemovableItemProps = {
  label: string;
  onRemove: () => void;
};

export default function RemovableItem({ label, onRemove }: Readonly<RemovableItemProps>) {
  return (
    <li className="flex items-center justify-between text-sm text-gray-700 bg-[#f0f9ff] rounded-lg px-3 py-1.5">
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#0ea5e9] shrink-0" />
        {label}
      </span>
      <button
        onClick={onRemove}
        className="text-red-400 hover:text-red-600 text-xs font-bold ml-2"
      >
        ✕
      </button>
    </li>
  );
}
