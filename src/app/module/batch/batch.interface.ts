export interface ICreateBatchPayload {
	name: string;
	courseID: number;
	startDate: Date;
	endDate: Date;
}

export interface IUpdateBatchPayload {
	name?: string;
	courseID?: number;
	startDate?: Date;
	endDate?: Date;
}
