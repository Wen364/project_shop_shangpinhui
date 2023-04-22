<template>
  <div class="pagination">
    <!-- 上 -->
    <button @click="$emit('getPage', pageNo - 1)" :disabled="pageNo == 1">
      上一页
    </button>
    <button v-show="startAndEndNumber.start > 1" @click="$emit('getPage', 1)" :class="{active: pageNo == 1}">
      1
    </button>
    <button v-show="startAndEndNumber.start > 2">···</button>

    <!-- 中间部分 -->
    <!-- 数字也可以遍历，但是返回的是从 1 到 目标数字，所以需要配合 v-show 来选择让哪几个显示和隐藏 -->
    <button
      v-for="(page, index) in startAndEndNumber.end"
      :key="index"
      v-show="page >= startAndEndNumber.start"
      @click="$emit('getPage',page)"
      :class="{active: pageNo == page}"
    >
      {{ page }}
    </button>

    <!-- 下 -->
    <button v-show="startAndEndNumber.end < totalPage - 1" >···</button>
    <button v-show="startAndEndNumber.end < totalPage" @click="$emit('getPage',totalPage)"
    :class="{active:pageNo == totalPage}"
    >{{ totalPage }}</button>
    <button @click="$emit('getPage',pageNo + 1)" :disabled='pageNo == totalPage'>下一页</button>

    <button style="margin-left: 30px">共 {{ total }} 条</button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: ["pageNo", "pageSize", "total", "continues"],
  computed: {
    // 算出 总页数
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    },
    startAndEndNumber() {
      let { pageNo, totalPage, continues } = this;
      let start = 0;
      let end = 0;
      // 连续页码数是5时，中间五个数的情况
      // 不正常情况 当 总页数 < 连续分的页数时
      if (totalPage < continues) {
        start = 1;
        end = totalPage;
      } else {
        // 求出最前面那个数和最后面那个数  例如 5，6，7，8，9
        start = pageNo - parseInt(continues / 2);
        end = pageNo + parseInt(continues / 2);
        // 如果当 start <= 1 时
        if (start <= 1) {
          start = 1;
          end = continues;
        }
        // 如果 end > 总页数时
        if (end > totalPage) {
          end = totalPage;
          start = totalPage - continues + 1;
        }
      }
      return { start, end };
    },
  },
};
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>
