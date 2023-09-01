<template>
  <div class="messages">
    <header class="message-title">
      <p>系统消息</p>
    </header>
    <div class="message-box-wrapper">
      <div class="message-box">
        <div v-for="(item, index) in systemList" :key="index">
          <div class="message-wrapper">
            <p class="message-time">{{ item.createTime }}</p>
            <div class="message">
               <el-image style="width: 40px; height: 40px; border-radius: 5px" src="https://edu20230513.oss-cn-guangzhou.aliyuncs.com/2023/07/25/338d98830092451bbd00ee2af233289b.png" />
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
interface System {
  content: string
  createTime: string
  sender: string
}

import { ref } from "vue";
import { initMessage } from '@/apis/message/index';

const systemList = ref<System[]>([])

const getData = async () => {
  const res = await initMessage()
  console.log(res.data.data.system);
  systemList.value = res.data.data.system.reverse()
}

getData()

</script>

<style lang="less" scoped>
.messages {
  .message-title {
      border-bottom: 1px solid #ebebeb;
      line-height: 50px;
      text-align: center;
      margin: 0 14px;

      p {
          font-size: 600;
          color: #121212;
          font-weight: bold;
      }
  }

  .message-box-wrapper {
      height: 92vh;
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
              .text-message-receiver {
                  background-color: #f6f6f6;
                  color: #444;
                  position: relative;

                  &::after {
                      background: #f6f6f6;
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
