import RadioGroup from "./RadioGroup";
import type { Category } from "../types/question";

type SurveyTableProps = {
  categories: Category[];
  names: string[];
  answers: Record<string, string>;
  onAnswerChange: (id: string, value: string) => void;
};

export default function SurveyTable({ categories, names, answers, onAnswerChange }: Readonly<SurveyTableProps>) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-[#e0f2fe]">
          <th className="border border-[#bae6fd] px-4 py-3 text-[0.82rem] font-bold text-[#0369a1] text-center">
            Question
          </th>
          <th className="border border-[#bae6fd] px-4 py-3 text-[0.82rem] font-bold text-amber-600 text-center w-52 bg-amber-50">
            Answer
          </th>
        </tr>
      </thead>
      <tbody>
        {categories.map((cat) =>
          cat.questions.map((question, qi) => {
            const id = `${cat.category}${qi + 1}`;
            return (
              <tr key={id} className="hover:bg-sky-50 transition-colors">
                <td className="border border-[#bae6fd] px-4 py-3 text-sm text-gray-700">
                  {question.text}
                </td>
                <td className="border border-[#bae6fd] px-3 py-2 bg-amber-50">
                  <RadioGroup
                    name={id}
                    options={names.filter(Boolean)}
                    value={answers[id]}
                    onChange={(value) => onAnswerChange(id, value)}
                  />
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
