export type Member = {
  id: number;
  name: string;
  submitted: boolean;
};

export type Team = {
  id: string;
  name: string;
  pin: string;
  members: Member[];
};

export type CreateTeamPayload = Omit<Team, "id"> & {
  facilitator_id: number;
};

