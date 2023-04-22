<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul
          class="cart-list"
          v-for="(cart, index) in cartInfoList"
          :key="index"
        >
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked="cart.isChecked" @change="changeChecked(cart,$event)"/>
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl" />
            <div class="item-msg">{{ cart.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.cartPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a
              href="javascript:void(0)"
              class="mins"
              @click="handler('minus', -1, cart)"
              >-</a
            >
            <input
              autocomplete="off"
              type="text"
              :value="cart.skuNum"
              minnum="1"
              class="itxt"
              @change="handler('change', $event.target.value * 1, cart)"
            />
            <a
              href="javascript:void(0)"
              class="plus"
              @click="handler('add', 1, cart)"
              >+</a
            >
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuNum * cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <a href="#none" class="sindelet" @click="deleteShopCart(cart.skuId)"
              >删除</a
            >
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" :checked="isAllChecked&&cartInfoList.length>0" @change="clickAllChecked"/>
        <span >全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>{{shopCart}}</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link to="/trade" class="sum-btn"  >结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// 引入节流
import throttle from "lodash/throttle";
export default {
  name: "ShopCart",
  data() {
    return {
      cart:0
    }
  },
  methods: {
    // 获取购物车数据
    getData() {
      // 获取个人购物车的数据
      this.$store.dispatch("shopcart/getShopCartList");
    },
    // 修改某一个产品的数量【加入节流】
    handler: throttle(async function (type, disNum, cart) {
      // type 是要知道点的是哪个
      // disNum是你最终要加几（input框的） disNUm 是要带给服务器的参数 ，1 是 则加1 ，-1时则减 1， 0则不加也不减
      // cart 是为了后面传 id
      switch (type) {
        case "add":
          disNum = 1;
          break;
        case "minus":
          // 判断产品个数是否大于 1 如果大于，则给服务器传 -1 否则传 0
          disNum = cart.skuNum > 1 ? -1 : 0;
          break;
        case "change":
          // disNum = cart.skuNum - disNum
          if (isNaN(disNum) || disNum < 0) {
            // 如果非法，则不变
            disNum = 0;
          } else {
            disNum = parseInt(disNum - cart.skuNum);
          }
          break;
      }
      try {
        // 成功的话等待数据返回完成，然后再次请求数据
        await this.$store.dispatch("detail/addOrUpdateShopCart", {
          skuId: cart.skuId,
          skuNum: disNum,
        });
        this.getData();
      } catch (error) {}
    }, 5000),
    // 删除该商品
    async deleteShopCart(skuId) {
      try {
        // 如果删除成功，则再次发起请求获取数据
        await this.$store.dispatch("shopcart/deleteShopCartById", skuId);
        this.getData();
      } catch (error) {
        alert("error");
      }
    },
    // 修改某一个产品的勾选状态
    async changeChecked(cart,e) {
      // 如果成功则等待请求完成 然后再次请求数据
      // 记住 isCheck给的值只有0和1， 0的话就是没被选中，1的话就是被选中了
      try {
        let skuId = cart.skuId
        let isChecked = cart.isChecked
        isChecked = e.target.checked == true ? 1 : 0
        await this.$store.dispatch('shopcart/getIsChecked',{skuID:skuId,isChecked:isChecked})
        // 再次获取数据展示
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    },
    // 删除所有已经选中的商品
    async deleteAllCheckedCart() {
      try {
        // 这里的意思是:先等待数据返回是否成功,成功执行try里的请求数据方法,失败则catch
        // 成功的话,则再次请求数据
        await this.$store.dispatch('shopcart/deleteAllCheckedCart')
        this.getData()  
      } catch (error) {
        alert(error.message)
      }
      

    },
    // 点击全选,就全部选中商品
    async clickAllChecked(e){
      try {
        // 需要带一个全选按钮的参数
        await this.$store.dispatch('shopcart/clickAllChecked',e.target.checked)
        // 成功了就再次请求数据
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    }
  },
  mounted() {
    // 向服务器发送请求
    this.getData();
  },
  computed: {
    ...mapGetters("shopcart", ["cartList"]),
    cartInfoList() {
      return this.cartList.cartInfoList || [];
    },
    // 计算购买商品总价
    totalPrice() {
      let sum = 0;
      this.cartInfoList.forEach((item) => {
        sum += item.skuNum * item.skuPrice;
      });
      return sum;
    },
    // 判断底部复选框是否勾选【全部产品都选中的话，则选中】
    isAllChecked() {
      /*
        // let sum = 0
        // this.cartInfoList.forEach(item => {
        //   if(item.isChecked == 1) {
        //     sum++
        //   }else{
        //     return false
        //   }
        // })
        // if(this.cartInfoList.length == sum){
        //   return true
        // }else{
        //   return false
        // }
        // 和上面效果一样，一看就知道 every简单
        */
      // 遍历数组元素，只有全部元素都符合这个条件才返回true 否则返回 false
      return this.cartInfoList.every((item) => item.isChecked == 1);
    },
    // 选中几个商品
    shopCart(){
      let sum = 0
      this.cartInfoList.forEach((item) => {
        if(item.isChecked == 1) {
          sum++
        }
      })
      return sum  
    }
  },
};
</script>

      
<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>