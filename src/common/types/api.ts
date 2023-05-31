export interface APIResponse<T> {
  code: number;
  codeMsg: string;
  data: T;
}
