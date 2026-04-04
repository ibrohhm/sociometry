import * as XLSX from "xlsx";
import { CATEGORIES } from "../constants/categories";
import type { SociomatrixData } from "../types/nomination";

export function exportNominationsXlsx(teamName: string, result: SociomatrixData) {
  const header1 = ["No", "Name", ...CATEGORIES.flatMap((c) => [c, ""])];
  const header2 = ["", "", ...CATEGORIES.flatMap(() => ["+", "-"])];
  const dataRows = Object.entries(result).map(([name, cats], i) => [
    i + 1,
    name,
    ...CATEGORIES.flatMap((c) => [cats[c]?.positive ?? 0, cats[c]?.negative ?? 0]),
  ]);

  const ws = XLSX.utils.aoa_to_sheet([header1, header2, ...dataRows]);

  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // No
    { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Name
    ...CATEGORIES.map((_, i) => ({
      s: { r: 0, c: 2 + i * 2 },
      e: { r: 0, c: 3 + i * 2 },
    })),
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sociomatrix");
  XLSX.writeFile(wb, `${teamName}-sociomatrix.xlsx`);
}
