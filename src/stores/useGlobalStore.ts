import { defineStore } from 'pinia';

// 当前在线用户状态管理
export const useGlobalStore = defineStore('globalState', {
  state: () => {
    return {
      token: 't2',
      uid: 't2',
      username: 't2',
      userImg: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
    }
  },
  getters: {},
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setUid(uid: string) {
      this.uid = uid;
    },
    setUsername(username: string) {
      this.username = username;
    },
  },
  // persist: {
  //   enabled: true
  // }
});