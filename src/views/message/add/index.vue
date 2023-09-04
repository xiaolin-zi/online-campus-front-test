<template>
  <div class="add-friend-box">
    <van-search
      v-model="inputValue"
      show-action
      placeholder="搜索用户名..."
      @search="onSearch"
      @cancel="onCancel">
    </van-search>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { showToast } from 'vant';
import { useRouter } from 'vue-router';
import { debounceFn } from '@/utils/debounce';

const inputValue = ref('');
const router = useRouter();

const onSearch = (val: string) => {
  showToast(val);
}

// const fn = () => {
//   let exec = debounceFn(() => { console.log(inputValue.value); }, 2000);
//   exec();
// }
const onCancel = () => {
  inputValue.value = '';
  router.push('/campus/message');
}

</script>

<style lang="less" scoped>
.add-friend-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>