export interface ServerActionResponse<T = any> {
  success: boolean;
  data?: T;
  fieldError?: string;
  message?: string;
}
