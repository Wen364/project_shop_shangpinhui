
// 引入 vue
import Vue from 'vue'
// 引入 VueRouter
import VueRouter from 'vue-router'
// 引入 routes
import routes from './routes'
// 引入 store
import store from '@/store'
// 使用插件
Vue.use(VueRouter)

// copy 一份 原来的 push replace 方法
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace
// 重写 push 和 replace 
// 第一个参数：告诉原来push方法，往哪里跳转（传递哪些参数）
// 第二个参数：成功回调
// 第三个参数：失败的回调

VueRouter.prototype.push = function(location,resolve,rejected) {
    // 如果给了 成功和失败的回调，那就继续走原来push的回调，否则就给两个空的回调
    if(resolve && rejected) {
        // call 和 apply 区别
        // 相同点：都可以调用函数一次，都可以改变函数的上下文（this指向）
        // 不同点：call与apply传递参数，call传递参数用逗号隔开，apply方法执行则传递数组
        originPush.call(this,location,resolve,rejected)
    }else {
        originPush.call(this,location,()=>{},()=>{})
    }
}

VueRouter.prototype.replace = function(location,resolve,rejected) {
    if(resolve && rejected) {
        originReplace.call(this,location,resolve,rejected)
    }else{
        originReplace.call(this,()=>{},()=>{})
    }
}



// 配置路由
let router = new VueRouter({
    // 配置路由
    routes,
    scrollBehavior (to, from, savedPosition) {
        // 返回 y = 0 代表跳转路由时，会自动返回到顶部
        return {y:0}
    }
})

// 全局守卫
router.beforeEach(async(to,from,next) => {
     // 获取token
    let token = store.state.user.token
    // 用户信息 
    let name = store.state.user.userInfo.name
    
    // 用户已经登陆了
    if(token){
        // 如果有token了，还想跳转到login页面，则会直接跳转回home页面
        if(to.path == '/login'){
            next('/home')
        }else{
            // 登录了，但是去的不是home而是其他几个
            // 如果用户名存在
            if(name){
                next()
            }else{
                // 没有用户信息，则派发action让仓库存储用户信息跳转
                try {
                    // 获取信息成功
                   await store.dispatch('user/getUserInfo')
                   //  放行
                   next()
                } catch (error) {
                    // token失效了
                    // 失败的话则退出登录，然后清除token,然后再跳转到login页面重新登录
                    store.dispatch('user/userOutLogin')
                    next('/login')
                }
            }
        }
    }else{
        // 未登录  不能去支付和交易相关页面  pay paysuccess trade 
        let toPtah = to.path
        if(toPtah.indexOf('/pay')!= -1 ||toPtah.indexOf('/trade')!= -1 ||toPtah.indexOf('/center')!= -1 ){
            next('login?redirect='+toPtah)
        }
        next()
    }
    // console.log(token,name);
})
export default router
