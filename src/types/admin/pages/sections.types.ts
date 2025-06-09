export interface ISections {
  _id: string;
  name: string;
  currentCity: string;
  country: string;
  degree: string;
  dob: string;
  about: string;
}

export type SectionsRequest = Omit<ISections, "_id">;
export type SectionsResponse = ISections;
