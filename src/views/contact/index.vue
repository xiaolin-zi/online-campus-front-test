<template>
  <div class="contact-dashboard-box">
    <van-nav-bar class="header-box">
      <template #left>
        <van-icon name="arrow-left" size="25" color="#fff" @click="toIndex"/>
        <p class="title">Online Contact</p>
      </template>
      <template #right>
        <van-icon name="search" size="25" color="#fff" @click="toSearch"/>
        &nbsp;&nbsp;&nbsp;
        <van-icon name="bell" size="25" color="#fff" :dot="true"/>
        <van-image round class="avatar"
          fit="cover"
          :src="avatar2"
        />
      </template>
    </van-nav-bar>
    <div class="main-box">
      <van-loading size="24px" v-if="isLoading" class="loading-box" text-size="20px">Loading...</van-loading>
      <dynamicItem
        v-for="item in contactList.values" 
        v-bind:key="item._id" 
        :item="item"
        @on-comment="showSheetFn"
        @on-like="insertLike"
        @on-dislike="cancelLike"/>
      <van-floating-bubble axis="xy" magnetic="x" icon="edit" @click="toAdd"/>
      <van-back-top target=".main-box"/>

      <van-empty image="network" description="网络出错啦!" v-show="isNetworkError"/>
      <van-empty description="一片空白......" v-show="contactList.values.length === 0 && isLoading === false"/>
    </div>
    <van-action-sheet :show="showSheet" :title="sheetTitle" @cancel="showSheet = false">
      <div class="sheet-box">
        <div class="sheet-main">
          <commentItem 
            v-for="item in commentList.values" 
            v-bind:key="item.uuid" 
            :item="item"/>
        </div>
        <van-field class="comment-field-box" v-model="commentContent" rows="1" autosize type="textarea" placeholder="说点什么吧...">
          <template #button>
            <van-button size="small" type="primary" @click="sendComment">发送</van-button>
          </template>
        </van-field>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup >
import dynamicItem from '@/components/dynamic-item/index.vue';
import commentItem from '@/components/comment-item/index.vue';
import { searchDynamicApi, insertLikeApi, deleteLikeApi, sendCommentApi } from '@/apis/contact/dynamic';
import { storeToRefs } from 'pinia';
import avatar2 from '@/assets/img/avatar2.jpg';
import { showConfirmDialog, showToast } from 'vant';
import { reactive, ref, onMounted, toRaw, nextTick, onUpdated } from 'vue';
import { useRouter } from 'vue-router';
import { onlineUserStore } from '@/stores/onlineUser';

// 获取当前username和uid
const { uid, username } = storeToRefs(onlineUserStore());

const contactList = reactive([]);
const commentList = reactive([]);

const isLoading = ref(true);
const isNetworkError = ref(false);

const showSheet = ref(false);
const sheetTitle = ref('评论区');
const commentContent = ref('');

const targetContact = reactive({});

const router = useRouter();

onMounted(() => {
  getAllContacts();
});

onUpdated(() => {
  getAllContacts();
});

const getAllContacts = async () => {
  const { data: listRes } = await searchDynamicApi();
  // console.log(listRes);
  if (listRes && listRes.code === 0) {
    contactList.values = listRes.data;
  } else {
    isNetworkError.value = true
  }
  isLoading.value = false;
}

// 展示评论区
const showSheetFn = (item) => {
  let itemRaw = toRaw(item);
  targetContact.value = itemRaw; // 先把要评论的动态贴文给获取到
  console.log(itemRaw.comments);
  sheetTitle.value = `评论区(${itemRaw.comments.length})`;
  commentList.values = itemRaw.comments;
  nextTick(() => { showSheet.value = true; });
}

// 获取最新的评论列表
// const getCommentList = () => {
//   getAllContacts();
// }

// 发送评论
const sendComment = () => {
  // console.log(toRaw(targetContact.value));
  const { _id } = toRaw(targetContact.value);
  showConfirmDialog({ title: '提示', message: '确认发送评论?' }).then(async () => {
    let addCommentForm = {
      dynamicId: _id,
      senderId: uid.value,
      senderName: username.value,
      content: commentContent.value
    };
    // console.log(addCommentForm);
    const { data: sendRes } = await sendCommentApi(addCommentForm);
    // console.log(sendRes);
    if (sendRes && sendRes.code === 0) {
      showToast('发送评论成功~');
    } else {
      showToast('OOPS! 内部小错误,请稍后重试!');
    }
    commentContent.value = '';
  }).catch(() => { showToast('已取消操作~'); });
}

// 点赞或取消点赞
const insertLike = async (dynamicId) => {
  // console.log('handle like: ', dynamicId, username.value);
  const { data: res } = await insertLikeApi(dynamicId, username.value);
  if (res && res.code === 0) {
    showToast('点赞成功~');
    getAllContacts(); // 刷新
  } else {
    showToast('OOPS! 内部小错误,请稍后重试!');
  }
}
const cancelLike = async (dynamicId) => {
  // console.log('handle like: ', dynamicId, username.value);
  const { data: res } = await deleteLikeApi(dynamicId, username.value);
  if (res && res.code === 0) {
    showToast('已取消点赞~');
    getAllContacts(); // 刷新
  } else {
    showToast('OOPS! 内部小错误,请稍后重试!');
  }
}

// 跳转到搜索
const toSearch = () => {
  router.push('/campus/contact/search');
}

// 跳转到写动态
const toAdd = () => {
  router.push('/campus/contact/add');
}

const toIndex = () => {
  showToast('返回主页!');
}

</script>

<style lang="less" scoped>
@font-face {
  font-family: 'klavika-light';
  src: url('../../assets/font/klavika-light.otf');
}
@font-face {
  font-family: 'klavika-bold';
  src: url('../../assets/font/klavika-bold.otf');
}

.contact-dashboard-box {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  background: #fff;

  .header-box {
    width: 100%;
    z-index: 100;
    top: 0;
    position: fixed;
    line-height: 50px;
    height: 50px;
    background: #2a3631;

    .title {
      font-family: 'klavika-bold';
      line-height: 50px;
      margin-left: 16px;
      text-align: center;
      color: #fff;
      font-size: 26px;
    }
    .avatar {
      cursor: pointer;
      margin-left: 18px;
      width: 30px;
      height: 30px;
    }
  }

  .main-box {
    overflow: auto;
    width: 100%;
    height: 100%;
    margin-top: 60px;

    .loading-box {
      color: #2a3631;
      text-align: center;
    }
  }

  .sheet-box {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 640px;
    margin-bottom: 60px;
    overflow: hidden;

    .sheet-main {
      width: 100%;
      box-sizing: border-box;
      height: 100%;
      overflow: auto;
    }

    .comment-field-box {
      position: fixed;
      width: 100%;
      bottom: 0;
      background: #fbfafa;
    }
  }
}
</style>