export interface IExperience {
  _id: string;
  jobTitle: string;
  companyName: string;
  fromDate: string;
  toDate?: string;
  currentlyWorking: boolean;
  tags: string[];
  aboutCompany?: string;
  responsibilities?: string;
}
