// 获取用户location/ip信息 (采用高德地图平台提供的api)
import axios from 'axios';
const amap_url = 'https://restapi.amap.com/v3/ip';
const amap_key = 'f5b486d5eb5927b24a1917455a8f5404';

export const getIpInfo = () => {
  return axios({
    method: 'get',
    url: amap_url,
    params: {
      key: amap_key
    }
  });
}