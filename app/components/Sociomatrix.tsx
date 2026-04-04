import { Fragment } from "react";
import { CATEGORIES } from "../constants/categories";
import type { SociomatrixData } from "../types/nomination";

type SociomatrixProps = {
  result: SociomatrixData;
  showTotal?: boolean;
};

export default function Sociomatrix({ result, showTotal = true }: Readonly<SociomatrixProps>) {
  const rows = Object.entries(result);

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-[#e0f2fe]">
          <th rowSpan={2} className="border border-[#bae6fd] px-4 py-2 font-bold text-[#0369a1] text-center">
            No
          </th>
          <th rowSpan={2} className="border border-[#bae6fd] px-4 py-2 font-bold text-[#0369a1] text-center">
            Name
          </th>
          {CATEGORIES.map((cat) => (
            <th key={cat} colSpan={2} className="border border-[#bae6fd] px-4 py-2 font-bold text-[#0369a1] text-center">
              {cat}
            </th>
          ))}
          {showTotal && (
            <th colSpan={2} className="border border-[#bae6fd] px-4 py-2 font-bold text-[#0369a1] text-center bg-[#fce8d5]">
              Total
            </th>
          )}
        </tr>
        <tr className="bg-[#e0f2fe]">
          {CATEGORIES.map((cat) => (
            <Fragment key={cat}>
              <th className="border border-[#bae6fd] px-3 py-1 font-bold text-green-600 text-center w-15">
                +
              </th>
              <th className="border border-[#bae6fd] px-3 py-1 font-bold text-red-500 text-center w-15">
                -
              </th>
            </Fragment>
          ))}
          {showTotal && (
            <>
              <th className="border border-[#bae6fd] px-3 py-1 font-bold text-green-600 text-center w-15 bg-[#fce8d5]">+</th>
              <th className="border border-[#bae6fd] px-3 py-1 font-bold text-red-500 text-center w-15 bg-[#fce8d5]">-</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {rows.map(([name, cats], i) => {
          const totalPos = CATEGORIES.reduce((sum, cat) => sum + (cats[cat]?.positive ?? 0), 0);
          const totalNeg = CATEGORIES.reduce((sum, cat) => sum + (cats[cat]?.negative ?? 0), 0);
          return (
            <tr key={name} className="hover:bg-sky-50 transition-colors">
              <td className="border border-[#bae6fd] px-4 py-2 text-center text-gray-600">{i + 1}</td>
              <td className="border border-[#bae6fd] px-4 py-2 text-gray-700">{name}</td>
              {CATEGORIES.map((cat) => (
                <Fragment key={cat}>
                  <td className="border border-[#bae6fd] px-3 py-2 text-center text-green-700">
                    {cats[cat]?.positive ?? 0}
                  </td>
                  <td className="border border-[#bae6fd] px-3 py-2 text-center text-red-500">
                    {cats[cat]?.negative ?? 0}
                  </td>
                </Fragment>
              ))}
              {showTotal && (
                <>
                  <td className="border border-[#bae6fd] px-3 py-2 text-center text-green-700 font-semibold">{totalPos}</td>
                  <td className="border border-[#bae6fd] px-3 py-2 text-center text-red-500 font-semibold">{totalNeg}</td>
                </>
              )}
            </tr>
          );
        })}
      </tbody>
      {showTotal && (() => {
        const grandPos = rows.reduce((sum, [, cats]) => sum + CATEGORIES.reduce((s, cat) => s + (cats[cat]?.positive ?? 0), 0), 0);
        const grandNeg = rows.reduce((sum, [, cats]) => sum + CATEGORIES.reduce((s, cat) => s + (cats[cat]?.negative ?? 0), 0), 0);
        const colSpanCategories = CATEGORIES.length * 2 + 2; // +2 for No and Name
        return (
          <tfoot>
            <tr>
              <td colSpan={colSpanCategories} className="border border-[#bae6fd]" />
              <td className="border border-[#bae6fd] px-3 py-2 text-center text-green-700 font-bold bg-[#fce8d5]">{grandPos}</td>
              <td className="border border-[#bae6fd] px-3 py-2 text-center text-red-500 font-bold bg-[#fce8d5]">{grandNeg}</td>
            </tr>
            <tr>
              <td colSpan={colSpanCategories} className="border border-[#bae6fd]" />
              <td colSpan={2} className="border border-[#bae6fd] px-3 py-2 text-center font-bold bg-[#fce8d5]">{grandPos + grandNeg}</td>
            </tr>
          </tfoot>
        );
      })()}
    </table>
  );
}
