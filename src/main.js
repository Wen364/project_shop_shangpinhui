import Vue from 'vue'
import App from './App.vue'
// 引入 Vue-Router
import router from '@/router'
// 注册全局组件 TypeNav
import TypeNav from '@/components/TypeNav/TypeNav.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
// 引入仓库
import store from "@/store/index"
// 引入API
import * as API from '@/api'
// 引入elementUI组件
import { Button, MessageBox } from 'element-ui';
Vue.component(Button.name, Button);
Vue.component(MessageBox.name, MessageBox);
// 设置全局组件
// 第一个参数是 要起的 组件的名字 ，第二个是引入的组件
Vue.component('TypeNav',TypeNav)
Vue.component('Pagination',Pagination)
// 引入 mockServe.js  --- mock数据
import '@/mock/mockServe'
// 引入swiper样式
import 'swiper/css/swiper.css'

Vue.config.productionTip = false

Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

// 引入插件
import VueLazyload from 'vue-lazyload'
import sheep from '@/assets/images/sheep.jpg'
Vue.use(VueLazyload,{
  // 懒加载默认的图片
  loading:sheep
})
// 引入VeeValidate插件
import VeeValidate from '@/plugins/validate'

new Vue({
  el:'#app',
  render: h => h(App),
  // 注册路由
  router,
  // 注册仓库：组件实例的身上会多出一个 $store 的属性
  store,
  // 创建全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this
    // 适用于不适用vuex时，来调用api里面的请求
    Vue.prototype.$API = API
  }
})
