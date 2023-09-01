<template>
  <div class="aside">
    <div class="head">
      <div class="head-wrap">
        <div class="head-left">
          <p class="title">消息</p>
          <el-button size="small" round @click="clear">
            <i class="iconfont icon-clear"></i>
            清除未读</el-button>
        </div>
        <div class="head-right">
          <i class="iconfont icon-v-add" @click="goToAddFriend"></i>
        </div>
      </div>
    </div>
    <div class="search">
      <el-input v-model="keywords" :prefix-icon="Search" placeholder="搜索聊天记录"></el-input>
    </div>

    <ul class="chat-list-group">
      <li class="chat-list-group-item">
        <div class="chat-list-group-item-title" @click="() => {
          friendsShow = !friendsShow;
        }
          ">
          <span>好友消息</span>
          <el-icon size="12" color="#d3d3d3" v-if="!friendsShow">
            <ArrowRight />
          </el-icon>
          <el-icon size="12" color="#d3d3d3" v-else>
            <ArrowDown />
          </el-icon>
        </div>

        <ul class="chat-user-list-group" v-if="friendsShow">
          <li class="chat-user-list-group-item" v-for="(item, index) in userList" :key="index" :class="route.params.id === item.userId
            ? 'chat-user-list-group-item--active'
            : ''
            " @click="toPage(item.userId)">
            <el-image :src="item.userImage" style="width: 40px; height: 40px; border-radius: 5px" />
            <div class="chat-user-list-group-item-content">
              <div class="content-name">
                <p>{{ item.username }}</p>
                <p class="time">{{ item.recentTime }}</p>
              </div>
              <p class="content">{{ item.recentContent }}</p>
            </div>
          </li>
        </ul>
      </li>
      <li class="chat-list-group-item" @click="toChat">
        <div class="chat-list-group-item-title">
          <span>系统消息</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
interface List {
  recentContent: string
  userImage: string
  userId: string
  recentTime: string
  username: string
}

import { Search } from '@element-plus/icons-vue';
import { ref } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { clickMyMessageApi } from '@/apis/message/index';

const router = useRouter();
const route = useRoute();

const keywords = ref<string>("");
const friendsShow = ref<Boolean>(false);


const userList = ref<List[]>([]);

const getData = async () => {
  const { data: res } = await clickMyMessageApi();
  console.log(res);
  userList.value = res.data;
}

getData()

// 清除未读
const clear = () => {
  console.log('清除未读');
};

const toChat = () => {
  router.push('/campus/message/sys');
}

const toPage = (id: string) => {
  router.push('/campus/message/' + id);
};
const goToAddFriend = () => {
    // 跳转到添加好友界面的逻辑
    router.push('/campus/message/add-friend');
  };
</script>


<style lang="less" scoped>
/* 样式重置 */
* {
margin: 0;
padding: 0;
box-sizing: border-box;
}

.aside {
width: 100%;
background: #fff;
overflow-y: auto;

.head {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;

  .head-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .head-left {
      display: flex;
      align-items: center;

      .title {
        margin-right: 10px;
        font-size: 18px;
        font-weight: bold;
      }
    }

    .head-right {
      font-size: 20px;
    }

    .iconfont {
      cursor: pointer;
    }
  }
}

.search {
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}

.chat-list-group {
  list-style: none;
  padding: 10px;

  .chat-list-group-item {
    margin-bottom: 10px;

    .chat-list-group-item-title {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .chat-user-list-group {
      list-style: none;

      .chat-user-list-group-item {
        display: flex;
        align-items: center;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;

        &--active {
          background-color: #f0f5ff;
        }

        .content-name {
          display: flex;
          align-items: center;

          .time {
            margin-left: 10px;
            color: #999;
          }
        }

        .content {
          margin-top: 5px;
          font-size: 14px;
          color: #666;
        }
      }
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
