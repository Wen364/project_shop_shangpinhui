import {reqTradeOrder,reqUserAddress,reqGetMockAddress} from '@/api'
export default {
    namespaced:true,
    state:{
        orderList:{},
        address:[] 
    },
    actions:{
        // 获取用户地址信息
        // 必须使用 13700000000   111111   这个账号登录才有这个用户信息 
        // async getUserAddress(context) {
        //     let result = await reqUserAddress()
        //     console.log(result);
        //     if(result.code == 200){
        //         context.commit('GetUserAddress',result.data)
        //     }else{
        //         alert('trade/actions/getUserAddress')
        //     }
        // },
        // 使用mock的address信息
        // 使用mock的address有一些瑕疵，比如说订单那里不能和选择的地址交互，只能提交默认的那个人
        // 但是可以让各种人来进行购买，不必要是13700000000 那个号了
        async getUserAddress(context) {
            let result = await reqGetMockAddress()
            // console.log(result);
            if(result.code == 200){
                context.commit('GetUserAddress',result.data)
            }else{
                alert('trade/actions/getUserAddress')
            }
        },
        // 获取交易订单信息
        async getTradeOrder(context) {
            let result = await reqTradeOrder()
            // console.log(result);
            if(result.code == 200) {
                context.commit('GetTradeOrder',result.data)
            }else{
                alert('trade/actions/getTradeOrder')
            }
        }
    },
    mutations:{
        GetTradeOrder(state,data){
            state.orderList = data
        },
        GetUserAddress(state,data){
            state.address = data
        }
    },
    getters:{}
}