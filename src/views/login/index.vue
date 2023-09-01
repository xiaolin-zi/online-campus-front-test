<template>
  <div class="login">
    <div class="main">
      <div class="logoContainer">
        <div class="logo"><img src="@/assets/img/logo.png" alt=""/></div>
        <div class="name">线上校园</div>
        <div style="color: silver;font-size: 20px;margin: 0 5px">|</div>
        <div style="font-size: 20px">登录</div>
      </div>
      <div class="mainBox">
        <el-tabs
            v-model="activeName"
            type="card"
            @tab-click="handleClick"
            stretch>
          <el-tab-pane label="密码登录" name="first">
            <div class="loginInput">
              <el-form ref="loginForm" :model="login" label-width="80px">
                <el-form-item
                  prop="loginName"
                  :rules="[{ required: true, message: '请输入手机号/邮箱/账号', trigger: 'blur' }]">
                <el-input
                  v-model="login.loginName"
                  placeholder="请输入手机号/邮箱/账号"></el-input>
                </el-form-item>
                <el-form-item
                    prop="password"
                    :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
                >
                  <el-input
                      v-model="login.password"
                      type="password"
                      placeholder="请输入密码"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="tologin">登录</el-button>
                </el-form-item>

              </el-form>
              <!--第三方登录-->
              <!--QQ登录-->
              <div style="width: 310px;margin: 0 auto">
                <el-link class="iconfont icon-QQ">QQ登录</el-link>
              </div>

              <!--忘记密码，注册-->
              <div class="forget" style="width: 310px;margin:0 auto;text-align: right">
                <router-link to="/getAccount" style="margin-right: 10px;font-size:14px;text-decoration: none;color: rgb(127, 108, 108)">
                  忘记密码
                </router-link>
                <router-link to="/register" style="text-decoration: none;font-size:14px;color: rgb(127, 108, 108)">
                  注册账号
                </router-link>
              </div>

            </div>
          </el-tab-pane>
          <el-tab-pane label="手机登录" name="second">
            <div class="loginInput">
              <el-form ref="loginByPhoneForm" :model="loginByPhone" label-width="80px">
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
                      v-model="loginByPhone.telephone"
                      placeholder="请输入手机号"
                  ></el-input>
                </el-form-item>
                <el-form-item class="codeContainer"
                  prop="code"
                  :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]">
                  <el-input
                    v-model="loginByPhone.code"
                    placeholder="请输入验证码"></el-input>
                  <div class="codeButtonContainer">
                    <el-button
                      size="mini"
                      class="getcode"
                      v-if="!isCountDownShow"
                      @click="getCode">获取验证码</el-button>
                    <div class="countDown" v-else>{{ countDownSecond }} s</div>
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="tologinByPhone">登录</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import cookie from "js-cookie";
import { loginApi, loginByPhoneApi, sendPhoneCodeApi } from "@/apis/user/login";
import { ElMessage } from 'element-plus'
import router from "@/routers";

export default {

  setup() {
    const loginForm = ref(null);
    const loginByPhoneForm = ref(null);


    const login = reactive(
        {
          loginName: "",
          password: "",
        });

    const loginByPhone = reactive({telephone: "", code: ""});

    const activeName = ref("first");

    const countDownSecond = ref(60);

    const isCountDownShow = ref(false);

    const checkPhone = (rule, value, callback) => {
      //debugger
      if (!/^1[34578]\d{9}$/.test(value)) {
        return callback(new Error("手机号码格式不正确"));
      }
      return callback();
    };


    // 倒计时名称
    let timer;

    //登录
    const tologin = async () => {
      loginForm.value.validate(
          (valid) => {
            if (valid) {
              loginApi(login).then((res) => {
                if (res.data.code == 0) {
                  console.log("登录成功");
                  console.log(res.data.data);
                  cookie.set("campus_token", res.data.data.token);
                  cookie.set("campus_uid", JSON.stringify(res.data.data.uid));
                  ElMessage({
                    message: '登录成功',
                    type: 'success',
                  })
                  router.push({path: "/home"});
                } else {
                  console.log("登录失败");
                  console.log(res.data.msg);
                  ElMessage({
                    message: '手机号或验证码错误',
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
          }
      )
    };

    const handleClick = (e) => {
      console.log(e.name);
    };

    const getCode = async () => {
      //先判断手机号是否正确
      loginByPhoneForm.value.validateField("telephone", (valid) => {
        if (!valid) {
          return;
        } else {
          isCountDownShow.value = true;
          sendPhoneCodeApi(loginByPhone.telephone).then((res) => {
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

    const tologinByPhone = async () => {
      loginByPhoneForm.value.validate(
          (valid) => {
            if (valid) {
              loginByPhoneApi(loginByPhone).then((res) => {
                console.log(res)
                if (res.data.code == 0) {
                  //登录成功
                  console.log("登录成功");
                  console.log(res.data.data);
                  cookie.set("campus_token", res.data.data.token);
                  cookie.set("campus_uid", JSON.stringify(res.data.data.uid));
                  ElMessage({
                    message: '登录成功',
                    type: 'success',
                  })
                  router.push({path: "/home"});
                } else {
                  ElMessage({
                    message: '手机号或验证码错误',
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
          }
      )
    }

    return {
      loginForm,
      loginByPhoneForm,
      login,
      loginByPhone,
      isCountDownShow,
      countDownSecond,
      activeName,
      checkPhone,
      tologin,
      handleClick,
      getCode,
      tologinByPhone
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
  height: 350px;
  border-radius: 10px;
  overflow: hidden;
}


.el-form :deep(.el-form-item__content) {
  margin: 0 !important;
  padding: 0 20px;
}

.el-form :deep(.el-form-item__content .el-form-item__error) {
  margin-left: 20px !important;
}

.el-input :deep(input) {
  border-radius: 10px;
}


.loginInput {
  margin-top: 20px;
}

.el-tabs :deep(.is-active),
.el-tabs :deep(div:hover) {
  color: #595bb3;
}

.el-tabs :deep(.is-active) {
  background-color: #fff;
}

.el-tabs :deep(.el-tabs__item) {
  border: none !important;
  font-size: 18px;
  height: 50px;
  line-height: 50px;
}

.el-tabs :deep(.el-tabs__nav) {
  border: none;
}

.el-tabs :deep(.el-tabs__nav-scroll) {
  background-color: #f5f5f6;
}

.el-input :deep(.el-input__inner) {
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
