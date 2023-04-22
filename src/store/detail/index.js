import {reqGetDetailInfo,reqAddOrUpdateShopCart} from '@/api'
// 封装游客身份模块 uuid --> 生成一个随机的字符串
import {getUUID} from '@/utils/uuid_token'
export default {
    namespaced:true,
    state:{
        detailInfo:{},
        // 游客临时身份
        uuid_token:getUUID()
    },
    actions:{
        // 获取详情列表 actions
        async getDetailInfo(context,skuId) {
            let result = await reqGetDetailInfo(skuId)
            if(result.code == 200) {
                context.commit('GetDetailInfo',result.data)
                // console.log(result.data);
            }
        },
        // 将产品加入到购物车里 actions 
        // 加入购物车后，这里只是前台将参数带给服务器
        // 服务器没有返回数据给我们，所以不需要 在vuex仓库里存储数据
        // 我们只需要 code = 200 ，代表这次操作成功
        async addOrUpdateShopCart(context,{skuId,skuNum}){
            let result = await reqAddOrUpdateShopCart(skuId,skuNum)
            // 这个函数执行最终返回 Promise 对象
            if(result.code == 200) {
                // context.commit('AddShopCart',result.data)
                return 'ok'
            }else{
                return Promise.reject(new Error('fail'))
            }
        }
    },
    mutations:{
        // 获取详情列表 mutations
        GetDetailInfo(state,data) {
            state.detailInfo = data
        },
        
    },
    getters:{
        categoryView(state) {
            // 如果 state.detailInfo.categoryView 初始状态为空对象，空对象的categoryView属性值为undefined
            // 所以都在后面  并上一个 空对象
            return state.detailInfo.categoryView || {}
        },
        skuInfo(state) {
            return state.detailInfo.skuInfo || {}
        },
        spuSaleAttrList(state) {
            return state.detailInfo.spuSaleAttrList || []
        }
    }
}