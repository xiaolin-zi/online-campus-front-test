import { ossRequest } from '@/utils/request';

export const uploadImgApi = (formData) => {
  return ossRequest({
    url: '/eduoss/fileoss',
    method: 'post',
    data: formData
  });
}