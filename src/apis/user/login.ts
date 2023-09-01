import { gatewayRequest } from '@/utils/gateway';

//密码登录
export const loginApi = (userInfo: any) => {
  return gatewayRequest({
    url: '/campusUser/login',
    method: 'post',
    data: userInfo
  })
}

//手机号登录
export const loginByPhoneApi = (loginInfo: any) => {
  return gatewayRequest({
    url: '/campusUser/loginByCode',
    method: 'post',
    data: loginInfo
  })
}

//发送短信验证码
export const sendPhoneCodeApi = (phone: any) => {
  return gatewayRequest({
    url: `/campusUser/send/${phone}`,
    method: 'get',
  });
}
