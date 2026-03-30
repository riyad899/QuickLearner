export interface IError {
   path: string;
   message: string;
}
export interface IErrorResponse {
    success: boolean;
    statusCode?: number;
    message: string;
    stack? : string | undefined;
    errorSource?: IError[];
    error?: any;
}