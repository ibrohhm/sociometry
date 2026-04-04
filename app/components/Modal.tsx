type ModalProps = {
  show: boolean;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ show, title, children }: Readonly<ModalProps>) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
        <h2 className="text-[#0369a1] font-bold text-lg">{title}</h2>
        {children}
      </div>
    </div>
  );
}
