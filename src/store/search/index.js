// search模块的小仓库
import {reqGetSearchInfo} from '@/api/index'
export default {
    // 开启命名空间
    namespaced: true,
    state:{
       searchList:{}
    },
    actions:{
        // 获取Search模块数据
        // value={} 意思是，当没传value参数时，默认是一个空对象
        async getSearchList(context,value={}) {
            // 当前这个reqGetSearchInfo 这个函数在调用获取服务器数据时，至少传递一个参数（空对象）
            // value 形参 是当用户派发 actions时，传递过来的，至少是一个空对象
            let result = await reqGetSearchInfo(value)
            // console.log(result);
            if(result.code === 200){
                context.commit('GetSearchList',result.data)
            }
           
        }
    },
    mutations:{
        GetSearchList(state,data){
            state.searchList = data
        }
    },
    // getters 是为了简化数据而生， 带的参数是当前仓库的 state 数据  
    getters:{
        // 如果没有网络的情况下，则返回一个空数组
        goodsList(state) {
            return state.searchList.goodsList || []
        },
        trademarkList(state) {
            return state.searchList.trademarkList || []
        },
        attrsList(state) {
            return state.searchList.attrsList || []
        }
    }
}