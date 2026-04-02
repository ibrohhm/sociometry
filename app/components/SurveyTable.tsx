type Category = {
  category: string;
  label: string;
  questions: string[];
};

type SurveyTableProps = {
  categories: Category[];
  names: string[];
  answers: Record<string, string>;
  onAnswerChange: (id: string, value: string) => void;
};

export default function SurveyTable({ categories, names, answers, onAnswerChange }: Readonly<SurveyTableProps>) {
  let questionNumber = 1;

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-[#e0f2fe]">
          <th className="border border-[#bae6fd] px-4 py-3 text-[0.82rem] font-bold text-[#0369a1] text-center w-28">
            Category
          </th>
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
            const num = questionNumber++;
            const isFirst = qi === 0;
            return (
              <tr key={id} className="hover:bg-sky-50 transition-colors">
                {isFirst && (
                  <td
                    rowSpan={cat.questions.length}
                    className="border border-[#bae6fd] px-4 py-3 text-center align-middle bg-[#f0f9ff]"
                  >
                    <span className="block text-xl font-black text-[#0369a1]">{cat.category}</span>
                    <span className="block text-xs font-semibold text-[#0369a1]/70 mt-0.5">{cat.label}</span>
                  </td>
                )}
                <td className="border border-[#bae6fd] px-4 py-3 text-sm text-gray-700">
                  {num}. {question}
                </td>
                <td className="border border-[#bae6fd] px-3 py-2 bg-amber-50">
                  <select
                    value={answers[id]}
                    onChange={(e) => onAnswerChange(id, e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border-2 border-[#bae6fd] bg-white text-gray-700 outline-none focus:border-[#0ea5e9] focus:shadow-[0_0_0_3px_rgba(14,165,233,0.15)] transition-[border-color,box-shadow] duration-200 cursor-pointer"
                  >
                    {names.map((name) => (
                      <option key={name} value={name}>
                        {name || "-- Select a name --"}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
