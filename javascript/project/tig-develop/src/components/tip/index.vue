<template>
  <div class="custom-tips">
    <transition name="fade" mode="out-in">
      <div v-loading="loading" v-show="showTable" class="tableStyle" @mouseover="handleMoveIn" @mouseout="handleMoveOut">
        <el-table
          :data="list">
          <el-table-column
            label="指标名称"
            align="left"
            width="140">
            <template slot-scope="scope">
              <!-- <div class="metric-code">{{ scope.row.metricsCode }}</div> -->
              <div class="metric-name" :title="scope.row.metricName">{{ scope.row.metricName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="指标定义"
            align="left">
            <template slot-scope="scope">
              <div>{{ scope.row.busiDefine }}</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="tipFooter">
          <div class="tip-action-area">
            <!-- button上不能加disabled属性，否则会触发重新渲染，导致表格跳动-->
            <el-button @click="pagePre" icon="el-icon-arrow-left"></el-button>
            <input v-model="currentPage" @keyup.enter="currentPageEnterHandle()" />
            <span style="margin: 0 10px;">/</span>
            <span class="page-total">{{pageTotal}}</span>
            <el-button @click="pageNext"><i class="el-icon-arrow-right el-icon--right"></i></el-button>
          </div>
        </div>
      </div>
    </transition>
    <!-- 这里用opactity设置透明度来隐藏，不能用display：none,否则popover会找不到节点，位置会跑到左边-->
    <span @mouseout="handleMoveOut" @mouseenter="handleMoveIn" @mouseover.once="updateData" :style="{opacity: opacity ? 1 : 0}" class="tipEle"><img src="../../../static/charts/images/tips.svg" alt="提示标记"></span>
  </div>
</template>

<script>
import axios from '@/web-design/api'
import {wait} from '../../web-design/views/charts/utils/utils'

export default {
  data() {
    return {
      showTable: false, // 是否显示表格中的数据
      loading: false, // 是否显示加载中
      delayTime: 500, // 显示延迟
      limit: 6, // 每页多少条
      offset: 0, // 当前数据是从多少条开始
      total: 0, // 总条数
      pageTotal: 1, // 总页数
      list: [], // 表数据
      listData: [] // 存放接口请求回来的数据
    }
  },
  computed: {
    currentPage: {
      get () {
       return (this.offset / this.limit) + 1
      },
      set (value) {
        // 如果输入值是大于1的整数，这里就同步更改offset，具体还原放在change事件里做
        value = Number(value)
        if (Number.isInteger(value) && value >= 1) {
          this.offset = (value -1) * this.limit
        } else {
          this.offset = 0 // 如果输入的不是整数，就把offset设置为0，也就是把页码设为1
        }
      }
    }
  },
  props: ['metricsId', 'opacity', 'isTab'],
  methods: {
    // 鼠标悬浮去查询数据
    async updateData() {
      if (this.$route.path === '/visual') {
        this.loading = true
        await this.refreshTable()
        this.loading = false
      }
    },
    // 鼠标移入时显示table，先请求接口，再显示table
    handleMoveIn() {
      this.showTable = true
    },
    // 鼠标移出时隐藏table
    handleMoveOut() {
      this.showTable = false
    },
    /**
     * 请求接口，由于接口本身每有提供分页，实现一个假分页
     */
    async refreshTable() {
      const res = await axios.request({
        url: '/metric/listDef',
        method: 'get',
        params: {
          metricsCodes: this.metricsId.map(metric => metric.metricCode).join(',')
        }
      })
      if (!res) return
      this.listData = res.data || []
      this.total = res.data.length || 0
      this.getPageTotal()
      this.updateTable()
    },
    // 计算总页数
    getPageTotal() {
      this.pageTotal = Math.ceil(this.total / this.limit)
    },
    // 把表格里的数据更新
    updateTable () {
      this.list = this.listData.slice(this.offset, this.currentPage * this.limit)
    },
    // 上翻页
    pagePre() {
      if (this.currentPage === 1) return
      this.offset -= this.limit
      this.updateTable()
    },
    // 下翻页
    pageNext() {
      if (this.currentPage === this.pageTotal) return
      this.offset += this.limit
      this.updateTable()
    },
    getFirstPage () {
      this.offset = 0
    },
    getLastPage () {
      // 页码通过offset来控制
      this.offset = (this.pageTotal - 1) * this.limit
    },
    // 当前页输入框的enter
    currentPageEnterHandle () {
      // 当输入的页码大于总页码的时候就把页码等于最大页码，如果小于最小页码的时候就等于最小页码
      this.currentPage = Number(this.currentPage)
      if (this.currentPage > this.pageTotal) {
        this.getLastPage ()
      } else if (this.currentPage < 1){
        this.getFirstPage ()
      }
      // 修改数据
      this.updateTable()
    }
  }
}
</script>

<style scoped>
.tipEle:hover {
  cursor: pointer;
}
.tipEle {
  float: left;
  line-height: 1;
  height: 44px;
}
</style>

<style lang="less">
  .custom-tips {
    display: inline-block;
    .tableStyle{
      width: 400px;
      background: #fff;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }
  }
  div.tips-pop {
    padding: 0;
    border: none;
    .el-table__row{
      .cell{
        padding-left: 16px;
        padding-right: 16px;
      }
    }
    div.ivu-table-header {
      height: 36px;
      font-size: 14px;
      color: #999;
    }
    div.ivu-table-body {
      font-size: 14px;
      color: #333;
    }
  }
  div.tipFooter {
    height: 52px;
    font-size: 14px;
    padding-right: 8px;
    padding-top: 12px;
    text-align: right;
    div.tip-action-area>button {
      border: none;
      outline-color: transparent;
      // font-size: 14px;
      padding: 5px 20px;
      background-color: transparent;
      &:hover {
        background-color: transparent;
      }
      &:focus {
        box-shadow: none;
      }
      span {
        font-size: 14px;
      }
    }
    input {
      width: 30px;
      text-align: center;
      color: #333;
      font-weight: 700;
    }
  }
</style>
