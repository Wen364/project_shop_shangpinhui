<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread  面包屑 带有 x 的结构的-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-if="searchParams.categoryName">
              {{searchParams.categoryName}}
              <i @click="removeCategoryName">×</i>
            </li>
            <!-- keyword的面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">
              {{searchParams.keyword}}
              <i @click="removeKeyword">×</i>
              </li>
              <!-- 品牌（tardeMark）的面包屑 -->
              <li class="with-x" v-if="searchParams.trademark">
              {{searchParams.trademark.split(':')[1]}}
              <i @click="removeTradeMark">×</i>
              </li>
              <!-- 平台的售卖的属性值展示 -->
              <li class="with-x" v-for="(attrValue,index) in searchParams.props" :key="index">
              {{attrValue.split(':')[1]}}
              <i @click="removeAttr(index)">×</i>
              </li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @getTradeMarkInfo='getTradeMarkInfo' @getAttrProp='attrProp'/>

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li class="active">
                  <a href="#">综合</a>
                </li>
                <li>
                  <a href="#">销量</a>
                </li>
                <li>
                  <a href="#">新品</a>
                </li>
                <li>
                  <a href="#">评价</a>
                </li>
                <li :class="{active: !isDesc}" @click="changeOrder('asc')">
                  <a href="#" >价格⬆</a>
                </li>
                <li :class="{active: isDesc}" @click="changeOrder('desc')">
                  <a href="#" >价格⬇</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="goods in goodsList" :key="goods.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 路由跳转 -->
                    <router-link :to="`/detail/${goods.id}`" 
                      ><img v-lazy="goods.defaultImg"/>
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em style="margin-right:5px;">¥</em>
                      <i>{{ goods.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      >{{ goods.title }}</a
                    >
                  </div>
                  <div class="commit">
                    <i class="command"
                      >已有<span>{{ goods.hotScore }}</span
                      >人评价</i
                    >
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器组件 -->
          <Pagination :pageNo='searchParams.pageNo' :pageSize='searchParams.pageSize' :total='searchList.total' :continues='5'
          @getPage="getPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import SearchSelector from "./SearchSelector/SearchSelector.vue";
export default {
  name: "Search",
  data() {
    return {
      searchParams: {
        // 一级分类的 ID
        category1Id: "",
         // 二级分类的 ID
        category2Id: "",
         // 三级分类的 ID
        category3Id: "",
        // 分类名字
        categoryName: "",
        // 关键字
        keyword: "",
        // 排序
        order: "2:desc",
        // 分页器用的，代表的是当前是第几页
        pageNo: 1,
        // 代表的是每一页展示的数据个数
        pageSize: 3,
        // 平台售卖属性操作带的参数
        props: [],
        // 品牌
        trademark: "",
      },
    };
  },
  components: {
    SearchSelector,
  },
  methods: {
    // 向服务器发请求获取Search模块数据（根据参数不同返回不同的数据进行展示）
    // 把这个请求封装为一个函数，当需要的时候就调用一次
    // 定义一个函数 来派发actions 到vuex里面，然后请求数据
    getData() {
      this.$store.dispatch("search/getSearchList",this.searchParams);
    },
    // 删除分类
    removeCategoryName() {
      // 如果把相应的字段给变成 undefined了 请求数据时，这几个字段就不会带给服务器了
      this.searchParams.categoryName = undefined
      this.searchParams.category1Id = undefined
      this.searchParams.category2Id = undefined
      this.searchParams.category3Id = undefined
      this.getData()
      // 地址栏也需要改变：进行路由跳转（现在的路由跳转只是跳转到自己这里
      // 如果有 params 参数（keyword） 则把params参数带过去，没有的话直接再次跳转到search下
      // 因为 params 是空的对象 if判断时 空对象也为真，所以就走里面了
      if(this.$route.params) {
        this.$router.push({'name':'search',params:this.$route.params})
      }
      // this.$router.push({name:'search'})
    },
    // 删除关键字
    removeKeyword() {
      this.searchParams.keyword = undefined
      this.getData()
      // 通知兄弟组件Header组件清除关键字
      this.$bus.$emit('clear')
      // 如果有query参数，则路由跳转的时候带上query参数
      if(this.$route.query) {
        this.$router.push({name:'search',query:this.$route.query})
      }
    },
    // 自定义回调
    getTradeMarkInfo(trademark){
      // 整理参数
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
      // 再次向服务器发起请求获取数据
      this.getData()
    },
    // 删除品牌信息
    removeTradeMark() {
      // 把searchParams里的tardeMark数据 设置为undefined
      this.searchParams.trademark = undefined
      // 然后再次请求数据
      this.getData()
    },
    // 平台的售卖的属性值展示
    // 自定义事件getAttrProp的回调函数 attrProp，用来获取从子组件传来的数据
    attrProp(attr,attrList) {
      // 整理参数
      let props = `${attr.attrId}:${attrList}:${attr.attrName}`
      // 数组去重 防止多次重复点击相同对象
      if(this.searchParams.props.indexOf(props) == -1){
        // 把数据传到searchParams的props里面
        this.searchParams.props.push(props)
      }
      // 再次发起请求获取数据
      this.getData()
    },
    // 删除售卖的属性
    removeAttr(index){
      // 使用splice截取掉当前索引值的数据
      this.searchParams.props.splice(index,1)
      // 再次发送请求
      this.getData()
    },
    // 改变升降序
    changeOrder(flag){
      // 直接改变searchParams里的order就好了，因为是把价格升序和降序分开了，所以简单点
        this.searchParams.order = `2:${flag}`
        // 再次请求数据
        this.getData()
    },
    //自定义事件回调函数 ，获取当前页数 
    getPage(pageNo) {
      // 重新整理参数
      this.searchParams.pageNo = pageNo
      // 再次发起请求获取数据
      this.getData()
    },
  },
  computed: {
    ...mapGetters("search", ["goodsList"]),
    ...mapState('search',['searchList']),
    isDesc() {
      // 返回的true
      return this.searchParams.order.indexOf('desc') != -1
    },
  },
  watch: {
    // 监听路由信息是否发生改变 如果发生改变，则再次发请求
      $route(newValue,oldValue) {
        // 在发请求之前再次整合一下 searchParams参数的数据
        Object.assign(this.searchParams,this.$route.query,this.$route.params)
        // 再次发起请求
        this.getData()
        // 每一次请求完毕，应该把对应的1、2、3级分类的id给清空，防止下一次点击别的id，导致会出现两个id
        // 分类名字和关键字不需要清理，因为每一次路由发生改变时候，都会用新输入的内容给他替换掉
        this.searchParams.category1Id = ''
        this.searchParams.category2Id = ''
        this.searchParams.category3Id = ''
      }
  },
  // 当组件挂载完毕之前 执行一次
  beforeMount() {
    // ES6 新出的方法 ，合并对象 第一个参数是要往这个对象上合并，后面几个是要合并的对象
    // 意思就是 query参数和 params参数 往searchParams 对象上合并
    Object.assign(this.searchParams,this.$route.query,this.$route.params)
    // console.log(this.searchParams,'before');
  },
  // 组件挂载完毕执行一次【只执行一次】
  mounted() {
    this.getData()
    // console.log(this.$route.query,this.$route.params);
    // console.log(this.searchParams,'mounted');
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>