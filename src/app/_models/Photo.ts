export interface Photo {
  // we use interfaces for type safety
  id: number;
  url: string;
  dateadded: Date;
  isMain: boolean;
  description: string;
  isApproved: boolean;
}
