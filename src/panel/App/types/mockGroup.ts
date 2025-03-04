export interface IMockGroup {
  id: string;
  name: string;
  description?: string;
  createdOn: number;
  mocksIds: string[];
}
