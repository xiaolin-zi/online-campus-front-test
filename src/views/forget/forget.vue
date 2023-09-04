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
        <el-steps :active="0" finish-status="success" style="margin-top: 20px">
          <el-step title="Step 1" description="验证身份"/>
          <el-step title="Step 2" description="修改密码"/>
          <el-step title="Step 3" description="完成"/>
        </el-steps>
        <div v-if="active==0">
          <p style="margin-top: 30px;color: #79797c">为确认是你本人操作，请选择验证方式完成身份验证：</p>
          <div>
            <el-radio-group v-model="radio">
              <el-radio :label="1">手机验证</el-radio>
              <el-radio :label="2">邮箱验证</el-radio>
            </el-radio-group>
            <el-button style="display: block;margin-top: 20px" type="primary" @click="toverify">开始验证</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive, ref} from 'vue';
import router from '@/routers';
import CryptoJS from 'crypto-js';
import { useRoute } from 'vue-router'
import { ElMessage } from "element-plus";

export default {

  setup() {

    const route = useRoute();

    const active = ref(0);

    const radio = ref(1);

    const next = () => {
      if (active.value++ > 2) active.value = 0;
    }

    const toverify = () => {
      if (radio.value == 1) {
        //判断手机号是否存在
        const phone = mydecrypt(sessionStorage.getItem('campus_phone'));
        if(phone==null){
          ElMessage.error('当前账号未绑定手机号，请选择其他方式验证');
          return;
        }
        router.push({
          name: 'verifyPhone',
          params: {
            phone: route.params.phone
          }
        })
      } else {
        //判断邮箱是否存在
        const email = mydecrypt(sessionStorage.getItem('campus_email'));

        console.log(email);
        if(email=="null"){
          ElMessage.error('当前账号未绑定邮箱，请选择其他方式验证');
          return;
        }
        router.push({
          name: 'verifyEmail',
          params: {
            email: route.params.email
          }
        })
      }
    }

    // 此处key为16进制
    let key = 'S0JsiZY2eHlgnRmv';// 密钥，用于对称加密


    // 偏移量长度为16位, 注：偏移量需要与后端定义好，保证一致
    let iv = "kezfopM2kJUn1VUN";

    // key格式化处理
    key = CryptoJS.enc.Utf8.parse(key)
    iv = CryptoJS.enc.Utf8.parse(iv);

    // 对称解密
    const mydecrypt = (encryptedData) => {
      encryptedData = CryptoJS.format.Hex.parse(encryptedData)
      const decryptedContent = CryptoJS.AES.decrypt(encryptedData, key,
          {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          }
      );
      return CryptoJS.enc.Utf8.stringify(decryptedContent);
    }


    return {
      active,
      next,
      radio,
      toverify
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
