<template>
  <div class="layout-box">
    <!-- 子路由出口 -->
    <div class="layout-main">
      <router-view/>
    </div>
    <van-tabbar v-model="active" class="tabber" active-color="#73c975" route>
      <van-tabbar-item class="tab" to="/campus/dashboard">
        <template #icon>
          <van-icon name="home-o" size="30"/>
        </template>
        <span>首页</span>
      </van-tabbar-item>
      <van-tabbar-item class="tab" to="/campus/contact">
        <template #icon>
          <van-icon name="eye-o" size="30" dot/>
        </template>
        <span>发现</span>
      </van-tabbar-item>
      <van-tabbar-item class="tab" to="/campus/message">
        <template #icon>
          <van-icon name="chat-o" size="30" dot/>
        </template>
        <span>消息</span>
      </van-tabbar-item>
      <van-tabbar-item class="tab" to="/campus/user">
        <template #icon>
          <van-icon name="smile-o" size="30" dot/>
        </template>
        <span>我的</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const active = ref(0);

onMounted(() => { active.value = 0; });

</script>

<style lang="less" scoped>
.layout-box {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .tabber {
    background: #f6f6f6;
    height: 55px;
    .tab {
      background: #f6f6f6;
      color: #0a1629;
    }
  }
}
</style>