<template>
  <div class="messages">
    <header class="message-title">
      <div class="head-left">
      <el-icon @click="goBack" class="arrow-icon"><ArrowLeft /></el-icon> 
    </div>
    <div class="head-center">   
      <p>{{ user.username }}</p>
    </div>
    </header>
    <div class="message-box-wrapper" ref="messageBox">
      <div class="message-box">
        <div v-for="(item, index) in chatList" :key="index">
          <div class="message-wrapper">
            <p class="message-time">{{ item.createTime }}</p>
            <div class="message" :class="item.receiver !== user.userId ? '' : 'message-send'">
              <template v-if="item.receiver !== user.userId">
                <el-image style="width: 40px; height: 40px; border-radius: 5px" :src="user.userImage" />
              </template>
              <template v-else>
                <el-image style="width: 40px; height: 40px; border-radius: 5px"
                  :src="userImg" />
              </template>
              <div class="message-content">
                <div class="text-message" :class="item.receiver !== user.userId ? 'text-message-receiver' : 'text-message-send'">
                  <p>{{ item.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="input-box">
      <ul class="tool-bar">
        <li class="tool-bar-item">
          <el-popover placement="top-start" :width="400" trigger="click">
            <template #reference>
              <i class="fa fa-smile-o" aria-hidden="true"></i>
            </template>
            <ul class="emoji-list">
              <li v-for="(item, index) in faceList" :key="index" @click="getEmo(index)">
                {{ item }}
              </li>
            </ul>
          </el-popover>
        </li>
        <li class="tool-bar-item" @click="chooseImage">
          <input style="display: none" id="file-input" type="file" @change="fileChange" />
          <el-icon>
            <Picture />
          </el-icon>
        </li>
      </ul>
      <el-input v-model="textarea" :rows="5" type="textarea" id="textarea" />
      <div class="input-box-footer">
        <p>按 Enter 键发送</p>
        <van-button size="small" color="#73c975" :disabled="disabled" @click="send" @keyup.enter="send">发送</van-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { User, ChatList } from '@/interfaces/message';
import { ref, onMounted, computed, onUnmounted, onUpdated, reactive } from 'vue';
import appData from '@/utils/emojis.json';
import { storeToRefs } from 'pinia';
import { useRoute ,useRouter } from 'vue-router';
import { getUserChatRecords, clickMyMessageApi } from '@/apis/message/index';
import { useGlobalStore } from '@/stores/useGlobalStore';
import { wsSendMsg } from '@/utils/websocket';
import { showToast } from 'vant';

const route = useRoute();
const router = useRouter();

const id: any = route.params.id

const { uid, username, userImg } = storeToRefs(useGlobalStore());

const user = ref<User>({})
const chatList = ref<ChatList[]>([])

const faceList = ref<string[]>([]);
const textarea = ref<string>("");

const disabled = computed(() => (textarea.value.length === 0 ? true : false));

const messageBox = ref<any>(null);

onMounted(async () => {
  const { data: res } = await clickMyMessageApi();
  console.log('clickMyMessageApi', res);
})

onMounted(() => {
  getData();
  for (let i in appData) {
    faceList.value.push(appData[i].char);
  }
});

onMounted(() => {
  scrollToBottom();
});

onUpdated(() => {
  scrollToBottom();
});

const scrollToBottom = () => {
  messageBox.value.scrollTop = messageBox.value.scrollHeight;
}

const getData = async () => {
  const { data: res } = await getUserChatRecords(id);
  console.log('getData', res);
  if (res.code === 0) {
    chatList.value = res.data.dialog.reverse();
    user.value = res.data.user;
  } else {
    showToast(res.data);
  }
}

const goBack= () => {     
  router.go(-1); // 使用Vue Router的go方法返回上一个页面
};
const getEmo = (index: number) => {
  var textArea: any = document.getElementById("textarea");
  function changeSelectedText(obj: any, str: any) {
    if (window.getSelection()) {
      textArea.setRangeText(str);
      textArea.selectionStart += str.length;
      textArea.focus();
    } else if (document.getSelection()) {
      obj.focus();
    }
  }
  changeSelectedText(textArea, faceList.value[index]);
  textarea.value = textArea.value;
  return;
};

// 选择图片并上传
const chooseImage = () => {
  const fileInput = document.getElementById("file-input");

  if (fileInput) {
    fileInput.click();
  }
};

const fileChange = (e: any) => {
  console.log(e.target.files[0]);
  let formdata = new FormData();
  formdata.append("file", e.target.files[0]);
};

onMounted(() => {
  window.addEventListener("keydown", keyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", keyDown, false);
});

const keyDown = (e: any) => {
  if (e.keyCode === 13) {
    send();
  }
};

// 发送
const send = async () => {
  let agentData = {
    content: textarea.value,
    type: 0,
    receiver: user.value.userId,
    sender: uid.value,
    isPhoto: false
  }

  wsSendMsg(agentData, successCallback);

  // webSocketInit(`ws://10.120.50.161:7002/${url}/${uid}`, agentData);
  // webSocketInit(`ws://117.72.15.203:9000/${url}/${uid.value}`, agentData, successCallback);

  textarea.value = '' // 聊天框清空
  
};

const successCallback = (data: any) => {
  console.log(data, 'successCallback');
  chatList.value.push(data);
}

const errCallback = (data: any) => {
  console.log(data, 'errCallback');
}

</script>

<style lang="less">
.el-popover {
  height: 200px;
  overflow-y: scroll;
}
</style>

<style lang="less" scoped>
.messages {
  // border: 1px solid #0f0;
  box-sizing: border-box;
  overflow: hidden;
  height: 100%;
  .message-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }

  .arrow-icon {
    cursor: pointer;
    margin-right: 10px;
  }
  .head-center {
    text-align: center;
    flex-grow: 1;
  }
  .message-box-wrapper {
    height: 60vh;
    overflow-y: scroll;
    -ms-flex-negative: 0;
    -webkit-overflow-scrolling: touch;
    flex-shrink: 0;
    position: relative;

    .message-box {
      padding: 24px;

      .message-wrapper {
        .message-time {
          color: #999;
          line-height: 20px;
          font-size: 12px;
          text-align: center;
          padding-top: 15px;
        }

        .message {
          display: flex;
          align-items: flex-start;
          margin: 20px 0;

          .message-content {
            display: flex;
            align-items: center;
            margin: 0 10px;

            .text-message {
              word-wrap: break-word;
              border-radius: 8px;
              box-sizing: border-box;
              font-size: 14px;
              letter-spacing: 0.4px;
              line-height: 20px;
              margin: 0 8px;
              padding: 10px 12px;
              text-align: left;
              white-space: pre-wrap;
              word-break: break-all;

              p {
                box-sizing: border-box;
                margin: 0px;
                min-width: 0px;
              }
            }
          }
        }

        .text-message-send {
          background-color: #73c975;
          position: relative;
          color: #0a1629;

          &::after {
            background: #73c975;
            content: "";
            height: 8px;
            position: absolute;
            right: -4px;
            top: 14px;
            width: 8px;
            transform: rotate(45deg);
          }
        }

        .message-send {
          flex-direction: row-reverse;
        }

        .text-message-receiver {
          background-color: #73c975;
          color: #0a1629;
          position: relative;

          &::after {
            background: #73c975;
            content: "";
            height: 8px;
            left: -4px;
            position: absolute;
            top: 14px;
            width: 8px;
            transform: rotate(45deg);
          }
        }
      }
    }
  }

  .input-box {
    // background: blue;
    border-top: 1px solid #ebebeb;
    margin: 10px 24px;
    padding-top: 10px;

    .tool-bar {
      display: flex;
      align-items: center;

      .tool-bar-item {
        i {
          font-size: 24px;
          color: #646464;
        }

        &+.tool-bar-item {
          margin-left: 10px;
        }
      }
    }

    .el-textarea {
      margin: 10px 0;
      --el-input-border-color: #ebebeb;
      --el-input-hover-border-color: #ebebeb;
      --el-input-focus-border-color: #ebebeb;
    }

    .input-box-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      p {
        color: #b1b1b1;
        margin-right: 10px;
      }
    }
  }
}

.emoji-list {
  display: flex;
  flex-wrap: wrap;

  li {
    padding: 5px;
    font-size: 20px;
    text-align: center;
    cursor: pointer;
  }
}
</style>
@/stores/useGlobalStore