<template>
  <div class="type-nav">
    <div class="container">
      <!-- 使用事件委派，把他俩放在一个 div盒子里 这样当鼠标在全部商品分类时，也会显示+ -->
      <div @mouseleave="leaveShow" @mouseenter="enterShow">
        <h2 class="all">全部商品分类</h2>
        <!-- 过渡动画 -->
        <transition name="sort">
          <div class="sort" v-show="isShow">
            <!-- 利用 事件委派 + 编程式导航 来进行跳转Search组件 -->
            <!-- 事件委派就是利用事件冒泡，当里面的被点击了，就会向上冒泡，这样父元素就能触发 -->
            <div class="all-sort-list2" @click="goSearch">
              <!-- 一级分类 -->
              <div class="item" v-for="c1 in categoryList" :key="c1.categoryId">
                <!-- 加入鼠标移入 添加背景颜色的功能  -->
                <!-- 当 currentIndex的值 与 c1.categoryId 相等时，则加入 cur这个类名-->
                <h3
                  @mouseenter="changeIndex(c1.categoryId)"
                  :class="{ cur: currentIndex == c1.categoryId }"
                >
                  <!-- 定义vue的自定义属性 来获取当前的名字和Id -->
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                </h3>
                <!-- 通过 vue 动态添加样式来完成 二三级分类的显示与隐藏 -->
                <div
                  class="item-list clearfix"
                  :style="{
                    display: currentIndex === c1.categoryId ? 'block' : 'none',
                  }"
                >
                  <!-- 二级分类 -->
                  <div
                    class="subitem"
                    v-for="c2 in c1.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <dd>
                        <!-- 三级分类 -->
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a
                            :data-categoryName="c1.categoryName"
                            :data-category3Id="c3.categoryId"
                          >
                            {{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
// 引入方式是把lodash全部函数功能引入
import throttle from "lodash/throttle";
import { mapState } from "vuex";
export default {
  name: "TypeNav",
  data() {
    return {
      currentIndex: 0,
      isShow: true,
    };
  },
  // 当组件挂载完毕，可以向服务器发请求
  methods: {
    // 当鼠标移入时，利用lodash里面的 节流函数（throttle）来写，这样可以防止连续触碰触发多次，
    changeIndex: throttle(function (index) {
      // 获取当前 index值 index：鼠标移上某一个一级分类的元素的索引值
      this.currentIndex = index;
      // 正常情况（用户缓慢的操作）：鼠标进入，每一个一级分类h3，都会触发鼠标进入事件
      // 非正常情况（用户快速的操作）：本身全部的一级分类都应该触发鼠标进入事件，但是经过测试，只有部分h3触发了
      // 这是由于用户行为过快 ，导致浏览器反应不过来，如果当前回调函数中有一些大量业务，又可能出现卡顿现象
    }, 50),

    goSearch(event) {
      // 最好的解决方案：编程式导航 + 事件委派
      // 利用事件委派存在一些问题：1.不能确定到底是不是a标签被点击了，2.如何获取参数【1.2.3级分类产品的Id和名字】
      // 先观察一下 事件触发对象是啥
      let element = event.target;
      // console.log(element);
      // 因为 vue 的自定义属性里面有 dataset方法，可以得到一个对象，打印看看，然后需要的就结构解赋出来
      // 通过结构解赋来获取 对象的数据
      let { categoryname, category1id, category2id, category3id } = element.dataset;
      // console.log(element.dataset);
      // 进行if判断，如果 自定义属性categoryname属性被点击了，就会存在，然后就继续走，因为最后需要路由跳转，所以需要一个对象来把数据存起来location
      // 判断点击的是否是  a标签
      if (categoryname) {
        let location = { name: "search" };
        // query左边的是自己定义的，右边的是结构解赋出来的
        let query = { categoryName: categoryname };
        // 如果 点击的是 一级分类的a标签，则把它的id存入进去
        if (category1id) {
          query.category1Id = category1id;
          // 如果 点击的是 二级分类a标签，则把它的id存入进去
        } else if (category2id) {
          query.category2Id = category2id;
          // 如果 点击的是 三级分类a标签，则把它的id存入进去
        } else if (category3id) {
          query.category3Id = category3id;
        }
        // if判断当前路由route 是否有 params参数，如果有，就一起带过去
        if(this.$route.params) {
          location.params = this.$route.params
        }
        // 合并 location 对象
        location.query = query
        this.$router.push(location)
      }
    },

    // 当鼠标离开时，如果不是 Home组件，则TypeNav 隐藏
    leaveShow() {
      this.currentIndex = 0;
      if (this.$route.path != "/home") {
        this.isShow = false;
      }
    },

    // 当鼠标进入时，则显示
    enterShow() {
      this.isShow = true;
    },
  },

  mounted() {
    // 根据性能来看，每次从Home组件到Search组件都会请求数据，所以把它放到App组件里，这样只执行一次，并且state仓库里还有数据
    // 这样会提高性能
    // 通知Vuex发请求，获取数据，存储在仓库里
    // this.$store.dispatch('空间名/actions里面的方法名')
    // this.$store.dispatch("home/categoryList");
    // 判断，如果当前是 Home组件，则让TypeNav组件显示，如果不是则隐藏
    if (this.$route.path != "/home") {
      this.isShow = false;
    }
  },

  computed: {
    // 借助 mapState 获取 home 里面的 categoryList数据
    ...mapState("home", ["categoryList"]),
  },

};
</script>

<style scoped lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

     

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            _height: 200px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }
          // 通过 css 样式来 让二三级分类显示与隐藏
          // &:hover {
          //   .item-list {
          //     display: block;
          //   }
          // }
        }
        // 控制触碰鼠标模式
        .item a:hover {
          cursor: pointer;
        }
        .cur {
          background-color: skyblue;
        }
      }
    }
     // sort过渡动画样式
      // 过渡动画进入状态（进入）
      .sort-enter , .sort-leave-to{
        height: 0;
        // transform: rotate(0);
      }
      // 过渡动画结束状态（进入）
      .sort-enter-to , .sort-leave{
        height: 461px;
        // transform: rotate(360deg);
      }
      // 定义动画事件、速率
      .sort-enter-active ,.sort-leave-active{
        transition: all .3s linear;
      }
  }
}
</style>