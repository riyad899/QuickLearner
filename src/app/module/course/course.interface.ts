export interface ICreateCoursePayload {
  title: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  slug: string;
  fee?: number;
  status?: string;
  instructorID: number;
}

export interface IUpdateCoursePayload {
  title?: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  slug?: string;
  fee?: number;
  status?: string;
  instructorID?: number;
}
