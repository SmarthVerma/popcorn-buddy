type ApiErrorCodes = 400 | 401 | 404;

type ErrorMessage<T extends ApiErrorCodes> = T extends 400 ? string : string | undefined;

class ApiError<T extends ApiErrorCodes = 400 | 401 | 404> {
  statusCode: T;
  error?: ErrorMessage<T>;

  constructor(statusCode: T, error?: ErrorMessage<T>) {
    this.statusCode = statusCode;
    this.error = error;

    if (statusCode === 400 && !error) {
      throw new Error("Error message is required for status code 400");
    }
  }

  send(res: any) {
    const responsePayload: Record<string, any> = {};

    if (this.error) {
      responsePayload.error = this.error;
    }

    return res.status(this.statusCode).json(responsePayload);
  }
}

export default ApiError;
