import { storeToRefs } from 'pinia';
import { useGlobalStore } from '@/stores/useGlobalStore';
import { AxiosError, AxiosResponse } from 'axios';
import router from '@/routers';
import { showToast } from 'vant';

export const reqSuccessCallback = (config: any) => {
  const globalStore = useGlobalStore();
  let token = globalStore.token, uid = globalStore.uid;
  // console.log('request interceptor', uid, token);

  if (token != null || token !== undefined || token !== '') {
    config.headers.token = token;
  } else {
    showToast('token无效或已过期, 请重新登录!');
    globalStore.$reset();
    router.push('/login');
  }
  
  return config;
}

export const respSuccessCallback = (response: AxiosResponse) => {
  // console.log('response interceptor', response);
  return response;
}

export const errCallback = (err: AxiosError) => {
  // console.log('request/response error callback', err);

  if (err.response?.statusText === 'Unauthorized') {
    showToast('token无效或已过期, 请重新登录!');
    const globalStore = useGlobalStore();
    globalStore.$reset();
    router.push('/login');
  }

  return Promise.reject(err);
}