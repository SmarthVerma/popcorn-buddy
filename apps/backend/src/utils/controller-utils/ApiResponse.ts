type ApiResponseCodes = 200 | 201;

type MessageAllowed<T extends ApiResponseCodes> = T extends 200 ? never : string;

class ApiResponse<T extends ApiResponseCodes = 200 | 201> {
  statusCode: T;
  data?: any;
  message?: MessageAllowed<T>;

  constructor(statusCode: T, data?: any, message?: MessageAllowed<T>) {
    if (statusCode === 200 && message) {
      throw new Error("Message is not allowed for status code 200");
    }
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }

  send(res: any) {
    const responsePayload: Record<string, any> = {};

    if (this.data) responsePayload.data = this.data;
    if (this.message) responsePayload.message = this.message;

    return res.status(this.statusCode).json(responsePayload);
  }
}

export default ApiResponse;
