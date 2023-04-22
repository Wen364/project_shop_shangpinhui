// 导入 API统一 发送请求方法
import {reqGetCategoryList,reqGetBannerList,reqGetFloorList} from '@/api/index'
// home 模块小仓库

export default {
    namespaced: true,
    state:{
        // state中的数据默认初始值别乱写，服务器返回的是对象就是对象，数组就取数组
        categoryList:[],
        bannerList:[],
        floorList:[]
    },
    actions:{
        // 获取三级联动数据
        async getCategoryList(context,value) {
            let result = await reqGetCategoryList()
           //  console.log(result);
           if(result.code ===200){
               context.commit('GetCategoryList',result.data)
               // console.log(result.data);
           }
       },
       // 获取轮播图banner数据
        async getBannerList(context,value) {
        let result = await reqGetBannerList()
        // console.log(result);
        context.commit('GetBannerList',result.data)
       },
       // 获取floor数据
        async  getFloorList(context,value) {
        let result = await reqGetFloorList()
        context.commit('GetFloorList',result.data)
       }
    },
    mutations:{
        GetCategoryList(state,data) {
            // console.log('mu',data);
            state.categoryList = data
        },
        GetBannerList(state,data) {
            state.bannerList = data
        },
        GetFloorList(state,data) {
            state.floorList = data
        }
    },
    getters:{}
}