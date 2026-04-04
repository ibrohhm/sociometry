export type Question = {
  id: number;
  category: string;
  question: string;
  valence: "positive" | "negative";
};

export type QuestionItem = {
  id: number;
  text: string;
  valence: "positive" | "negative";
};

export type Category = {
  category: string;
  label: string;
  questions: QuestionItem[];
};
