import axios from "axios";
import { reqSuccessCallback, respSuccessCallback, errCallback } from '@/utils/interceptor';

const userRequest = axios.create({
  baseURL: '/user-api',
  timeout: 90000,
});

const messageRequest = axios.create({
  baseURL: '/message-api',
  timeout: 90000,
  headers: {
    uid: 't2',
    token: 't2'
  }
});

const contactRequest = axios.create({
  baseURL: '/contact-api',
  timeout: 90000,
  headers: {
    uid: 't2',
    token: 't2'
  }
});

const ossRequest = axios.create({
  baseURL: '/oss-api',
  timeout: 90000,
  headers: {
    uid: 't2',
    token: 't2',
    'Content-Type': 'multipart/form-data'
  }
});

userRequest.interceptors.request.use(reqSuccessCallback, errCallback);
userRequest.interceptors.response.use(respSuccessCallback, errCallback);

messageRequest.interceptors.request.use(reqSuccessCallback, errCallback);
messageRequest.interceptors.response.use(respSuccessCallback, errCallback);

contactRequest.interceptors.response.use(respSuccessCallback, errCallback);
contactRequest.interceptors.response.use(respSuccessCallback, errCallback);

ossRequest.interceptors.response.use(respSuccessCallback, errCallback);
ossRequest.interceptors.response.use(respSuccessCallback, errCallback);

export {
  userRequest,
  messageRequest,
  contactRequest,
  ossRequest
}