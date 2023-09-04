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
        <el-steps :active="active" finish-status="success" style="margin-top: 20px">
          <el-step title="Step 1" description="验证身份"/>
          <el-step title="Step 2" description="修改密码"/>
          <el-step title="Step 3" description="完成"/>
        </el-steps>
        <div v-if="active==0">
          <p style="margin-top: 30px;color: #79797c">手机号<span
              style="color: rgb(255, 68, 0)">{{ decryptPhone() }}</span>为确认是你本人操作，请完成以下验证:</p>
          <div style="margin-top: 30px">
            <el-form ref="verifyPhoneForm" :model="verifyPhone" label-width="80px">
              <el-form-item
                  prop="telephone"
                  :rules="[
                      {
                        required: true,
                        message: '请输入手机号码',
                        trigger: 'blur',
                      },
                      { validator: checkPhone, trigger: 'blur' },
                    ]"
              >
                <el-input
                    v-model="verifyPhone.telephone"
                    placeholder="请输入手机号"
                ></el-input>
              </el-form-item>
              <el-form-item class="codeContainer"
                            prop="code"
                            :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]"
              >
                <el-input
                    v-model="verifyPhone.code"
                    placeholder="请输入验证码"
                ></el-input>
                <div class="codeButtonContainer">
                  <el-button
                      size="mini"
                      class="getcode"
                      v-if="!isCountDownShow"
                      @click="getCode"
                  >获取验证码
                  </el-button
                  >
                  <div class="countDown" v-else>{{ countDownSecond }} s</div>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="verify"
                >下一步
                </el-button
                >
              </el-form-item>
            </el-form>

          </div>
        </div>
        <div v-if="active==1">
          <p style="margin-top: 30px;color: #79797c">请修改您的密码，建议加大密码强度：</p>
          <div style="margin-top: 30px">
            <el-form ref="form" :model="resetData" label-width="80px">
              <el-form-item
                  prop="password"
                  :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
              >
                <el-input
                    type="password"
                    v-model="resetData.password"
                    placeholder="请输入新密码"
                ></el-input>
              </el-form-item>
              <el-form-item
                  prop="confirmPassword"
                  :rules="[
                      {
                        required: true,
                        message: '请输入确认密码',
                        trigger: 'blur',
                      },
                      { validator: checkPassword, trigger: 'blur' },
                    ]"
              >
                <el-input
                    type="password"
                    v-model="resetData.confirmPassword"
                    placeholder="请再次输入新密码"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="resetPassword"
                >下一步
                </el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div v-if="active==2">
          <p style="margin-top: 30px;color: #79797c">您已成功修改密码，是否前往登录？</p>
          <div style="margin-top: 30px">
            <el-button type="primary" @click="tologin"
            >前往登录
            </el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive, ref} from 'vue';
import router from '@/routers';
import CryptoJS from "crypto-js";
// import loginApi from "@/apis/user/login";
// import forgetApi from "@/apis/user/forget";
import { ElMessage } from "element-plus";

export default {

  setup() {


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


    const phone = mydecrypt(sessionStorage.getItem('campus_phone'));

    //将手机号中间四位隐藏
    const decryptPhone = () => {
      return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    }


    const active = ref(0)

    const radio = ref(1)

    const countDownSecond = ref(60);

    const isCountDownShow = ref(false);

    const verifyPhone = reactive({
      telephone: '',
      code: ''
    })


    const checkPhone = (rule, value, callback) => {
      //debugger
      if (!/^1[34578]\d{9}$/.test(value)) {
        return callback(new Error("手机号码格式不正确"));
      }
      return callback();
    };


    const resetData = reactive({
      account: sessionStorage.getItem('campus_account'),
      password: '',
      confirmPassword: ''
    })

    const checkPassword = (rule, value, callback) => {
      //debugger
      if (value !== resetData.password) {
        return callback(new Error("确认密码和密码不一致"));
      }
      return callback();
    };

    // 倒计时名称
    let timer;
    const verifyPhoneForm = ref(null);

    const getCode = async () => {
      //先判断手机号是否正确,再判断手机号格式

      verifyPhoneForm.value.validateField("telephone", (valid) => {
        if (!valid) {
          return;
        } else {
          isCountDownShow.value = true;
          loginApi.sendPhoneCode(verifyPhone.telephone).then((res) => {
            startCountDown();
            if (res.data.code == 0) {
              ElMessage({
                message: '验证码已发送',
                type: 'success',
              })
            } else {
              ElMessage({
                message: '验证码发送失败',
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
      });

    };

    const startCountDown = () => {
      countDownSecond.value = 60;
      timer = setInterval(() => {
        countDownSecond.value--;
        if (countDownSecond.value == 0) {
          clearInterval(timer);
          isCountDownShow.value = false;
        }
      }, 1000);
    };


    const verify = () => {
      verifyPhoneForm.value.validate((valid) => {
        if (valid) {
          //验证手机号验证码是否正确
          forgetApi.checkPhoneCode(verifyPhone).then((res) => {
            if (res.data.code == 0) {
              ElMessage({
                message: '验证成功',
                type: 'success',
              })
              active.value++
              if (active.value > 2) active.value = 0
            } else {
              ElMessage({
                message: '验证码错误',
                type: 'error',
              })
            }
          }).catch(() => {
            ElMessage({
              message: '服务器网络出现问题，请稍后重试',
              type: 'error',
            })
          })
        } else {
          return false;
        }
      });


    }

    // 对称加密
    const myencrypt = (data) => {

      let srcData = CryptoJS.enc.Utf8.parse(data);

      return CryptoJS.AES.encrypt(srcData, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).ciphertext.toString();
    }

    const resetPassword = () => {

      //对密码进行加密
      resetData.password =  myencrypt(resetData.password)
      resetData.confirmPassword = myencrypt(resetData.confirmPassword)
      //修改密码
      forgetApi.updatePassword(resetData).then((res) => {
        if (res.data.code == 0) {
          ElMessage({
            message: '修改成功',
            type: 'success',
          })
          active.value++
          if (active.value > 2) active.value = 0
        } else {
          ElMessage({
            message: '修改失败',
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

    const tologin = () => {
      router.push('/login')
    }

    return {
      active,
      verify,
      phone,
      decryptPhone,
      verifyPhoneForm,
      radio,
      verifyPhone,
      countDownSecond,
      isCountDownShow,
      getCode,
      resetData,
      resetPassword,
      tologin,
      checkPhone,
      checkPassword
    }
  }
}

</script>

<style scoped>
.el-form /deep/ .el-form-item__content .el-form-item__error {
  margin-left: 20px !important;
}

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

.el-form /deep/ .el-form-item__content {
  margin: 0 !important;
  padding: 0 20px;
}

.el-input /deep/ input {
  border-radius: 10px;
}


.el-input /deep/ .el-input__inner {
  height: 48px;
  font-size: 15px;
}

.el-button {
  width: 100%;
  background-color: #6c6dbb;
  border: none;
  border-radius: 10px;
  margin-top: 10px;
  height: 45px;
  font-size: 15px;
}

.el-button:hover {
  background-color: #595bb3;
}

.codeContainer {
  position: relative;
}

.codeButtonContainer {
  position: absolute;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
}

.getcode {
  background-color: #6c6dbb;
  color: white;
  height: 35px;
  margin: 0;
}

.countDown {
  color: rgb(141, 141, 141);
}
</style>
