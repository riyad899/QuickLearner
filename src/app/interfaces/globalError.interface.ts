import { status } from 'http-status';
export interface IError {
   path: string;
   message: string;
}
export interface IErrorResponse {
    success: boolean;
    statusCode?: number;
    message: string;
    errorSource?: IError[];
    error?: any;
}