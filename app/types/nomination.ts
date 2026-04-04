export type Nomination = {
  team_name: string;
  submitter: string;
  category: string;
  valence: "positive" | "negative";
  question: string;
  nominee_name: string;
};

export type ValenceCount = {
  positive: number;
  negative: number;
};

export type NominationResultByCategory = Record<string, ValenceCount>;

export type NominationResult = Record<string, NominationResultByCategory>;

// nominee_name -> { positive: number of members who gave positive, negative: number of members who gave negative }
export type MemberNominationResult = Record<string, ValenceCount>;

export function calculateCohesion(result: MemberNominationResult): number {
  const nominees = Object.keys(result);
  if (nominees.length < 2) return 0;

  let totalPositive = 0;
  let totalNegative = 0;
  for (const { positive, negative } of Object.values(result)) {
    totalPositive += positive;
    totalNegative += negative;
  }

  console.log("positive: ", totalPositive)
  console.log("negative: ", totalNegative)
  const total = totalPositive + totalNegative;
  return total === 0 ? 0 : totalPositive / total;
}

export function buildNominationResultByMember(nominations: Nomination[]): MemberNominationResult {
  const tracker: Record<string, { positive: Set<string>; negative: Set<string> }> = {};

  for (const row of nominations) {
    tracker[row.nominee_name] ??= { positive: new Set(), negative: new Set() };
    tracker[row.nominee_name][row.valence].add(row.submitter);
  }

  const result: MemberNominationResult = {};
  for (const [nominee, { positive, negative }] of Object.entries(tracker)) {
    result[nominee] = { positive: positive.size, negative: negative.size };
  }
  return result;
}

export function buildNominationResult(nominations: Nomination[]): NominationResult {
  const result: NominationResult = {};
  for (const row of nominations) {
    result[row.nominee_name] ??= {};
    result[row.nominee_name][row.category] ??= { positive: 0, negative: 0 };
    result[row.nominee_name][row.category][row.valence]++;
  }
  return result;
}
