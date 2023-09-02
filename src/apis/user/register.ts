import { gatewayRequest } from '@/utils/request';

//根据账号获取用户信息
export const registerApi = (userInfo: any) => {
  return gatewayRequest({
    url: '/campusUser/register',
    method: 'post',
    data: userInfo
  });
}