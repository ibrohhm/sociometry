import RemovableItem from "./RemovableItem";

type RemovableListProps = {
  items: string[];
  onRemove: (index: number) => void;
};

export default function RemovableList({ items, onRemove }: Readonly<RemovableListProps>) {
  if (items.length === 0) return null;

  return (
    <ul className="mt-2 flex flex-col gap-1.5">
      {items.map((item, i) => (
        <RemovableItem key={item} label={item} onRemove={() => onRemove(i)} />
      ))}
    </ul>
  );
}
