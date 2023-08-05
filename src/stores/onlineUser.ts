import { defineStore } from 'pinia';

// 当前在线用户状态管理
export const onlineUserStore = defineStore('useOnlineUserStore', {
  state: () => {
    return {
      uid: 't2',
      username: 't2'
    }
  },
  getters: {},
  actions: {}
});