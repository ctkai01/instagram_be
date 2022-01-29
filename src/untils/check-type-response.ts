import { ResponseData } from 'src/interface/response.interface';

export const instanceOfResponseData = (p: any): p is ResponseData => {
  return 'statusCode' in p || 'message' in p || 'data' in p;
};
