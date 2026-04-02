"use client";

import { useState } from "react";
import Sociometry from "../components/Sociometry";
import Button from "../components/Button";
import Card from "../components/Card";
import SurveyTable from "../components/SurveyTable";

const NAMES = [
  "",
  "Doddy Bilhaqi",
  "Fauzan Hanif",
  "Ahmad Rizki",
  "Siti Rahayu",
  "Budi Santoso",
];

const CATEGORIES = [
  {
    category: "L",
    label: "Leadership",
    questions: [
      "Siapa yang menurut anda yang berkarakter leader?",
      "Siapa yang menurut anda yang berkarakter follower?",
      "Siapa yang menurut anda paling senang bekerja sama?",
    ],
  },
  {
    category: "M",
    label: "Motivation",
    questions: [
      "Siapa yang menurut anda paling bersemangat dalam bekerja?",
      "Siapa yang menurut anda paling bertanggung jawab?",
    ],
  },
  {
    category: "C",
    label: "Communication",
    questions: [
      "Siapa yang menurut anda paling mudah diajak bicara?",
      "Siapa yang menurut anda paling bisa menyampaikan pendapat?",
    ],
  },
];

export default function SurveyPage() {
  const allQuestions = CATEGORIES.flatMap((c) =>
    c.questions.map((q, i) => ({
      id: `${c.category}${i + 1}`,
      text: q,
      category: c.category,
      label: c.label,
    }))
  );

  const [answers, setAnswers] = useState<Record<string, string>>(
    Object.fromEntries(allQuestions.map((q) => [q.id, ""]))
  );
  const [submitted, setSubmitted] = useState(false);

  function handleChange(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function handleSubmit() {
    const unanswered = allQuestions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) return;
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

  return (
    <div className="w-full max-w-3xl">
      <div className="text-center mb-8">
        <Sociometry />
        <p className="mt-2 text-white/80 text-sm">Answer each question by selecting a name from the list.</p>
      </div>
      <Card title="Form Survey">
        <SurveyTable
          categories={CATEGORIES}
          names={NAMES}
          answers={answers}
          onAnswerChange={handleChange}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </Card>
    </div>
  );
}
