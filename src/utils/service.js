import axios from 'axios';
import { ElMessage } from 'element-plus';
import cookie from 'js-cookie';

// 创建axios实例
const service = axios.create({
    baseURL: 'http://localhost:9000/', // api的base_url
    timeout: 20000 // 请求超时时间
});

service.interceptors.request.use(
    config => {
        //debugger
        if (cookie.get('campus_token') && cookie.get('campus_uid')) {
            //第三步把获取的cookie值放到header
            config.headers['token'] = cookie.get('campus_token');
            config.headers['uid'] = cookie.get('campus_uid');
        }
        return config
    },
    err => {
        return Promise.reject(err);
    }
)

// http response 拦截器
service.interceptors.response.use(
    response => {
        return response;
        //debugger
        // if (response.data.code == 28004) {
        //     console.log("response.data.resultCode是28004")
        //     // 返回 错误代码-1 清除ticket信息并跳转到登录页面
        //     //debugger
        //     window.location.href = "/login"
        //     return
        // } else {
        //     if (response.data.code !== 20000) {
        //         // //25000：订单支付中，不做任何提示
        //         // if (response.data.code != 25000 && response.data.code != 20001) {
        //         //     Message({
        //         //         message: response.data.message || 'error',
        //         //         type: 'error',
        //         //         duration: 5 * 1000
        //         //     })
        //         // } else {
        //         //     return response;
        //         // }
        //     } else {
        //         return response;
        //     }
        // }
    },
    error => {
        //网络超时异常处理
        if(error.code === 'ECONNABORTED' || error.message === "Network Error" || error.message.includes("timeout")){
            ElMessage({
                message: '请求超时，请稍后重试',
                type: "error",
                duration: 3 * 1000,
            })
        }else {
            return Promise.reject(error.response) // 返回接口返回的错误信息
        }
    });
export default service;
