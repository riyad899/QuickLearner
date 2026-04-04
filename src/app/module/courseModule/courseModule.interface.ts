export interface ICreateCourseModulePayload {
  title: string;
  description: string;
  milestoneID: number;
}

export interface IUpdateCourseModulePayload {
  title?: string;
  description?: string;
  milestoneID?: number;
}
