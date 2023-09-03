import { defineStore } from 'pinia';

export const useGlobalWs = defineStore('GlobalWs', {
  state: () => ({
    ws: {}
  }),
  actions: {
    connectWs(uri: string) {
      this.ws = new WebSocket(uri);
    }
  }
});