<template>
  <div class="search-box">
    <van-search
      v-model="inputValue"
      show-action
      placeholder="搜点什么吧"
      @search="onSearch"
      @cancel="onCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { showToast } from 'vant';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const inputValue = ref('');
const router = useRouter();

const onSearch = (val: string) => {
  showToast(val);
}

const onCancel = () => {
  inputValue.value = '';
  router.push('/campus/contact');
}
</script>

<style lang="less" scoped>
.search-box {
  width: 100%;
  height: 100%;
  background: #999;
  .operate-box {
    height: 50px;
    width: 100%;
  }
}
</style>