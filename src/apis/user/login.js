import request from '@/utils/service'

export default {

    //密码登录
    submitLogin(userInfo) {
        return request({
            url: '/campusUser/login',
            method: 'post',
            data: userInfo
        })
    },

    //手机号登录
    loginByPhone(loginInfo){
        return request({
            url: '/campusUser/loginByCode',
            method: 'post',
            data: loginInfo
        })
    },

    //发送短信验证码
    sendPhoneCode(phone){
        return request({
            url: `/campusUser/send/${phone}`,
            method: 'get',
        })
    }

}
