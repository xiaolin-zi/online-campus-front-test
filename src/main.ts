import { createApp } from 'vue';
import Vant from 'vant';
import 'vant/lib/index.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'font-awesome/css/font-awesome.min.css';
import stores from '@/stores/index';
import routers from '@/routers';
import App from '@/App.vue';

// 导入全局css
import '@/assets/css/normalize.css';
import '@/assets/css/iconfont.css';

const app = createApp(App);

app.use(stores).use(routers).use(Vant).use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app');
