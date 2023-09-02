import { createRouter, createWebHistory } from 'vue-router';
import { useGlobalStore } from '@/stores/useGlobalStore';
import { showToast } from 'vant';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: 'login'
    },
    {
      path: '/campus',
      redirect: 'campus/dashboard',
      name: '线上校园',
      component: () => import('@/layout/index.vue'),
      children: [
        {
          path: '/campus/dashboard',
          name: '线上校园-首页',
          component: () => import('@/views/dashboard/index.vue'),
        },
        {
          path: '/campus/contact',
          name: '线上校园-交际',
          component: () => import('@/views/contact/index.vue'),
        },
        {
          path: '/campus/message',
          name: '线上校园-消息(列表)',
          component: () => import('@/views/message/index.vue'),
        },
        {
          path: '/campus/message/:id',
          name: '线上校园-消息-聊天',
          component: () => import('@/views/message/chat/index.vue'),
        },
        {
          path: '/campus/message/sys',
          name: '线上校园-消息-系统通知',
          component: () => import('@/views/message/sys/index.vue'),
        },
        {
          path: '/campus/user',
          name: '线上校园-用户',
          component: () => import('@/views/user/index.vue'),
        }
      ]
    },
    {
      path: '/campus/contact/add',
      name: '线上校园-交际-写动态',
      component: () => import('@/views/contact/add/index.vue'),
    },
    {
      path: '/campus/contact/search',
      name: '线上校园-交际-搜索',
      component: () => import('@/views/contact/search/index.vue')
    },
    {
      path: '/login',
      name: '线上校园-登录',
      component:  () => import('@/views/login/index.vue'),
    },
    {
      path: '/register',
      name: '线上校园-注册',
      component:  () => import('@/views/register/index.vue'),
    },
    { 
      path: '/getAccount',
      name: '线上校园-忘记密码',
      component: () => import('@/views/forget/getAccount.vue'),
    },
    { 
      path: '/verifyPhone', 
      name:'线上校园-手机验证',
      component: () => import('@/views/forget/verifyPhone.vue') 
    },
    { 
      path: '/verifyEmail', 
      name:'线上校园-邮箱验证', 
      component: () => import('@/views/forget/verifyEmail.vue') 
    },
    { 
      path: '/forget', 
      name:"forget", 
      component: () => import('@/views/forget/forget.vue') 
    },
  ],
});

router.beforeEach((to, from, next) => {
  const globalStore = useGlobalStore();
  let token = globalStore.token;

  // console.log('router beforeEach', from.path, to.path);

  if (to.path === '/login' || to.path === '/register') {
    next();
  } else {
    if (token != null || token !== '' || token !== undefined) {
      next();
    } else {
      showToast('请登录.');
      globalStore.$reset(); // 清空pinia所有状态数据
      router.push('/login');
    }
  }
  next();
});

export default router;