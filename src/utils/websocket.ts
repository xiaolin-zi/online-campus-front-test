// const ws_uri = 'ws://192.168.43.144:7002/campusMessage/websocket/1';

export function webSocketInit(uri: any, agentData: any, successCb: any) {
  if (typeof WebSocket === 'undefined') {
    console.log('你的浏览器暂不支持websocket... >_<');
    return;
  }

  let webSocket = new WebSocket(uri);

  webSocket.onopen = function(evt: any) {
    console.log('onOpen: ', evt);
    console.log('ws.readyState: ' + webSocket.readyState);

    if (webSocket.readyState === webSocket.OPEN) {
      console.log('创建成功 开始发消息!');
      webSocket.send(JSON.stringify(agentData));

      // 启用成功回掉函数
      successCb(agentData);
    }
  }

  webSocket.onclose = function(evt: any) {
    console.log('onClose: ', evt);
  }

  webSocket.onerror = function(evt: any) {
    console.log('onError: ', evt);
  }

  webSocket.onmessage = function(evt: any) {
    console.log('onMessage: ', evt);
  }

  console.log('创建websocket: ', webSocket);
  return webSocket;
}