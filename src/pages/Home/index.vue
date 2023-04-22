<template>
  <div>
      <!-- 因为是全局组件，所以不需要引用，注册了 -->
    <TypeNav/>
    <!-- 列表 三级联动 -->
    <ListContainer/>
    <!-- 今日推荐 -->
    <TodayRecommend/>
    <!-- 商品排行 -->
    <Rank />
    <!-- 猜你喜欢 -->
    <Like />
    <!--楼层-->
    <Floor v-for="floor in floorList" :key="floor.id" :list="floor"/>
    <!--商标-->
    <Brand />
  </div>
</template>

<script>
import ListContainer from './ListContainer/ListContainer.vue'
import Floor from './Floor/Floor.vue'
import Brand from './Brand/Brand.vue'
import Like from './Like/Like.vue'
import Rank from './Rank/Rank.vue'
import TodayRecommend from './TodayRecommend/TodayRecommend.vue'
import {mapState} from 'vuex'
export default {
  name:'Home',
  components:{
    ListContainer,
    Floor,
    Brand,
    Like,
    Rank,
    TodayRecommend
  },
  computed: {
    ...mapState('home',['floorList'])
  },
  mounted() {
    // 向vuex仓库发起请求
    this.$store.dispatch('home/getFloorList')
    // 向vuex仓库发请求来获取 token
    // this.$store.dispatch('user/getUserInfo')
  },
}
</script>

<style>

</style>