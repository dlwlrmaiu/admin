import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import router from './router';
import store from './store';
// 引入自定义样式
import '@/styles/index.less'
import moment from 'moment'

// 引入组件对象
import Bread from '@/components/bread/index'

Vue.use(ElementUI);

Vue.config.productionTip = false;

// 全局过滤器
Vue.filter('formatDate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})
// 注册全局组件
Vue.component(Bread.name, Bread)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
