<template>
  <div class="login">
    <div class="main">
      <div class="logoContainer">
        <div class="logo"><img src="@/assets/img/logo.png" alt=""/></div>
        <div class="name">线上校园</div>
        <div style="color: silver;font-size: 20px;margin: 0 5px">|</div>
        <div style="font-size: 20px">忘记密码</div>
      </div>
      <div
          class="mainBox"
      >
        <p>请输入您忘记密码的账号名：</p>
        <el-input placeholder="请输入账号名" style="height: 35px" v-model="account"/>
        <el-button style="display: block;margin-top: 20px" type="primary" @click="toForget">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import router from '@/routers';
// import forgetApi from '@/apis/user/forget.js';
import { ElMessage } from "element-plus";
import CryptoJS from 'crypto-js';

export default {

  setup() {

    const account = ref('')

//把手机号和邮箱加密后存入sessionStorage

    // 此处key为16进制
    let key = 'S0JsiZY2eHlgnRmv';// 密钥，用于对称加密


    // 偏移量长度为16位, 注：偏移量需要与后端定义好，保证一致
    let iv = "kezfopM2kJUn1VUN";

    // key格式化处理
    key = CryptoJS.enc.Utf8.parse(key)
    iv = CryptoJS.enc.Utf8.parse(iv);


    // 对称加密
    const myencrypt = (data) => {

      let srcData = CryptoJS.enc.Utf8.parse(data);

      return CryptoJS.AES.encrypt(srcData, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).ciphertext.toString();
    }


    const toForget = () => {
      //查找账号是否存在
      forgetApi.getUserInfoByAccount(account.value).then(res => {
        if (res.data.code == 0) {
          //存在则携带账号信息跳转到验证页面，否则提示账号不存在
          ElMessage({
            message: '查找成功，正在跳转到验证页面',
            type: 'success',
          })

          //将账号信息存入sessionStorage
          sessionStorage.setItem('campus_account', myencrypt(account.value));
          sessionStorage.setItem('campus_phone', myencrypt(res.data.data.telephone));
          sessionStorage.setItem('campus_email', myencrypt(res.data.data.email));


          router.push('/forget');
        } else {
          ElMessage({
            message: '账号不存在',
            type: 'error',
          })
        }
      }).catch(() => {
        ElMessage({
          message: '服务器网络出现问题，请稍后重试',
          type: 'error',
        })
      })
    }
    return {
      toForget,
      account,

    }
  }
}

</script>

<style scoped>


.login {
  background-color: #ecefff;
  height: 100vh;
}

.logoContainer {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: center;
}

.logo {
  width: 40px;
}

.logo img {
  width: 100%;
}

.name {
  color: #25262b;
  font-size: 20px;
  letter-spacing: 4px;
  font-weight: bold;
  margin-left: 7px;
}

.main {
  width: 50%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 15vh;
}

@media screen and (max-width: 768px) {
  .main {
    width: 350px;
    height: 400px;
  }
}

</style>
