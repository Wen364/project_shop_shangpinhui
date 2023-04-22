// 引入 mockjs模块
import Mock from 'mockjs'
// 把json数据格式引入进来【json数据格式无需对外暴露，也可以引入】
// webpack默认对外暴露的：图片、json数据格式
import banner from './banner.json'
import floor from './floor.json'
import address from './address.json'

// mock数据
// 模拟首页轮播图数据 banner
Mock.mock('/mock/banner',{code:200,data:banner})
// 模拟首页floor数据 floor
Mock.mock('/mock/floor',{code:200,data:floor})
// 模拟trade组件的 地址信息,
Mock.mock('/mock/address',{code:200,data:address})
