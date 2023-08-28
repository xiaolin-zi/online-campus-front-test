import { createApp } from 'vue';
import Vant from 'vant';
import 'vant/lib/index.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// 导入全局css
import '@/assets/css/normalize.css';
import '@/assets/css/iconfont.css';

import { createPinia } from 'pinia';

import App from '@/App.vue';
import router from '@/routers';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Vant);
app.use(ElementPlus);

app.mount('#app');
