export interface Dynamic {
  _id: string,
  uuid: string,
  promulgatorId: string,
  promulgatorName: string,
  promulgatorImage: string,
  content: string,
  photos: Array<string>,
  city: string,
  address: string,
  label: Array<string>,
  likeId: Array<string>,
  likeName: Array<string>,
  targets: Array<string>,
  status: number,
  comments: Array<Comment>,
  deleted: boolean,
  createTime: string,
  updateTime: string
}

export interface Comment {
  uuid: string,
  _class: string,
  content: string,
  sender: string,
  receiver: string,
  senderName: string,
  receiverName: string,
  deleted: boolean,
  createTime: string,
  updateTime: string
}