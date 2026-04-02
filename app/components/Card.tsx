type CardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  noPadding?: boolean;
};

export default function Card({ title, subtitle, children }: Readonly<CardProps>) {
  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="bg-[#f0f9ff] px-6 py-4 text-center border-b border-[#bae6fd]">
        <p className="text-[#0369a1] text-[0.82rem] font-semibold uppercase tracking-[0.08em]">
          {title}
        </p>
        {subtitle && (
          <p className="text-[#0369a1]/60 text-[0.75rem] font-medium mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      <div className="px-6 pt-5 pb-6 flex flex-col gap-3">{children}</div>
    </div>
  );
}
