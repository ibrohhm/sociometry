import { UserButton } from "@clerk/nextjs";
import Sociometry from "./Sociometry";

type Props = {
  fullName: string | null;
  email: string | null;
};

export default function AdminHeader({ fullName, email }: Props) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white/10 backdrop-blur-sm border-b border-white/20">
      <Sociometry size="sm" />

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-white leading-tight">{fullName}</p>
          <p className="text-xs text-white/60">{email}</p>
        </div>
        <UserButton />
      </div>
    </header>
  );
}
