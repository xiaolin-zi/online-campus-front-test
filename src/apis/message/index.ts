import { messageRequest } from '@/utils/request';

interface SendBody {
    content?: string
    sender?: string
    receiver?: string
    type?: number
    isPhoto?: boolean
}

// 消息初始化
// export const initUserMessage = () => {
//   return messageRequest({
//     method: 'get',
//     url: '/campusMessage/message/initUserMessage',   
//   });
// }

// 消息初始化
export const initMessageApi = () => {
  console.log('initMessage');
  return messageRequest({
    method: 'get',
    url: '/message/initMessage',   
  });
}

export const clickMyMessageApi = () => {
  return messageRequest({
    method: 'get',
    url: '/message/clickMyMessage',   
  });
}

// 获取用户的聊天记录
export const getUserChatRecords = (friendId: any) => {
    return messageRequest({
        method: 'get',
        url: `/message/lazyLoadingChatRecords?friendId=${friendId}`,   
    });
}

// 清除未读
export const clearUnRead = () => {
    return messageRequest({
        method: 'get',
        url: '/message/clearUnRead',   
    })
}

export const sendMessage = (data: SendBody) => {
    return messageRequest({
        method: 'post',
        url: '/message/send',
        data
    })
}