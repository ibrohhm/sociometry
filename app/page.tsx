"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "./components/Button";
import Card from "./components/Card";
import Sociometry from "./components/Sociometry";

export default function Home() {
  const pinRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function joinSurvey() {
    const pin = pinRef.current?.value.trim();
    if (!pin) {
      pinRef.current?.focus();
      return;
    }
    router.push("/survey/" + encodeURIComponent(pin));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") joinSurvey();
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white [background:radial-gradient(ellipse_at_70%_30%,#7c3aed_0%,#4c1d95_50%,#2e1065_100%)] [font-family:'Segoe_UI',system-ui,sans-serif]">
      <div className="flex flex-col items-center gap-8 p-8 w-full max-w-[460px]">
        <Sociometry />
        <p className="-mt-4 text-[0.95rem] opacity-85 max-w-[300px] leading-relaxed text-center">
          Map relationships in your group. Enter a survey PIN shared by your
          facilitator to begin.
        </p>

        <Card title="Join a survey">
          <input
            ref={pinRef}
            type="text"
            placeholder="Survey PIN"
            maxLength={10}
            inputMode="numeric"
            className="w-full py-3.5 px-4 text-[1.1rem] font-semibold text-center border-2 border-[#ddd6fe] rounded-[10px] outline-none text-[#1e1b4b] bg-[#fafafa] tracking-[0.12em] transition-[border-color,box-shadow] duration-200 placeholder:text-[#a78bfa] placeholder:font-medium placeholder:tracking-[0.05em] focus:border-[#7c3aed] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)] focus:bg-white"
            onKeyDown={handleKeyDown}
          />
          <Button onClick={joinSurvey}>Enter</Button>
        </Card>

        <p className="text-center text-[0.85rem] opacity-75 max-w-[320px] leading-relaxed">
          Don&apos;t have a PIN? Ask your group leader.
          <br />
          Are you a facilitator?{" "}
          <a href="/admin" className="text-[#c4b5fd] font-semibold no-underline hover:underline">
            Create a survey &rarr;
          </a>
        </p>
      </div>
    </div>
  );
}
