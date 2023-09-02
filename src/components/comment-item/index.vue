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
          <div class="to-sender" v-show="item.receiver != null">
            <div class="prefix-p">回复:</div>
            <van-text-ellipsis
              :content="targetContent" 
              rows="15"
              expand-text="展开" 
              collapse-text="收起"/>
          </div>
          <van-text-ellipsis
            :content="item.content" 
            rows="20"
            expand-text="展开" 
            collapse-text="收起"/>
        </div>
        <div class="operate-box">
          <ul>
            <li @click="deleteComment(dynamic._id, item.uuid)" v-show="showDeleteBtn"><p style="color: #f00;">删除</p></li>
            <li @click="showReplySheet(item.senderName)"><p style="color: #007497;">回复</p></li>
          </ul>
        </div>
      </div>
    </div>

    <van-action-sheet 
      :show="replySheetVisible" :title="replySheetTitle"
      @cancel="replySheetVisible = false">
      <div class="reply-box">
        <van-field
          v-model="replyContent"
          rows="12"
          show-word-limit
          maxlength="600"
          type="textarea"
          placeholder="输入你的回复吧">
          <template #button>
            <van-button 
              size="small" 
              type="primary" 
              @click="handleReply(dynamic._id, item.uuid, item.senderName)">发送</van-button>
          </template>
        </van-field>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup lang="ts">
import avatar2 from '@/assets/img/avatar2.jpg';
import { ref, computed, nextTick, toRaw, onMounted } from 'vue';
import { Comment, Dynamic } from '@/interfaces/contact';
import { showConfirmDialog, showToast } from 'vant';
import { sendCommentApi } from '@/apis/contact/dynamic';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '@/stores/useGlobalStore';
const { uid, username } = storeToRefs(useGlobalStore()); // 获取当前username和uid

const props = defineProps<{ 
  item: Comment, 
  dynamic: Dynamic
}>();

const replySheetVisible = ref(false);
const replySheetTitle = ref('回复给');
const replyContent = ref('');

const emit = defineEmits(['on-delete', 'on-reply-finish']);
const showDeleteBtn = ref(false);

// 显示回复评论的上级评论
const targetContent = ref('');

onMounted(() => {
  // console.log('comment-item on Mounted');
  let list: Array<Comment> = toRaw(props.dynamic.comments);
  let comment: Comment = toRaw(props.item);
  // console.log(comment);
  let replyExist = false;

  // 查找下级评论
  if (comment.receiver != null) {
    for (let i in list) {
      if (list[i].uuid === comment.receiver) {
        targetContent.value = list[i].senderName + ': ' + list[i].content;
        replyExist = true;
        break;
      }
    }
  }
  // 没有找到
  if (!replyExist) targetContent.value = '评论不存在或已删除';

  // 根据用户展示删除按钮
  // console.log(comment.sender, uid.value);
  if (comment.sender === uid.value) showDeleteBtn.value = true;
});

// 处理回复
const showReplySheet = (senderName: string) => {
  replySheetTitle.value = `回复给用户 ${senderName}`;
  nextTick(() => { replySheetVisible.value = true; });
}
const handleReply = (dId: string, receiverId: string, recevierName: string) => {
  // console.log(dId);
  showConfirmDialog({ title: '提示', message: '确认发送回复?' }).then(async () => {
    let addCommentForm = {
      dynamicId: dId,
      senderId: uid.value,
      senderName: username.value,
      receiverId: receiverId,
      receiverName: recevierName,
      content: replyContent.value
    };
    // console.log('回复评论', addCommentForm);
    const { data: sendRes } = await sendCommentApi(addCommentForm);
    // console.log(sendRes);
    if (sendRes && sendRes.code === 0) {
      showToast('回复成功~');
      replySheetVisible.value = false;
      emit('on-reply-finish');
    } else {
      showToast('OOPS! 内部小错误,请稍后重试!');
    }
    replyContent.value = '';
  }).catch(() => { showToast('已取消操作~'); });
}

// 删除某条评论
const deleteComment = (dynamicId: any, commentId: string) => {
  let deleteCommentForm = { dynamicId, commentId };
  // console.log('deleteComment', uid);
  emit('on-delete', deleteCommentForm);
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
        font-size: 18px;
        width: 320px;
        .to-sender {
          font-size: 14px;
          
          overflow: hidden;
          margin-top: 5px;
          margin-bottom: 5px;
          .prefix-p {
            line-height: 28px;
            color: #202020;
            font-weight: 700;
            width: 40px;
            margin-right: 5px;
            text-align: right;
            float: left; 
          }
          .van-text-ellipsis {
            line-height: 28px;
            float: left;
            border-radius: 0.4em;
            color: rgb(0, 98, 184);
            padding-left: 5px;
            width: 75%;
            background: #d8efff;
          }
        }
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
    height: 310px;
  }
}
</style>@/class/contact@/stores/useGlobalStore