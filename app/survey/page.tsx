"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Sociometry from "../components/Sociometry";
import Button from "../components/Button";
import Card from "../components/Card";
import SurveyTable from "../components/SurveyTable";

type Question = {
  id: number;
  category: string;
  question: string;
};

type Category = {
  category: string;
  label: string;
  questions: { id: number; text: string }[];
};

type Member = {
  id: number;
  name: string;
  submitted: boolean;
};

type Team = {
  id: string;
  name: string;
  members: Member[];
  pin: string;
};

function memberClassName(submitted: boolean, selected: boolean): string {
  if (submitted) return "border-gray-200 bg-gray-50 text-gray-400 line-through";
  if (selected) return "border-[#0ea5e9] bg-[#f0f9ff] text-[#0369a1]";
  return "border-[#bae6fd] bg-white text-gray-700 hover:border-[#0ea5e9]";
}

function buildAnswerKeys(data: Category[]): string[] {
  return data.flatMap((c) =>
    c.questions.map((_, i) => `${c.category}${i + 1}`)
  );
}

export default function SurveyPage() {
  const pin = useSearchParams().get("pin") ?? "";
  const [team, setTeam] = useState<Team | null>(null);
  const [teamError, setTeamError] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentUser, setCurrentUser] = useState("");
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/teams/${encodeURIComponent(pin)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Team not found");
        return res.json();
      })
      .then((data: Team) => setTeam(data))
      .catch(() => setTeamError(true));
  }, [pin]);

  useEffect(() => {
    fetch(`/api/questions`)
      .then((res) => res.json())
      .then((data: Question[]) => {
        const grouped = data.reduce<Record<string, Category>>((acc, q) => {
          if (!acc[q.category]) {
            acc[q.category] = { category: q.category, label: q.category, questions: [] };
          }
          acc[q.category].questions.push({ id: q.id, text: q.question });
          return acc;
        }, {});
        const cats = Object.values(grouped);
        setCategories(cats);
        setAnswers(Object.fromEntries(buildAnswerKeys(cats).map((id) => [id, ""])));
      });
  }, []);

  const allQuestions = categories.flatMap((c) =>
    c.questions.map((q, i) => ({
      id: `${c.category}${i + 1}`,
      questionId: q.id,
      text: q.text,
      category: c.category,
      label: c.label,
    }))
  );

  function handleChange(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit() {
    const unanswered = allQuestions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) return;

    const submitter = team?.members.find((m) => m.name === currentUser);
    if (!submitter) return;

    const nominations = allQuestions.map((q) => {
      const nomineeName = answers[q.id];
      const nominee = team?.members.find((m) => m.name === nomineeName);
      return { question_id: q.questionId, nominee_id: nominee!.id };
    });

    const res = await fetch("/api/survey/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submitter_id: submitter.id, nominations }),
    });

    if (!res.ok) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="w-full max-w-md text-center">
        <Sociometry />
        <p className="mt-10 text-white/80 text-sm">You have already submitted this survey. Thank you for your response!</p>
      </div>
    );
  }

  if (teamError) {
    return (
      <div className="w-full max-w-sm p-8 flex flex-col items-center gap-4 text-center">
        <Sociometry />
        <p className="text-white/80 text-sm">Survey not found. The PIN may be invalid or expired.</p>
        <Button onClick={() => { globalThis.location.href = "/"; }}>Back to Home</Button>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="w-full max-w-sm p-8 flex flex-col gap-6">
        <div className="text-center">
          <Sociometry />
        </div>
        <Card title={team?.name ?? "Loading..."}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Who are you?</p>
          <ul className="flex flex-col gap-2">
            {(team?.members ?? []).map((member) => (
              <li key={member.name}>
                <Button
                  variant="ghost"
                  onClick={() => setCurrentUser(member.name)}
                  disabled={member.submitted}
                  className={`text-left px-4 py-2.5 text-sm font-medium border-2 transition-all duration-150 ${memberClassName(member.submitted, currentUser === member.name)}`}
                >
                  {member.name}
                </Button>
              </li>
            ))}
          </ul>
          <Button onClick={() => setStarted(true)} disabled={!currentUser}>
            Start Survey
          </Button>
        </Card>
      </div>
    );
  }

  const names = ["", ...(team?.members ?? []).filter((m) => m.name !== currentUser).map((m) => m.name)];

  return (
    <div className="w-full max-w-3xl p-8">
      <div className="text-center mb-8">
        <Sociometry />
        <p className="mt-2 text-white/80 text-sm">Answer each question by selecting a name from the list.</p>
      </div>
      <Card title="Form Survey">
        <SurveyTable
          categories={categories}
          names={names}
          answers={answers}
          onAnswerChange={handleChange}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </Card>
    </div>
  );
}
