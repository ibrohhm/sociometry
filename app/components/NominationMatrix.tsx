import { Fragment } from "react";
import type { NomineeRelationMap } from "../types/nomination";

type NominationMatrixProps = {
  result: NomineeRelationMap;
  showTotal?: boolean;
};

export default function NominationMatrix({ result, showTotal = true }: Readonly<NominationMatrixProps>) {
  const nominees = Object.keys(result);   // X axis (columns)
  const submitters = nominees;            // Y axis (rows) — same set of members

  const rowTotals = Object.fromEntries(
    submitters.map((submitter) => [
      submitter,
      {
        pos: submitters.filter((s) => s !== submitter && result[submitter]?.[s]?.positive).length,
        neg: submitters.filter((s) => s !== submitter && result[submitter]?.[s]?.negative).length,
      },
    ])
  );

  const grandPos = submitters.reduce((sum, s) => sum + rowTotals[s].pos, 0);
  const grandNeg = submitters.reduce((sum, s) => sum + rowTotals[s].neg, 0);
  const grandTotal = grandPos + grandNeg;

  const colTotals = Object.fromEntries(
    nominees.map((nominee) => [
      nominee,
      {
        pos: submitters.filter((s) => s !== nominee && result[nominee][s]?.positive).length,
        neg: submitters.filter((s) => s !== nominee && result[nominee][s]?.negative).length,
      },
    ])
  );

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
          {nominees.map((nominee) => (
            <th key={nominee} colSpan={2} className="border border-[#bae6fd] px-3 py-2 font-bold text-[#0369a1] text-center">
              {nominee}
            </th>
          ))}
          {showTotal && (
            <th colSpan={2} className="border border-[#bae6fd] px-4 py-2 font-bold text-[#0369a1] text-center bg-[#fce8d5]">
              Total
            </th>
          )}
        </tr>
        <tr className="bg-[#e0f2fe]">
          {nominees.map((nominee) => (
            <Fragment key={nominee}>
              <th className="border border-[#bae6fd] px-3 py-1 font-bold text-green-600 text-center w-15">+</th>
              <th className="border border-[#bae6fd] px-3 py-1 font-bold text-red-500 text-center w-15">-</th>
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
        {submitters.map((submitter, i) => (
          <tr key={submitter} className="hover:bg-sky-50 transition-colors">
            <td className="border border-[#bae6fd] px-4 py-2 text-center text-gray-600">{i + 1}</td>
            <td className="border border-[#bae6fd] px-4 py-2 text-gray-700">{submitter}</td>
            {nominees.map((nominee) => {
              const isSelf = submitter === nominee;
              const rel = result[nominee][submitter];
              let posBg = "";
              let negBg = "";
              let posLabel = "";
              let negLabel = "";
              if (isSelf) {
                posBg = "bg-gray-200"; negBg = "bg-gray-200";
              } else {
                if (rel?.positive) { posBg = "bg-green-200"; posLabel = "+"; }
                if (rel?.negative) { negBg = "bg-red-200"; negLabel = "-"; }
              }
              return (
                <Fragment key={nominee}>
                  <td className={`border border-[#bae6fd] px-3 py-2 text-center font-bold text-green-600 ${posBg}`}>
                    {posLabel}
                  </td>
                  <td className={`border border-[#bae6fd] px-3 py-2 text-center font-bold text-red-600 ${negBg}`}>
                    {negLabel}
                  </td>
                </Fragment>
              );
            })}
            {showTotal && (
              <>
                <td className="border border-[#bae6fd] px-3 py-2 text-center font-bold text-green-600 bg-[#fce8d5]">{rowTotals[submitter].pos}</td>
                <td className="border border-[#bae6fd] px-3 py-2 text-center font-bold text-red-600 bg-[#fce8d5]">{rowTotals[submitter].neg}</td>
              </>
            )}
          </tr>
        ))}
      </tbody>
      {showTotal && (
        <tfoot>
          <tr className="bg-[#fce8d5]">
            <td colSpan={2} className="border border-[#bae6fd] px-4 py-2 font-bold text-[#0369a1] text-center">
              Total
            </td>
            {nominees.map((nominee) => (
              <Fragment key={nominee}>
                <td className="border border-[#bae6fd] px-3 py-2 text-center font-bold text-green-600 bg-[#fce8d5]">{colTotals[nominee].pos}</td>
                <td className="border border-[#bae6fd] px-3 py-2 text-center font-bold text-red-600 bg-[#fce8d5]">{colTotals[nominee].neg}</td>
              </Fragment>
            ))}
            <td className="border border-[#bae6fd] px-3 py-2 text-center font-bold text-green-600 bg-white">{grandPos}</td>
            <td className="border border-[#bae6fd] px-3 py-2 text-center font-bold text-red-600 bg-white">{grandNeg}</td>
          </tr>
          <tr>
            <td colSpan={2 + nominees.length * 2} className="border border-[#bae6fd]" />
            <td colSpan={2} className="border border-[#bae6fd] px-3 py-2 text-center font-bold bg-white">{grandTotal}</td>
          </tr>
          <tr>
            <td colSpan={2 + nominees.length * 2} className="border border-[#bae6fd]" />
            <td className="border border-[#bae6fd] px-3 py-2 text-center font-bold text-green-600 bg-yellow-200">
              {grandTotal > 0 ? `${((grandPos / grandTotal) * 100).toFixed(1)}%` : "0%"}
            </td>
            <td className="border border-[#bae6fd] px-3 py-2 text-center font-bold text-red-600">
              {grandTotal > 0 ? `${((grandNeg / grandTotal) * 100).toFixed(1)}%` : "0%"}
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );
}
