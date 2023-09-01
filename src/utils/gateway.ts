import axios from 'axios';
import { reqSuccessCallback, respSuccessCallback, errCallback } from '@/utils/interceptor';

const gatewayRequest = axios.create({
  baseURL: '/gateway-api',
  timeout: 90000,
});

gatewayRequest.interceptors.request.use(reqSuccessCallback, errCallback);
gatewayRequest.interceptors.response.use(respSuccessCallback, errCallback);

export {
  gatewayRequest
}