export interface ICreateAssigmentPayload {
  title: string;
  description?: string;
  dueDate?: Date;
  moduleID: number;
}

export interface IUpdateAssigmentPayload {
  title?: string;
  description?: string;
  dueDate?: Date;
  moduleID?: number;
}
