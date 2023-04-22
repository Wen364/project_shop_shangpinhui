<template>
  <div >
    <Header></Header>
    <router-view></router-view>
    <!-- 通过 v-show 和 route上的meta属性来判断是否显示 -->
    <Footer v-show="$route.meta.isShow"></Footer>
  </div>
</template>

<script>
import Header from './components/Header/index.vue'
import Footer from './components/Footer/index.vue'
export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  mounted() {
    // 通知Vuex发请求，获取数据，存储在仓库里
    // this.$store.dispatch('空间名/actions里面的方法名')
    this.$store.dispatch("home/getCategoryList");
  },

}
</script>

<style>

</style>
