type Props = {
  size?: "sm" | "lg";
};

export default function Sociometry({ size = "lg" }: Readonly<Props>) {
  return (
    <div className="text-center">
      <h1
        className={`font-black text-white [text-shadow:0_4px_16px_rgba(0,0,0,0.3)] ${
          size === "lg" ? "text-5xl" : "text-2xl"
        }`}
      >
        Socio<span className="text-amber-400">metry</span>
      </h1>
    </div>
  );
}
