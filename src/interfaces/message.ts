export interface List {
  recentContent: string
  userImage: string
  userId: string
  recentTime: string
  username: string
}

export interface User {
  username?: string
  userImage?: string
  userId?: string
}

export interface ChatList {
  content: string
  receiver: string
  createTime: string
}

export interface System {
  content: string
  createTime: string
  sender: string
}