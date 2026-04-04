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

export type SociomatrixDataByCategory = Record<string, ValenceCount>;

export type SociomatrixData = Record<string, SociomatrixDataByCategory>;

export type MemberSociomatrixData = Record<string, ValenceCount>;

export function calculateCohesion(result: NomineeRelationMap): number {
  const nominees = Object.keys(result);
  if (nominees.length < 2) return 0;

  let totalPositive = 0;
  let totalNegative = 0;
  for (const [nominee, submitters] of Object.entries(result)) {
    for (const [submitter, rel] of Object.entries(submitters)) {
      if (submitter === nominee) continue;
      if (rel.positive) totalPositive++;
      if (rel.negative) totalNegative++;
    }
  }

  const total = totalPositive + totalNegative;
  return total === 0 ? 0 : totalPositive / total;
}

export function buildSociomatrixDataByMember(nominations: Nomination[]): MemberSociomatrixData {
  const tracker: Record<string, { positive: Set<string>; negative: Set<string> }> = {};

  for (const row of nominations) {
    tracker[row.nominee_name] ??= { positive: new Set(), negative: new Set() };
    tracker[row.nominee_name][row.valence].add(row.submitter);
  }

  const result: MemberSociomatrixData = {};
  for (const [nominee, { positive, negative }] of Object.entries(tracker)) {
    result[nominee] = { positive: positive.size, negative: negative.size };
  }
  return result;
}

// nominee_name -> submitter -> { positive, negative } booleans | undefined (no relation)
export type NomineeRelationMap = Record<string, Record<string, { positive: boolean; negative: boolean }>>;

export function buildNomineeRelationMap(nominations: Nomination[]): NomineeRelationMap {
  const result: NomineeRelationMap = {};
  for (const row of nominations) {
    result[row.nominee_name] ??= {};
    result[row.nominee_name][row.submitter] ??= { positive: false, negative: false };
    result[row.nominee_name][row.submitter][row.valence] = true;
  }
  return result;
}

export function buildSociomatrixData(nominations: Nomination[]): SociomatrixData {
  const result: SociomatrixData = {};
  for (const row of nominations) {
    result[row.nominee_name] ??= {};
    result[row.nominee_name][row.category] ??= { positive: 0, negative: 0 };
    result[row.nominee_name][row.category][row.valence]++;
  }
  return result;
}
