type LoadingOverlayProps = {
  loading?: boolean;
};

export default function LoadingOverlay({ loading = false }: Readonly<LoadingOverlayProps>) {
  if (!loading) return null;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50">
      <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  );
}
