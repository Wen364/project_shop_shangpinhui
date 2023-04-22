// 登录与注册仓库
import {reqGetRegisterCode,reqUserRegister,reqUserLogin,reqUserInfo,reqOutLogin} from '@/api'

export default{
    namespaced:true,
    state:{
        // 验证码
        registerCode:'',
        // 这个token刚开始是个null然后第一次是派发到仓库，然后给他赋值，第二次就开始去本地存储找token了
        token: localStorage.getItem('TOKEN'),
        userInfo:{}
    },
    actions:{
        // 获取验证码
        async getRegisterCode(context,phone){
            let result = await reqGetRegisterCode(phone)
            if(result.code == 200){
                console.log(result.data);
                context.commit('GetRegisterCode',result.data)
                return 'ok'
            } else{
                return Promise.reject(new Error('fail'))
            }
        },
        // 用户注册
        async userRegister(context,user){
            let result = await reqUserRegister(user)
            // console.log(result);
            if(result.code == 200){
                return 'ok'
            }else{
                return Promise.reject(new Error('failed'))
            }
        },
        // 用户登录【token】
        async userLogin(context,user){
            let result = await reqUserLogin(user)
            // console.log(result);
            if(result.code == 200){
                // 把token带过去
                context.commit('UserLogin',result.data.token)
                // token持久化
                localStorage.setItem('TOKEN',result.data.token)
                return 'ok'
            }else{
                return Promise.reject(new Error('failed'))
            }
        },
        // 获取用户信息
        async getUserInfo(context){
            let result = await reqUserInfo()
            // console.log(result);
            if(result.code == 200){
                context.commit('GetUserInfo',result.data)
                return 'ok'
            }else{
                Promise.reject(new Error('failed'))
            }
        },
        // 退出登录
        async userOutLogin(context){
            let result = await reqOutLogin()
            // console.log(result);
            if(result.code == 200){
                // 向服务器发请求，清除token
                context.commit('CLEAR')
                return 'ok'
            }else{
                return Promise.reject(new Error('failed'))
            }
        }
    },
    mutations:{
        // 获取验证码
        GetRegisterCode(state,data){
            state.registerCode = data
        },
        // 把token方法vuex仓库的state里面
        UserLogin(state,token){
            state.token = token
        },
        // 获取用户信息
        GetUserInfo(state,data){
            state.userInfo = data
        },
        //清除token
        CLEAR(state){
            state.token = ''
            state.userInfo = ''
            // 再把本地存储的token清空
            localStorage.removeItem('TOKEN')
        } 
    },
    getters:{}
}