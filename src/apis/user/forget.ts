import { userRequest } from '@/utils/request';

//根据账号获取用户信息
export const getUserInfoByAccountApi = (account: string) => {
  return userRequest({
    url: `/campusUser/user/getUserByAccount/${account}`,
    method: 'get'
  });
}

//验证码是否正确
export const checkPhoneCodeApi = (verifyPhone: any) => {
  return userRequest({
    url: '/campusUser/user/checkPhoneCode/',
    method: 'post',
    data: verifyPhone
  });
}

export const checkEmailCodeApi = (verifyEmail: any) => {
  return userRequest({
    url: '/campusUser/user/checkEmailCode/',
    method: 'post',
    data: verifyEmail
  })
}

//修改密码
export const updatePasswordApi = (resetData: any) => {
  return userRequest({
    url: '/campusUser/user/updatePassword/',
    method: 'post',
    data: resetData
  });
}

//获取邮箱验证码
export const getEmailCodeApi = (email: string) => {
  return userRequest({
    url: `/campusUser/sendEmail/${email}`,
    method: 'get'
  });
}
