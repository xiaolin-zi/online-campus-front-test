import request from '@/utils/request'

export default {

    //根据账号获取用户信息
    getUserInfoByAccount(account) {
        return request({
            url: '/campusUser/user/getUserByAccount/'+account,
            method: 'get'
        })
    },

    //验证码是否正确
    checkPhoneCode(verifyPhone) {
        return request({
            url: '/campusUser/user/checkPhoneCode/',
            method: 'post',
            data: verifyPhone
        })
    },

    checkEmailCode(verifyEmail) {
        return request({
            url: '/campusUser/user/checkEmailCode/',
            method: 'post',
            data: verifyEmail
        })
    },

    //修改密码
    updatePassword(resetData) {
        return request({
            url: '/campusUser/user/updatePassword/',
            method: 'post',
            data: resetData
        })
    },

    //获取邮箱验证码
    getEmailCode(email) {
        return request({
            url: '/campusUser/sendEmail/'+email,
            method: 'get'
        })
    }

}
