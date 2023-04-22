// 引入一级路由组件

import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import paySuccess from '@/pages/PaySuccess'
import Center from '@/pages/Center'
// 引入二级路由组件
import MyOrder from '@/pages/Center/MyOrder'
import GroupOrder from '@/pages/Center/GroupOrder'
export default [
    {
        path: '/home',
        // 路由懒加载。实际开发全都这么写
        component: () => import('@/pages/Home'),
        // 在路由元信息上创建meta 来选择让 Footer组件显示还是不显示
        meta: { isShow: true }
    },
    {
        // 想要使用params传参 就必须要配置 name 属性
        name: 'search',
        // 有 ？ 号  表示可传也可不传 params参数
        path: '/search/:keyword?',
        component: ()=>import('@/pages/Search'),
        meta: { isShow: true }
    },
    {
        path: '/register',
        component: () => import('@/pages/Register')
    },
    {
        path: '/login',
        component: () => import('@/pages/Login')
    },
    {
        path: '/detail/:skuId',
        component: () => import('@/pages/Detail')
    },
    {
        name: 'addcartsuccess',
        path: '/addcartsuccess',
        component: () => import('@/pages/AddCartSuccess'),
        meta: { isShow: true }
    },
    {
        name: 'shopcart',
        path: '/shopcart',
        component: () => import('@/pages/ShopCart'),
        // meta:{isShow:true}
    },
    {
        name: 'trade',
        path: '/trade',
        component: () => import('@/pages/Trade'),
        // 路由独享守卫
        beforeEnter: (to, from, next) => {
            if (from.path == '/shopcart') {
                next()
            } else {
                // next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，
                // 那么 URL 地址会重置到 from 路由对应的地址。
                next(false)
            }
        }
    },
    {
        name: 'pay',
        path: '/pay',
        component: () => import('@/pages/Pay'),
        // 路由独享守卫
        beforeEnter:(to,from,next) => {
            if(from.path == '/trade'){
                next()
            }else{
                next(false)
            }
        }
    },
    {
        path: '/paysuccess',
        component: () => import('@/pages/PaySuccess'),
        meta: { isShow: true }
    },
    {
        path: '/center',
        component: () => import('@/pages/Center'),
        // 二级路由组件
        children: [
            {
                path: 'myorder',
                component: MyOrder
            },
            {
                path: 'grouporder',
                component: GroupOrder
            },
            // 二级路由重定向，在访问/center  立马让他定向到myorder
            {
                path: '/center',
                redirect: '/center/myorder'
            }

        ]


    },
    // 一级路由重定向，在项目跑起来的时候，访问/  立马让他定向到首页
    {
        path: '/',
        redirect: '/home'
    }
]