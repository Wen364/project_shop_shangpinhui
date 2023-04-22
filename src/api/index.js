// 当前这个模块 对 API 进行 统一管理
import requests from './request'
import MockRequests from './MockAjax'
// 三级联动接口
// /api/product/getBaseCategoryList  get 无参数
// 发送请求： axios发请求返回结果 Promise对象
export const reqGetCategoryList = () =>{
    return requests({url:'/product/getBaseCategoryList',method:'get'})
}
// 获取banner的mock数据
export const reqGetBannerList = () => {
    return MockRequests({url:'/banner',method:'get'})
}
// 获取floor的mock数据
export const reqGetFloorList = () => {
    return MockRequests({url:'/floor',method:'get'})
}
// 获取address的mock数据
export const reqGetMockAddress =() => {
    return MockRequests({url:'/address',method:'get'})
}

//获取搜索模块数据： 地址 /api/list  请求方式：post  参数：需要带参数

export const reqGetSearchInfo = (params) => {
    return requests.post('/list',params)
}

// 获取产品详情信息的接口 /api/item/{ skuId }  get
export const reqGetDetailInfo = (skuId) => {
    return requests.get(`./item/ ${skuId} `)
}

// 添加到购物车   /api/cart/addToCart/{ skuId }/{ skuNum }   post请求
export const reqAddOrUpdateShopCart = (skuId,skuNum) => {
    return requests.post(`/cart/addToCart/${ skuId }/${ skuNum }`)
}

// 获取购物车列表      /api/cart/cartList   get请求
export const reqShopCartList = () =>{
    return requests.get('/cart/cartList') 
}

// 删除购物车商品  /api/cart/deleteCart/{skuId}  delete请求
export const ReqDeleteShopCartById = (skuId) =>  {
    return requests.delete(`/cart/deleteCart/${skuId}`)
} 

// 切换商品选中状态 /api/cart/checkCart/{skuID}/{isChecked}  get请求
export const reqGetIsChecked = (skuID,isChecked) => {
    return requests.get(`/cart/checkCart/${skuID}/${isChecked}`)
}

// 获取注册验证码  /api/user/passport/sendCode/{phone}  get请求
export const reqGetRegisterCode = (phone) => {
    return requests.get(`/user/passport/sendCode/${phone}`)
}

// 用户注册  /api/user/passport/register   post请求   phone password code
export const reqUserRegister = (data) => {
    return requests.post('/user/passport/register',data)
}

// 登录 /api/user/passport/login   post请求  phone password
export const reqUserLogin = (data) => {
    return requests.post('/user/passport/login',data)
}

// 获取用户信息【需要带着用户的token向服务器要用户信息】  /api/user/passport/auth/getUserInfo  get请求
export const reqUserInfo = () => {
    return requests.get('/user/passport/auth/getUserInfo') 
}

// 退出登录 /api/user/passport/logout  get请求  无参数
export const reqOutLogin = () =>{
    return requests.get('/user/passport/logout')
}

//获取用户地址信息  /api/user/userAddress/auth/findUserAddressList   get请求 无参数
export const reqUserAddress = () => {
    return requests.get('/user/userAddress/auth/findUserAddressList')
}

// 获取交易订单  /api/order/auth/trade  get请求 无参数
export const reqTradeOrder = () =>{
    return requests.get('/order/auth/trade')
}

// 提交订单  /api/order/auth/submitOrder?tradeNo={tradeNo}    post请求
export const reqSubmitOrder = (tradeNo,data) => {
    return requests.post(`/order/auth/submitOrder?tradeNo=${tradeNo}`,data)      
}

// 获取订单支付信息 /api/payment/weixin/createNative/{orderId} get请求
export const reqPaymentMessage = (orderId) => {
    return requests.get(`/payment/weixin/createNative/${orderId}`)
}

// 获取订单支付状态  /api/payment/weixin/queryPayStatus/{orderId}   get请求
export const reqOrderStatus = (orderId) => {
    return requests.get(`/payment/weixin/queryPayStatus/${orderId}`)
}

// 获取我的订单列表  /api/order/auth/{page}/{limit}   get请求
export const reqMyOrderList = (page,limit) => {
    return requests.get(`/order/auth/${page}/${limit}`)
}