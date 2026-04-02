"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./components/Button";
import Card from "./components/Card";
import Input from "./components/Input";
import Sociometry from "./components/Sociometry";

export default function Home() {
  const pinRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [error, setError] = useState("");

  async function joinSurvey() {
    const pin = pinRef.current?.value.trim();
    if (!pin) {
      pinRef.current?.focus();
      return;
    }
    setError("");
    const res = await fetch("/api/survey/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    if (!res.ok) {
      setError("Invalid PIN. Please try again.");
      return;
    }
    router.push("/survey?pin=" + encodeURIComponent(pin));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") joinSurvey();
  }

  return (
    <div className="flex flex-col items-center gap-8 p-8 w-full max-w-[460px]">
      <Sociometry />
      <p className="-mt-4 text-[0.95rem] opacity-85 max-w-[300px] leading-relaxed text-center text-white/80">
        Map relationships in your group. Enter a survey PIN shared by your
        facilitator to begin.
      </p>

      <Card title="Join a survey">
        <Input
          ref={pinRef}
          placeholder="Survey PIN"
          maxLength={10}
          inputMode="numeric"
          onKeyDown={handleKeyDown}
          className="w-full py-3.5 px-4 text-[1.1rem] font-semibold text-center rounded-[10px] text-[#0c1a2e] bg-[#fafafa] tracking-[0.12em] placeholder:text-[#38bdf8] placeholder:font-medium placeholder:tracking-[0.05em] focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] focus:bg-white"
        />
        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        <Button onClick={joinSurvey}>Enter</Button>
      </Card>

      <p className="text-center text-[0.85rem] opacity-75 max-w-[320px] leading-relaxed text-white/80">
        Don&apos;t have a PIN? Ask your group leader.
        <br />
        Are you a facilitator?{" "}
        <a href="/admin" className="text-[#7dd3fc] font-semibold no-underline hover:underline">
          Create a survey &rarr;
        </a>
      </p>
    </div>
  );
}
