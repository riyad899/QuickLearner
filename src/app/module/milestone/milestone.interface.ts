export interface ICreateMilestonePayload {
  title: string;
  description: string;
  courseID: number;
}

export interface IUpdateMilestonePayload {
  title?: string;
  description?: string;
  courseID?: number;
}
