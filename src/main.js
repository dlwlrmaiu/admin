import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import router from './router';
import store from './store';
import '@/styles/index.less'
import moment from 'moment'

Vue.use(ElementUI);

Vue.config.productionTip = false;

// 全局过滤器
Vue.filter('formatDate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
