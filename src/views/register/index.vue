<template>
  <div class="login">
    <div class="main">
      <div class="logoContainer">
        <div class="logo"><img src="@/assets/img/logo.png" alt=""/></div>
        <div class="name">线上校园</div>
        <div style="color: silver;font-size: 20px;margin: 0 5px">|</div>
        <div style="font-size: 20px">注册</div>
      </div>
      <div
          class="mainBox"
      >

        <div class="loginInput">
          <el-form ref="registForm" :model="regist" label-width="80px">
            <el-form-item
                prop="account"
                :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]"
            >
              <el-input
                  v-model="regist.account"
                  placeholder="请输入账号"
              ></el-input>
            </el-form-item>
            <el-form-item
                prop="username"
                :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]"
            >
              <el-input
                  v-model="regist.username"
                  placeholder="请输入用户名"
              ></el-input>
            </el-form-item>
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
                  v-model="regist.telephone"
                  placeholder="请输入手机号"
              ></el-input>
            </el-form-item>
            <el-form-item class="codeContainer"
                          prop="code"
                          :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]"
            >
              <el-input
                  v-model="regist.code"
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
            <el-form-item
                prop="password"
                :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
            >
              <el-input
                  v-model="regist.password"
                  type="password"
                  placeholder="请输入密码"
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
                  v-model="regist.confirmPassword"
                  type="password"
                  placeholder="请输入确认密码"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="toRegist">注册</el-button>
            </el-form-item>

          </el-form>

          <!--忘记密码，注册-->
          <div class="forget" style="width: 310px;margin:0 auto;text-align: right">
            <router-link to="/login" style="text-decoration: none;font-size:14px;color: rgb(127, 108, 108)">
              已有账号？前往登录
            </router-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive, ref} from 'vue';
import loginApi from "@/api/user/login";
import {ElMessage} from "element-plus";
import RegistApi from "@/api/user/regist";
import router from "@/router";

export default {

  setup() {

    const registForm = ref(null);

    const regist = reactive({
      account: "",
      code: "",
      username: "",
      telephone: "",
      password: "",
      confirmPassword: "",
    });

    const checkPhone = (rule, value, callback) => {
      //debugger
      if (!/^1[34578]\d{9}$/.test(value)) {
        return callback(new Error("手机号码格式不正确"));
      }
      return callback();
    };

    const countDownSecond = ref(60);

    const isCountDownShow = ref(false);

    // 倒计时名称
    let timer;

    const toRegist = async () => {
      registForm.value.validate(
          (valid) => {
            if (valid) {
              RegistApi.submitRegist(regist).then((res) => {
                if (res.data.code == 0) {
                  ElMessage({
                    message: '注册成功，请登录',
                    type: 'success',
                  })
                  setTimeout(() => {
                    router.push("/login")
                  }, 1000)
                } else {
                  ElMessage({
                    message: res.data.msg,
                    type: 'error',
                  })
                }
              }).catch((error) => {
                //处理请求失败逻辑
                console.log(error)
                if (error) {
                  // 网络请求已发送，后端返回错误响应
                  if (error.data.code == 400) {
                    const firstPropertyName = Object.keys(error.data.errors)[0];
                    const firstPropertyValue = error.data.errors[firstPropertyName];

                    ElMessage({
                      message: firstPropertyValue,
                      type: 'error',
                    })
                  } else {
                    ElMessage({
                      message: '服务器网络出现问题，请稍后重试',
                      type: 'error',
                    })
                  }
                }
              })
            }
          }
      )
    };


    const checkPassword = (rule, value, callback) => {
      //debugger
      if (value !== regist.password) {
        return callback(new Error("确认密码和密码不一致"));
      }
      return callback();
    };

    const getCode = async () => {
      //先判断手机号是否正确
      //先判断手机号是否正确
      registForm.value.validateField("telephone", (valid) => {
        console.log(valid);
        if (!valid) {
          return;
        } else {
          isCountDownShow.value = true;
          loginApi.sendPhoneCode(regist.telephone).then((res) => {
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


    return {
      registForm,
      checkPhone,
      checkPassword,
      regist,
      isCountDownShow,
      countDownSecond,
      toRegist,
      getCode,
    };
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
  width: 350px;
  height: 400px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 15vh;
}

.mainBox {
  width: 350px;
  background-color: #fff;
  height: 550px;
  border-radius: 10px;
  overflow: hidden;
}


.el-form /deep/ .el-form-item__content {
  margin: 0 !important;
  padding: 0 20px;
}

.el-form /deep/ .el-form-item__content .el-form-item__error {
  margin-left: 20px !important;
}

.el-input /deep/ input {
  border-radius: 10px;
}

.loginInput {
  margin-top: 20px;
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
