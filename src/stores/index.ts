import { createPinia } from 'pinia';
import piniaPluginPersist from 'pinia-plugin-persist';

const stores = createPinia();
stores.use(piniaPluginPersist);

export default stores;
