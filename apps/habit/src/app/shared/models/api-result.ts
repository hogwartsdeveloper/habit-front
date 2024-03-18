export interface IApiResult<T> {
  errors: IError[];
  isSuccess: boolean;
  result?: T;
}

export interface IError {
  statusCode: number;
  message: string;
  tags: { [key: string]: string }
}
