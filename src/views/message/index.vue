<template>
  <div class="message-dashboard-box">
    <van-nav-bar class="header-box">
      <template #left>
        <van-button size="mini" color="#73c975" @click="clearUnRead"><p style="color: #0a1629;">清除未读</p></van-button>
      </template>
      <template #title>
        <p class="title">消息</p>
      </template>
      <template #right>
        <van-icon name="plus" size="18" color="#0a1629" @click="toAddFriend"/>
      </template>
    </van-nav-bar>

    <div class="message-dashboard-main">
      <van-collapse v-model="activeName">
        <van-collapse-item title="系统消息" name="system">
          <div class="sys-box" @click="toSys">
            <div class="icon-box">
              <van-icon name="volume" size="28" color="#f6f6f6" style="margin: 10px auto;"/>
            </div>
            <div class="right-title">
              <p>系统通知</p>
            </div>
          </div>
        </van-collapse-item>
        <van-collapse-item title="好友消息" name="friend">
          <friendItem 
            v-for="(item, index) in userList" 
            :item="item" 
            :key="index" 
            @on-to-page="toPage"/>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { List } from '@/interfaces/message';
import { showConfirmDialog, showToast } from 'vant';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { clickMyMessageApi, clearUnReadApi } from '@/apis/message/index';
import friendItem from '@/components/friend-item/index.vue';

const router = useRouter();
const keywords = ref<string>("");
const friendsShow = ref<Boolean>(false);
const userList = ref<List[]>([]);
const activeName = ref(['system', 'friend']);

onMounted(() => {
  clickMyMessage();
});

const clickMyMessage = async () => {
  const { data: res } = await clickMyMessageApi();
  console.log('clickMyMessage', res);
  userList.value = res.data;
}

// 清除未读
const clearUnRead = () => {
  showConfirmDialog({
    title: '提示',
    message: '确认清除所有未读的消息?',
  }).then(async () => {
    const { data: res } = await clearUnReadApi();
    // console.log(res);
    if (res.code === 0) {
      showToast('清除成功!');
    } else {
      showToast('OOPS! 内部小错误,请稍后重试!');
    }
  }).catch(() => {
      showToast('已取消操作');
  });


  // console.log('清除未读');
};

const toSys = () => {
  router.push('/campus/message/sys');
}

const toPage = (id: string) => {
  router.push('/campus/message/' + id);
};

const toAddFriend = () => {
    router.push('/campus/message/add-friend');
  };
</script>


<style lang="less" scoped>
/* 样式重置 */
.message-dashboard-box {
  width: 100%;
  font-family: '黑体';
  background: #fff;
  overflow-y: auto;

  .header-box {
    width: 100%;
    color: #0a1629;
    z-index: 100;
    overflow: hidden;
    top: 0;
    position: fixed;
    height: 50px;
    background: #f6f6f6;
    .title {
      line-height: 50px;
      text-align: center;
      font-size: 22px;
    }
  }

  .message-dashboard-main {
    background: #fff;
    box-sizing: border-box;
    overflow: auto;
    width: 100%;
    height: 100%;
    margin-top: 50px;

    .sys-box {
      width: 100%;
      display: flex;
      // border: 1px solid #f00;
      overflow: hidden;
      .icon-box {
        width: 48px;
        height: 48px;
        text-align: center;
        border-radius: 50%;
        background: #1989FA;
      }
      .right-title {
        color: #0a1629;
        margin-left: 10px;
        height: 48px;
        font-size: 22px;
        line-height: 48px;
      }
    }

  }



/* 响应式布局 */
@media (max-width: 768px) {
  .head {
    padding: 10px;

    .title {
      font-size: 16px;
    }
  }
}
}
</style>
