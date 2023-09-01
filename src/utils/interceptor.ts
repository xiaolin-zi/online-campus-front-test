import { storeToRefs } from 'pinia';
import { useGlobalStore } from '@/stores/useGlobalStore';

const globalStore = useGlobalStore();

export const reqSuccessCallback = (config: any) => {
  let token = globalStore.token, uid = globalStore.uid;
  console.log('request interceptor', uid, token);

  if (token != null || token !== undefined || token !== '') {
    config.headers['token'] = token;
  }
  return config;
}

export const respSuccessCallback = (response: any) => {
  console.log('response interceptor');
  return response;
}

export const errCallback = (err: any) => {
  console.log('error callback', err);
  return Promise.reject(err);
}