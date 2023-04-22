<template>
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <!-- 没有userInfo下的userName时，就是没有用户名时，也就是没登陆时 -->
          <p v-if='!userName'>
            <span>请</span>
            <!-- 声明式导航，必须要有 to 属性 -->
            <router-link to="/login">登录</router-link>
            <router-link to="/register" class="register">免费注册</router-link>
          </p>
          <!-- 登陆后 -->
          <p v-else>
              <a >{{userName}}</a>
              <a class="register" style="cursor:pointer" @click="outLogin">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center/myorder">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>
          <router-link to="/">我的尚品汇</router-link>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" title="尚品汇" to="/home" target="_blank">
          <img src="./images/logo.png" alt="" />
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input
            type="text"
            v-model="searchInput"
            id="autocomplete"
            class="input-error input-xxlarge"
          />
          <button class="sui-btn btn-xlarge btn-danger" type="button" @click="goSearch">
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
export default {
    name:'Header',
    data() {
      return {
        searchInput:''
      }
    },
    methods: {
      // 点击按钮，直接跳转到 search 页面
      goSearch() {
        // 要弄清楚 router路由器 和 route 路由的区别 路由器里面存放着总的 query和params 
        // 因为Search组件需要 Header的参数和 TypeNav的参数，所以需要把这两个的参数合并起来
        // if(this.$route.path === '/home') {
        //     if(this.searchInput.trim().length === 0) {
        //     return alert('请输入要搜索的内容')
        //   }
        // }
        let location = {name:'search',params:{keyword:this.searchInput}}
        // 判断 当前 路由下是否有query参数，如果有，则加入location里面
        if(this.$route.query) {
          location.query = this.$route.query
        }
        this.$router.push(location)

        // this.$router.push({name:'search',params:{keyword:this.searchInput}})  

        // 面试题1：路由传递参数（对象写法）path是否可以结合params一起使用？
        // 答：路由跳转传参的时候，对象的写法可以是name，params的形式，但是要注意的是，path这种写法不能与params一起使用
        // this.$router.push({name:'search',params:{keyword:this.searchInput},query:{k:this.searchInput.toUpperCase()}})

        // 2.如何指定params参数可传可不传？
        // 如果路由要求传递params参数，但是你就不传递 params参数，  URL会有问题
        // 如何指定params参数可以传递，或者可以不传递，就是在配置路由的时候，在占位的后面加上一个问号就可以可传可不传params参数

        // 面试题3：params参数可以传递参数也可以不传递，但是如果传递的是空字符串，应该怎么解决？
        // 使用undefined来解决：params参数可以传递、不传递（空的字符串）
        // this.$router.push({name:'search',params:{keyword:'' || undefined},query:{k:this.searchInput.toUpperCase()}})

      },
      clear() {
        this.searchInput = ''
      },
      // 退出登录
      async outLogin(){
        try {
          // 如果成功，则跳转回到首页
          await this.$store.dispatch('user/userOutLogin')
          // 回到首页
          this.$router.push('/home')
        } catch (error) {
          alert(error.message)
        }
      }
    },
    computed: {
      userName(){
        return this.$store.state.user.userInfo.loginName
      }
    },
    mounted() {
      // 通过全局事件总线清除关键字 通过回调函数 clear 清除关键字
      this.$bus.$on('clear',this.clear)
      
    },
};
</script>

<style lang="less" scoped> 
.header {
        &>.top {
            background-color: #eaeaea;
            height: 30px;
            line-height: 30px;

            .container {
                width: 1200px;
                margin: 0 auto;
                overflow: hidden;

                .loginList {
                    float: left;

                    p {
                        float: left;
                        margin-right: 10px;

                        .register {
                            border-left: 1px solid #b3aeae;
                            padding: 0 5px;
                            margin-left: 5px;
                        }
                    }
                }

                .typeList {
                    float: right;

                    a {
                        padding: 0 10px;

                        &+a {
                            border-left: 1px solid #b3aeae;
                        }
                    }

                }

            }
        }

        &>.bottom {
            width: 1200px;
            margin: 0 auto;
            overflow: hidden;

            .logoArea {
                float: left;

                .logo {
                    img {
                        width: 175px;
                        margin: 25px 45px;
                    }
                }
            }

            .searchArea {
                float: right;
                margin-top: 35px;

                .searchForm {
                    overflow: hidden;

                    input {
                        box-sizing: border-box;
                        width: 490px;
                        height: 32px;
                        padding: 0px 4px;
                        border: 2px solid #ea4a36;
                        float: left;

                        &:focus {
                            outline: none;
                        }
                    }

                    button {
                        height: 32px;
                        width: 68px;
                        background-color: #ea4a36;
                        border: none;
                        color: #fff;
                        float: left;
                        cursor: pointer;

                        &:focus {
                            outline: none;
                        }
                    }
                }
            }
        }
    }
</style>