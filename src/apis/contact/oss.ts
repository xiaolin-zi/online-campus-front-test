import { ossRequest } from '@/utils/request';

export const uploadImgApi = (formData: any) => {
  return ossRequest({
    url: '/eduoss/fileoss',
    method: 'post',
    data: formData
  });
}