<template>
  <div class="messages-box">
    <van-nav-bar class="header-box">
      <template #left>
        <van-icon name="arrow-left" size="18" color="#0a1629" @click="() => { router.push('/campus/message'); }"/>
      </template>
      <template #title>
        <p class="title">系统消息</p>
      </template>
    </van-nav-bar>

    <div class="message-box-wrapper">
      <div class="message-box">
        <div v-for="(item, index) in systemList" :key="index">
          <div class="message-wrapper">
            <p class="message-time">{{ item.createTime }}</p>
            <div class="message">
              <van-image src="https://edu20230513.oss-cn-guangzhou.aliyuncs.com/2023/07/25/338d98830092451bbd00ee2af233289b.png" round class="avatar"/>
               <!-- <el-image style="width: 40px; height: 40px; border-radius: 5px" src="https://edu20230513.oss-cn-guangzhou.aliyuncs.com/2023/07/25/338d98830092451bbd00ee2af233289b.png" /> -->
               <div class="message-content">
                <div class="text-message text-message-receiver">
                  <p>{{ item.content }}</p>
                </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { System } from '@/interfaces/message';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
import { initMessageApi } from '@/apis/message/index';

// const systemList = ref<System[]>([{ content: 'msg1', createTime: 'create-time', sender: 'senderXXX'}]);
const systemList = ref<System[]>([]);

onMounted(() => {
  getData();
});

const getData = async () => {
  const { data: res } = await initMessageApi();
  console.log(res.data.system);
  systemList.value = res.data.system.reverse();
}



</script>

<style lang="less" scoped>
.messages-box {
  .header-box {
    width: 100%;
    z-index: 100;
    overflow: hidden;
    top: 0;
    position: fixed;
    height: 50px;
    background: #f6f6f6;
    .title {
      color: #0a1629;
      line-height: 50px;
      text-align: center;
      font-size: 22px;
    }
  }

  .message-box-wrapper {
    margin-top: 50px;
      height: 100%;
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

                  .avatar {
                    width: 40px;
                    height: 40px;
                  }

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
}

</style>
