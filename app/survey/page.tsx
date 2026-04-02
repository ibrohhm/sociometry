"use client";

import { useState, useEffect } from "react";
import Sociometry from "../components/Sociometry";
import Button from "../components/Button";
import Card from "../components/Card";
import SurveyTable from "../components/SurveyTable";

type Category = {
  category: string;
  label: string;
  questions: string[];
};

function buildAnswerKeys(data: Category[]): string[] {
  return data.flatMap((c) =>
    c.questions.map((_, i) => `${c.category}${i + 1}`)
  );
}

const NAMES = [
  "",
  "Doddy Bilhaqi",
  "Fauzan Hanif",
  "Ahmad Rizki",
  "Siti Rahayu",
  "Budi Santoso",
];

export default function SurveyPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: Category[]) => {
        setCategories(data);
        setAnswers(Object.fromEntries(buildAnswerKeys(data).map((id) => [id, ""])));
      });
  }, []);

  const allQuestions = categories.flatMap((c) =>
    c.questions.map((q, i) => ({
      id: `${c.category}${i + 1}`,
      text: q,
      category: c.category,
      label: c.label,
    }))
  );

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
    <div className="w-full max-w-3xl p-8">
      <div className="text-center mb-8">
        <Sociometry />
        <p className="mt-2 text-white/80 text-sm">Answer each question by selecting a name from the list.</p>
      </div>
      <Card title="Form Survey">
        <SurveyTable
          categories={categories}
          names={NAMES}
          answers={answers}
          onAnswerChange={handleChange}
        />
        <Button onClick={handleSubmit}>Submit</Button>
      </Card>
    </div>
  );
}
