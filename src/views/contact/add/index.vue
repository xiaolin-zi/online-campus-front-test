<template>
  <div class="add-box">
    <van-nav-bar class="header-box">
      <template #left>
        <van-icon name="arrow-left" size="30" color="#fff" @click="toDashboard"/>
      </template>
      <template #title>
        <p class="title">写动态</p>
      </template>
      <template #right>
        <van-button 
          type="default" 
          class="release-btn" 
          size="small" 
          @click="handleRelease" 
          :disabled="isDisabled">发布</van-button>
      </template>
    </van-nav-bar>
    <van-field class="field-box"
      v-model="dynamic.content"
      rows="5"
      autosize
      type="textarea"
      placeholder="说点什么吧......"
    />
    <div class="upload-box">
      <p class="tips">最多上传六张文件</p>
      <van-uploader 
        :max-count="6"
        :max-size="5 * 1024 * 1024"
        :before-read="beforeRead"
        @oversize="onOversize"
        v-model="fileList" 
        multiple/>
    </div>
    <div class="bottom-box">
      <van-cell-group>
        <van-cell :title="locationMsg" icon="location-o" is-link @click="getLocation"/>
        <van-cell :title="statusMsg" icon="contact" is-link @click="showContact = true"/>
        <van-action-sheet
          v-model:show="showContact"
          :actions="actions"
          @select="onSelect"
          @cancel="onCancel"
          cancel-text="取消"
          close-on-click-action
        />
      </van-cell-group>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch, toRaw, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { showConfirmDialog, showToast } from 'vant';
import { getIpInfo } from '@/utils/location';
import { uploadImgApi } from '@/apis/contact/oss';
import { insertDynamicApi } from '@/apis/contact/dynamic';
import { onlineUserStore } from '@/stores/onlineUser';

export default {
  name: 'add',
  setup() {
    const isDisabled = ref(true);
    const fileList = ref([]);
    const dynamic = reactive({
      promulgatorId: '', // 发布者账号
      promulgatorName: '', // 发布者昵称
      promulgatorImage: '', // 发布者头像
      content: '', // 文案
      photos: [], // 图片url集合
      city: '', // 城市
      address: '', // 地理位置信息
      label: [], // 标签列表
      status: 0 // 状态(0-公开/1-部分好友可见/2-私有)
    });
    const showContact = ref(false);
    const actions = [ 
      { name: '公开(默认)', color: '#000', value: 0 },   
      { name: '部分人可见', color: '#000', value: 1 },
      { name: '仅自己可见', color: '#000', value: 2 }
    ];
    const locationMsg = ref('所在位置');
    const statusMsg = ref('动态阅读权限');

    const { uid, username } = storeToRefs(onlineUserStore());
    dynamic.promulgatorId = uid.value;
    dynamic.promulgatorName = username.value;

    
    const beforeRead = (file: File|any) => {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        showToast('仅支持上传jpg/png格式的图片');
        return false;
      }
      return true;
    }
    const onOversize = () => {
      showToast('文件大小不能超过5MB!');
    }
    const onSelect = (e: any) => {
      // console.log(e);
      dynamic.status = e.value;
      statusMsg.value = e.name;

      for (let k in actions) {
        actions[k].color = '#000';
      }
      e.color = '#41B883';
    }
    const onCancel = () => {
      statusMsg.value = '动态阅读权限';

      for (let k in actions) {
        actions[k].color = '#000';
      }
    }

    watch([() => dynamic.content, fileList], ([newContent, newFileList]) => {
      if (newContent !== '' || newFileList.length !== 0) {
        isDisabled.value = false;
      } else isDisabled.value = true;
    })
    
    return {
      isDisabled,
      fileList,
      dynamic,
      beforeRead,
      onOversize,
      onSelect,
      onCancel,
      showContact,
      actions,
      locationMsg,
      statusMsg
    }
  },
  mounted() {
    // console.log(this.dynamic);
  },
  methods: {
    toDashboard() {
      this.$router.push('/campus/contact');
    },
    handleRelease() {
      showConfirmDialog({
        title: '提示',
        message: '确认发布动态?',
      }).then(() => { this.releaseDynamic(); }).catch(() => {});
    },
    async releaseDynamic() {
      this.dynamic.photos = [];
      
      let fileArr = toRaw(this.fileList);

      // 在提交时将图片上传到服务器上去
      for (let i in fileArr) {
        let curFile: any = toRaw(fileArr[i]);
        let imgSource = curFile.file;
        let formData = new FormData();
        formData.append('file', imgSource);

        const { data: uploadRes } = await uploadImgApi(formData);
        // console.log(uploadRes);
        if (uploadRes && uploadRes.code === 0) {
          this.dynamic.photos.push(uploadRes.data);
        } else {
          showToast('内部错误, 请稍后重试!');
          return;
        }
      }

      const { data: insertRes } = await insertDynamicApi(toRaw(this.dynamic));
      // console.log(insertRes);
      if (insertRes && insertRes.code === 0) {
        showToast('动态发布成功!');
        this.$router.push('/campus/contact');
      } else showToast('内部错误, 请稍后重试!');
    },
    async getLocation() {
      const { data: ipRes } = await getIpInfo();
      // console.log(ipRes);
      if (ipRes && ipRes.status === '1') {
        showToast('获取位置成功!');
        this.locationMsg = ipRes.province + '·' + ipRes.city;
        this.dynamic.address = ipRes.province + ipRes.city;
        this.dynamic.city = ipRes.city;
      }
      else showToast('Oops! 位置获取失败, 请稍后重试!');
    }
  }
}
</script>

<style lang="less" scoped>
.add-box {
  width: 100%;
  height: 100%;
  overflow: auto;
  .header-box {
    width: 100%;
    line-height: 50px;
    height: 50px;
    background: #2a3631;

    .title {
      font-family: '黑体';
      line-height: 50px;
      color: #fff;
      font-size: 30px;
    }
    .release-btn {
      font-size: 20px;
      font-family: '黑体';
    }
  }
  .field-box {
    width: 100%;
    // border: 2px solid #000;
  }
  .upload-box {
    margin: 10px;
    .tips {
      color: #ddd;
      font-size: 10px;
      margin-bottom: 10px;
    }
  }
  .bottom-box {
    margin-top: 120px;
    font-family: '黑体';
  }
}
</style>