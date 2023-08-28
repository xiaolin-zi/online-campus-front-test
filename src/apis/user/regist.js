import request from '@/utils/service';

export default {

    //根据账号获取用户信息
    submitRegist(userInfo) {
        return request({
            url: '/campusUser/register',
            method: 'post',
            data:userInfo
        })
    }


}
