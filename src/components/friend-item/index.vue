<template>
  <div class="friend-item-box" @click="handleToPage(item.userId)">
    <div class="main-box">
      <div class="left-box">
        <van-image :src="item.userImage" round class="avatar"/>
      </div>

      <div class="right-box">
        <div class="right-sub-1">
          <div class="username">
            <p>{{ item.username }}</p>
          </div>
          <div class="recent-time">
            <p>{{ item.recentTime }}</p>
          </div>
        </div>

        <div class="right-sub-2">
          <div class="content">
            <p>{{ item.recentContent }}</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { List } from '@/interfaces/message';

const props = defineProps<{
  item: List
}>();
const emit = defineEmits(['on-to-page']);


const handleToPage = (userId: string) => {
  emit('on-to-page', userId);
}

</script>

<style lang="less" scoped>
.friend-item-box {
  width: 100%;
  color: #0a1629;
  .main-box {
    display: flex;
    width: 100%;
    box-sizing: border-box;
    .left-box {
      height: 100%;
      float: left;
      .avatar {
        box-sizing: border-box;
        display: block;
        width: 45px;
        height: 45px;
      }
    }

    .right-box {
      float: left;
      margin-left: 5px;
      width: 100%;
      box-sizing: border-box;
      .right-sub-1 {
        overflow: hidden;
        height: 28px;
        // border: 1px solid #f00;
        line-height: 28px;
        box-sizing: border-box;
        width: 100%;
        .username {
          font-size: 18px;
          font-weight: bold;
          float: left;
        }
        .recent-time {
          color: #bbb;
          font-size: 15px;
          float: right;
        }
      }
      .right-sub-2 {
        // border: 1px solid #f00;
        width: 100%;
        color: #bbb;
        height: 20px;
        line-height: 20px;
        font-size: 16px;
        overflow: hidden;
      }
    }
  }
}
</style>