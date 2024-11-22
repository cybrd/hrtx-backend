export type Member = {
  id: string;
  discord_name: string;
  ingame_name: string;
  weapon: string;
  team: string;
};

export type MemberWithPoints = Member & {
  total_points: number;
};
