type ModalProps = {
  show: boolean;
  title: string;
  children: React.ReactNode;
  size?: "md" | "xl";
};

export default function Modal({ show, title, children, size = "md" }: Readonly<ModalProps>) {
  if (!show) return null;
  const maxW = size === "xl" ? "max-w-5xl" : "max-w-md";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxW} flex flex-col max-h-[90vh]`}>
        <div className="p-6 pb-2 shrink-0">
          <h2 className="text-[#0369a1] font-bold text-lg">{title}</h2>
        </div>
        <div className="overflow-y-auto px-6 pb-6 flex flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}
