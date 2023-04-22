
// 引入 Vue
import Vue from 'vue'
// 引入 vuex
import Vuex from 'vuex'
import home from './home/index'
import search from './search/index'
import detail from './detail/index'
import shopcart from './shopcart/index'
import user from './user/index'
import trade from './trade/index'
// 使用 vuex 插件
Vue.use(Vuex)
// // state 仓库存储数据的地方
// const state = {}
// // mutations 修改state的唯一手段
// const mutations = {}
// // actions 处理action，可以书写自己的业务逻辑，也可以处理异步
// const actions = {}
// // getters 可以理解为 计算属性
// const getters = {}

// 对外暴露
export default new Vuex.Store({
    // state,
    // actions,
    // mutations,
    // getters
    modules:{
        home,
        search,
        detail,
        shopcart,
        user,
        trade
    }
})