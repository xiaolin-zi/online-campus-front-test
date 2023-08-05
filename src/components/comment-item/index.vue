<template>
  <div class="comment-item-box">
    <div class="main-box">
      <div class="left-box">
        <van-image :src="avatar2" round class="avatar"/>
      </div>
      <div class="right-box">
        <div class="user">
          <p>用户&nbsp;{{ item.senderName }}</p>
        </div>
        <div class="release-time">
          <p>发布于&nbsp;{{ item.createTime }}</p>
        </div>
        <div class="content-box">
          <van-text-ellipsis
            :content="item.content" 
            rows="20"
            expand-text="展开" 
            collapse-text="收起"/>
        </div>
        <div class="operate-box">
          <ul>
            <li @click="deleteComment"><p style="color: #f00;">删除</p></li>
            <li @click="showReplySheet"><p style="color: #007497;">回复</p></li>
          </ul>
        </div>
      </div>
    </div>

    <van-action-sheet 
      :show="replySheetVisible" title="回复给xxx"
      @cancel="replySheetVisible = false">
      <div class="reply-box">
        回复盒
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup lang="ts">
import avatar2 from '@/assets/img/avatar2.jpg';
import { ref } from 'vue';

const props = defineProps({
  item: Object
});

const replySheetVisible = ref(false);

// 展示某条评论的回复表
const showReplySheet = () => {
  replySheetVisible.value = true;
}

// 删除某条评论
const deleteComment = () => {

}
</script>

<style scoped lang="less">
.comment-item-box {
  width: 100%;
  box-sizing: border-box;
  // height: 200px;
  overflow: auto;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);

  .main-box {
    // border: 1px solid #d38910;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    .left-box {
      width: 50px;
      box-sizing: border-box;
      height: 100%;
      float: left;
      .avatar {
        display: block;
        margin: 5px auto;
        width: 40px;
        height: 40px;
      }
    }

    .right-box {
      margin-left: 5px;
      margin-top: 5px;
      width: 100%;
      box-sizing: border-box;
      .user, .release-time {
        font-weight: 900;
        font-size: 13px;
        line-height: 20px;
      }
      .content-box {
        margin-top: 5px;
        font-size: 20px;
        width: 300px;
      }
      .operate-box {
        box-sizing: border-box;
        font-size: 11px;
        width: 100%;
        display: block;
        overflow: hidden;
        margin-bottom: 10px;
        ul {
          // border: 1px solid #f00; 
          float: right;
          li {
            width: 50px;
            text-align: center;
            cursor: pointer;
            display: inline-block;
          }
        }
      }
    }
  }

  .reply-box {
    box-sizing: border-box;
    padding: 10px;
    width: 100%;
    overflow: hidden;
    height: 700px;
  }
}
</style>