<template>
  <div class="el-pagination1">
    <ul class="el-pager1" :style="{width: width + 'px' }" @click="onPagerClick">
    <li class="prev" :class="{ disabled: currentPage === 1 || currentPage === 0}" :style="{width: liWidth + 'px' }">
     <i class="el-icon-arrow-left" @click="prev">
      </i>
    </li>
    <li
      :class="{ active: currentPage === 1}"
      v-if="total > 0"
      class="number" >
      1
    </li>
      <li
      class="el-icon more btn-quickprev"
      :class="[quickprevIconClass]"
      v-if="showPrevMore"
      @mouseenter="onMouseenter('left')"
      @mouseleave="quickprevIconClass = 'el-icon-more'">
    </li>
    <li class="number" v-for="item in pagers"  :class="{ active: currentPage === item}"  :style="{width: liWidth + 'px' }" >{{item}}</li>
     <li
      class="el-icon more btn-quicknext"
      :class="[quicknextIconClass]"
      v-if="showNextMore"
      @mouseenter="onMouseenter('right')"
      @mouseleave="quicknextIconClass = 'el-icon-more'">
    </li>
       <li
      :class="{ active: currentPage === total}"
      class="number"
      v-if="total > 1">{{ total }}</li>

    <li class="next"  @click="next" :class="{ disabled: currentPage === total}" :style="{width: liWidth + 'px' }"><i class="el-icon-arrow-right"></i>
    </li>
    </ul>
</div>
</template>

<script>
export default {
  name: "pie-style",
  components: {},
  props: {
    total: {
      default: 24
    },
    width: {
      default: 1000
    },
    currentPage: 0,
    extraParams: {
      type: Object,
      default: function() {
        return {
          startTime: "",
          endTime: "",
          startCompareTime: "",
          endCompareTime: "",
          conditionList: []
        };
      }
    }
    // pagerCount: {
    //   default: 24
    // }
  },
  data() {
    return {
      internalCurrentPage: 0,
      showPrevMore: false,
      showNextMore: false,
      quicknextIconClass: "el-icon-more",
      quickprevIconClass: "el-icon-more"
    };
  },
  computed: {
    pageData() {
      const count = Math.floor(this.width / 25);
      const arr = [];
      if (this.liWidth < 25) {
        this.showNextMore = true;
        // this.showPrevMore = true
        for (let i = 2; i < count - 2; i++) {
          arr.push(i);
        }
        // arr.push('...')
        // arr.push(this.total)
      } else {
        this.showNextMore = false;
        this.showPrevMore = false;
        for (let i = 2; i < this.total; i++) {
          arr.push(i);
        }
      }
      return arr;
    },
    liWidth() {
      return this.width / (this.total + 2);
    },
    pagerCount() {
      let pagerCount = Math.floor(this.width / 25) - 5;
      if (pagerCount < 3) {
        pagerCount = 3;
      }
      return pagerCount;
    },
    pagers() {
      const pagerCount = this.pagerCount;
      const halfPagerCount = (pagerCount - 1) / 2;
      const currentPage = Number(this.currentPage);
      const pageCount = Number(this.total);
      let showPrevMore = false;
      let showNextMore = false;
      if (pageCount > pagerCount) {
        if (currentPage > pagerCount - halfPagerCount) {
          showPrevMore = true;
        }
        if (currentPage < pageCount - halfPagerCount) {
          showNextMore = true;
        }
      }
      const array = [];
      if (showPrevMore && !showNextMore) {
        const startPage = pageCount - (pagerCount - 2);
        for (let i = startPage; i < pageCount; i++) {
          array.push(i);
        }
      } else if (!showPrevMore && showNextMore) {
        for (let i = 2; i < pagerCount; i++) {
          array.push(i);
        }
      } else if (showPrevMore && showNextMore) {
        const offset = Math.floor(pagerCount / 2) - 1;
        for (let i = currentPage - offset; i <= currentPage + offset; i++) {
          array.push(i);
        }
      } else {
        for (let i = 2; i < pageCount; i++) {
          array.push(i);
        }
      }
      this.showPrevMore = showPrevMore;
      this.showNextMore = showNextMore;
      return array;
    }
  },
  methods: {
    changePage(item) {
      const obj = {
        startTime: this.extraParams.startTime,
        endTime: this.extraParams.endTime,
        currentPage: item
      };
      if (item === "right") {
        this.showPrevMore = true;
      }
      this.$emit("on-change", obj);
      // this.internalCurrentPage = item
      // this.currentPage = item
    },
    prev() {
      this.internalCurrentPage = this.currentPage;
      if (this.internalCurrentPage > 1) {
        this.internalCurrentPage = this.internalCurrentPage - 1;
      }
      this.$emit("on-change", this.internalCurrentPage);
    },
    next() {
      this.internalCurrentPage = this.currentPage;
      if (this.internalCurrentPage < this.total) {
        this.internalCurrentPage = this.internalCurrentPage + 1;
      }
      console.log(this.internalCurrentPage);
      this.$emit("on-change", this.internalCurrentPage);
    },
    onMouseenter(direction) {
      if (this.disabled) return;
      if (direction === "left") {
        this.quickprevIconClass = "el-icon-d-arrow-left";
      } else {
        this.quicknextIconClass = "el-icon-d-arrow-right";
      }
    },
    onPagerClick(event) {
      const target = event.target;
      if (target.tagName === "UL" || this.disabled) {
        return;
      }
      if (
        target.className.indexOf("el-icon-arrow-left") !== -1 ||
        target.className.indexOf("el-icon-arrow-right") !== -1
      ) {
        return;
      }
      let newPage = Number(event.target.textContent);
      const pageCount = this.total;
      const currentPage = this.currentPage;
      const pagerCountOffset = this.pagerCount - 2;
      if (target.className.indexOf("more") !== -1) {
        if (target.className.indexOf("quickprev") !== -1) {
          newPage = currentPage - pagerCountOffset;
        } else if (target.className.indexOf("quicknext") !== -1) {
          newPage = currentPage + pagerCountOffset;
        }
      }
      /* istanbul ignore if */
      if (!isNaN(newPage)) {
        if (newPage < 1) {
          newPage = 1;
        }
        if (newPage > pageCount) {
          newPage = pageCount;
        }
      }
      if (newPage !== currentPage) {
        const obj = {
          startTime: this.extraParams.startTime,
          endTime: this.extraParams.endTime,
          startCompareTime: this.extraParams.startCompareTime,
          endCompareTime: this.extraParams.endCompareTime,
          currentPage: newPage
        };
        this.$emit("on-change", obj);
      }
    }
  }
};
</script>
<style lang="less">
.el-pagination1 {
  /*  display: flex;*/
  .btn-prev {
    padding-right: 12px;
    background: rgba(0, 0, 0, 0.25);
    color: #000;
  }
  .btn-next,
  .el-pagination .btn-prev {
    background: center center no-repeat #fff;
    background-size: 16px;
    cursor: pointer;
    margin: 0;
    color: #303133;
  }
  .el-pager1 {
    /*width: 100%;*/
    display: flex;
    li {
      padding: 0 4px;
      flex: 1;
      background: #fff;
      font-size: 14px;
      font-family: HelveticaNeue;
      color: rgba(0, 0, 0, 0.65);
      text-align: center;
      line-height: 22px;
      cursor: pointer;
      min-width: 25px;
      /*   width: 80px;
        min-width: 35.5px;*/
      /* height: 50px;*/
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
    li.active {
      color: #51a6ff;
      cursor: default;
      border: 1px solid #51a6ff;
      border-radius: 4px;
    }
    li.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
