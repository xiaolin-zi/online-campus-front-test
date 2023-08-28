import { contactRequest } from '@/utils/request';

// 发布动态
export const insertDynamicApi = function(entity: any) {
  return contactRequest({
    method: 'post',
    url: '/dynamic/insertDynamic',
    data: entity
  });
}

// 查询动态
export const searchDynamicApi = function(): any {
  return contactRequest({
    method: 'get',
    url: '/dynamic/searchDynamic',
    params: {
      content: ''
    }
  });
}

// 删除动态
export const deleteDynamicApi = function() {
}

// 点赞动态
export const insertLikeApi = function(dynamicId: string, username: string): any {
  return contactRequest({
    url: '/dynamic/insertLike',
    method: 'get',
    params: {
      dynamicId,
      username
    }
  });
}

// 取消点赞动态
export const deleteLikeApi = function(dynamicId: string, username: string): any {
  return contactRequest({
    url: '/dynamic/deleteLike',
    method: 'get',
    params: {
      dynamicId,
      username
    }
  });
}

// 发布评论
export const sendCommentApi = function(form: any): any {
  return contactRequest({
    url: '/dynamic/addComment',
    method: 'post',
    data: form
  });
}

// 删除评论
export const deleteCommentApi = function(form: any) {
  return contactRequest({
    url: '/dynamic/deleteComment',
    method: 'post',
    data: form
  });
}