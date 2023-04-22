import { reqShopCartList ,ReqDeleteShopCartById,reqGetIsChecked} from "@/api"
export default {
    // 开启命名空间
    namespaced:true,
    state:{
        shopCartList:{},
    },
    actions:{
        // 获取购物车数据
        async getShopCartList(context,value){
            let result = await reqShopCartList()
            if(result.code == 200) {
                context.commit('GetShopCartList',result.data)
                // console.log(result);
            } 
        },
        // 删除购物车商品 通过 id
        async deleteShopCartById(context,skuId){
            let result = await ReqDeleteShopCartById(skuId)
            if(result.code == 200){
                return 'ok'
            }else{
                return Promise.reject(new Error('fail'))
            }
        },
        // 切换商品选中状态
        async getIsChecked(context,{skuID,isChecked}) {
            let result = await reqGetIsChecked(skuID,isChecked)
            if(result.code == 200) {
                return 'ok'
            }else{
                return Promise.reject(new Error('failed'))
            }
        },
        // 删除勾选的商品   
        deleteAllCheckedCart(context){
            // console.log(context);
            let PromiseAll = []
            // 通过找到context里面的getters方法和dispatch方法,然后遍历cartInfoList,判断选中的,然后再调用上面删除购物车方法来实现
            context.getters.cartList.cartInfoList.forEach(item => {
                if(item.isChecked == 1) {
                    let promise = context.dispatch('deleteShopCartById',item.skuId)
                    PromiseAll.push(promise)
                }
            })
            // Promise.all 方法里面的参数是数组形式,所以把这几个Promise对象都放到一个数组里,
            // 该方法执行是: 如果数组里面的Promise都是成功,则返回成功数据,如果有一个失败,则返回失败数据
            return Promise.all(PromiseAll)
        },
        // 修改全部产品状态
        // 点击全选,则选中全部商品
        clickAllChecked(context,value) {
            // 和上面的删除勾选商品一样
            let promiseAll = []
            context.getters.cartList.cartInfoList.forEach(item => {
                // 当全选被选中时,则商品全部被选中,否则全部不被选中
                if(value == false) {
                    let promise = context.dispatch('getIsChecked',{skuID:item.skuId,isChecked:0})
                    promiseAll.push(promise)
                }else{
                    if(item.isChecked == 0) {
                        let promise = context.dispatch('getIsChecked',{skuID:item.skuId,isChecked:1})
                        promiseAll.push(promise)
                    }
                }   
            })
            return Promise.all(promiseAll)
        } 
    },
    mutations:{
        GetShopCartList(state,data){
            state.shopCartList = data
        }
    },
    getters:{
        cartList(state){
            return state.shopCartList[0] || []
        },
        // cartInfoList(state){
        //     return state.shopCartList[0].cartInfoList || []
        // }
    }
}