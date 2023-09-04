import axios from "axios";
import { reqSuccessCallback, respSuccessCallback, errCallback } from '@/utils/interceptor';

// const gatewayRequest = axios.create({
//   baseURL: '/gateway-api',
//   timeout: 90000,
// });
//
// const userRequest = axios.create({
//   baseURL: '/user-api',
//   timeout: 90000,
// });
//
// const messageRequest = axios.create({
//   baseURL: '/message-api',
//   timeout: 90000,
// });
//
// const contactRequest = axios.create({
//   baseURL: '/contact-api',
//   timeout: 90000,
// });
//
// const ossRequest = axios.create({
//   baseURL: '/oss-api',
//   timeout: 90000,
//   headers: {
//     'Content-Type': 'multipart/form-data'
//   }
// });
const gatewayRequest = axios.create({
  baseURL: '/gateway-api',
  timeout: 90000,
});

const userRequest = axios.create({
  baseURL: '/user-api',
  timeout: 90000,
});

const messageRequest = axios.create({
  baseURL: '/message-api',
  timeout: 90000,
});

const contactRequest = axios.create({
  baseURL: '/contact-api',
  timeout: 90000,
});

const ossRequest = axios.create({
  baseURL: '/oss-api',
  timeout: 90000,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
gatewayRequest.interceptors.request.use(reqSuccessCallback, errCallback);
gatewayRequest.interceptors.response.use(respSuccessCallback, errCallback);

userRequest.interceptors.request.use(reqSuccessCallback, errCallback);
userRequest.interceptors.response.use(respSuccessCallback, errCallback);

messageRequest.interceptors.request.use(reqSuccessCallback, errCallback);
messageRequest.interceptors.response.use(respSuccessCallback, errCallback);

contactRequest.interceptors.request.use(reqSuccessCallback, errCallback);
contactRequest.interceptors.response.use(respSuccessCallback, errCallback);

ossRequest.interceptors.request.use(reqSuccessCallback, errCallback);
ossRequest.interceptors.response.use(respSuccessCallback, errCallback);

export {
  gatewayRequest,
  userRequest,
  messageRequest,
  contactRequest,
  ossRequest
}
