// 对应 axios 进行 二次封装
import axios from 'axios'
// 引入 nprogress 进度条
import nprogress from 'nprogress'
// start： 进度条开始   done： 进度条结束
// 引入 进度条样式
import 'nprogress/nprogress.css'


// 1.利用 axios 对象的方法create 去创建一个 axios 实例
// 2.requests 就是 axios 只不过稍微配置一下
const requests = axios.create({
    // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
    // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
    // 基础路径，当发送请求时，路径会出现api
    // mock请求的基础路径是 /mock
    baseURL:'/mock',
    // 代表请求超时时间 5s 
    timeout:5000
})

// 请求拦截器：在发请求之前，请求拦截器可以检测到，可以在请求发出去之前做一些事情
requests.interceptors.request.use((config) =>{
    nprogress.start()
    // config 配置对象 对象里面有一个属性很重要 headers 请求头
    return config
})

// 响应拦截器
requests.interceptors.response.use((resolve) => {
    // 成功的回调函数，服务器响应数据回来以后，响应拦截器可以检测到，可以做一些事情
    nprogress.done()
    return resolve.data
},(error) => {
    // 响应失败的回调函数
    return Promise.reject(new Error('failed'))
})

// 对外暴露
export default requests