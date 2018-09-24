<template>
  <el-table
    v-loading="loading"
    :data="tableData"
    :row-style="rowStyle"
    :cell-style="cellStyle">
    <el-table-column
      label="业务渠道"
      minWidth="140">
      <template slot-scope="scope">
        <i @click="handleDataDrop(scope)" :style="{left: '0px'}" :class="scope.row.classList" v-if="scope.row.isDropList"></i><span style="margin-left: 10px">{{ scope.row.assessmentChannel }}</span>
      </template>
    </el-table-column>
    <el-table-column label="付款金额">
      <el-table-column
        prop="paymentAmountThisPeriod"
        label="本期（万元）"
        minWidth="120">
      </el-table-column>
      <el-table-column
        prop="paymentAmountSamePeriod"
        label="同期（万元）"
        minWidth="120">
      </el-table-column>
      <el-table-column
        prop="paymentAmountYearGrowth"
        label="同比增长率"
        minWidth="120">
      </el-table-column>
      <el-table-column
        prop="paymentAmountThisStructureRatio"
        label="本期结构占比"
        minWidth="120">
      </el-table-column>
    </el-table-column>
    <el-table-column label="进销差率">
      <el-table-column
        prop="incomingRateThisPeriod"
        label="本期"
        minWidth="120">
      </el-table-column>
      <el-table-column
        prop="incomingRateSamePeriod"
        label="同期"
        minWidth="120">
      </el-table-column>
      <el-table-column
        prop="incomingRateYearGrowth"
        label="同比增长"
        minWidth="120">
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
  import env from '@/env'
  import axios from 'axios';
  export default {
    name: "index",
    data() {
      return {
        loading: false,
        tableData: [
          // 完整的数据实例
          // {
          //   assessmentChannel: '易购',
          //   paymentAmountThisPeriod: '959.16',
          //   paymentAmountSamePeriod: '470.56',
          //   paymentAmountYearGrowth: '103.84%',
          //   paymentAmountThisStructureRatio: '1.66%',
          //   incomingRateThisPeriod: '11.37',
          //   incomingRateSamePeriod: '0.00',
          //   incomingRateYearGrowth: '11.37%',
          //   level: 1,
          //   isShow: true,
          //   isDropList: true,
          //   classList: 'el-icon-caret-right'
          // }
        ]
      }
    },
    methods: {
      handleDataDrop({row, $index}) {
        if (row.classList === 'el-icon-caret-right') {
          row.classList = 'el-icon-caret-bottom'
        } else {
          row.classList = 'el-icon-caret-right'
        }

        let currentLevel = row.level
        for (let index=0; index<this.tableData.length; index++) {
          if (index > $index && this.tableData[index].level >= (currentLevel + 1) && currentLevel === 1) {
            if (this.tableData[index].level === 2 && row.classList === 'el-icon-caret-bottom') {
              this.tableData[index].isShow = true
            } else if (this.tableData[index].level === 2 && row.classList === 'el-icon-caret-right') {
              if (this.tableData[index].classList === 'el-icon-caret-bottom') this.tableData[index].classList = 'el-icon-caret-right'
              this.tableData[index].isShow = false
            } else if (this.tableData[index].level === 3 && row.classList === 'el-icon-caret-right') {
              this.tableData[index].isShow = false
            }
          } else if (index > $index && this.tableData[index].level === (currentLevel + 1) && currentLevel > 1) {
            this.tableData[index].isShow = row.classList === 'el-icon-caret-bottom'
          } else if (index > $index && this.tableData[index].level <= currentLevel) {
            break
          }
        }

      },
      rowStyle({row, rowIndex}) {
        let display = 'none'

        if (row.isShow) display = 'table-row'

        return {
          display
        }
      },
      cellStyle({row, columnIndex}) {
        let paddingLeft

        if (columnIndex === 0) {
          switch (row.level) {
            case 2:
              paddingLeft = '20px'
              break
            case 3:
              paddingLeft = '30px'
              break
            default:
              paddingLeft = '10px'
          }
        } else {
          paddingLeft = '0'
        }

        return {
          paddingLeft
        }
      },
      sendMessageToParent(message) {
        if(parent) parent.postMessage(message, `http://${location.hostname}`)
      },
      receiveMessage(event) {
        // 我们能信任信息来源吗？
        if (event.origin.split('//')[1] !== location.hostname) {
          return false
        }
        if (event.data && typeof(event.data) === 'string') {
          let params = JSON.parse(event.data)
          this.queryGmvData(params).then((res) => {
            this.loading = false
            if (res && res.data && res.data.length > 0) {
              this.tableData = this.gmvDataFormatter(res.data)
            } else {
              this.tableData = []
            }
          }).catch(error => {
            //超时之后在这里捕抓错误信息.
            if (error.response) {
              this.$message.info('服务器正忙，请稍后重试！')
            } else if (error.request) {
              this.$message.info('请求参数出错！')
              // console.log('error.request')
              // if(error.request.readyState == 4 && error.request.status == 0){
                //我在这里重新请求
              // }
            } else {
              this.$message.info('未知错误！')
              // console.log('Error', error.message);
            }
            // console.log(error.config);
            this.loading = false
          });
        }
        // event.source 就当前弹出页的来源页面
        // event.data 是 "hello there!"

        // 假设你已经验证了所受到信息的origin (任何时候你都应该这样做), 一个很方便的方式就是把enent.source
        // 作为回信的对象，并且把event.origin作为targetOrigin
        // event.source.postMessage("hi there yourself!  the secret response " +
        //   "is: rheeeeet!",
        //   event.origin);
      },
      toPercent(point) {
        let str = Number(point*100).toFixed(2)
        str += "%"
        return str
      },
      fixIncomingRate(value) {
        return Number(value*100).toFixed(2)
      },
      queryGmvData(params) {
        //return axios.post(`/tigbsdev/tig-query/openApi/reportData/queryGmvDatas`, params )
        return axios.post(`/openApi/reportData/queryGmvDatas`, params ,{
          baseURL: `${env.api}/tig-query`
        })
      },
      gmvDataFormatter(data) {
        data.sort((a, b) => a.sequence - b.sequence)
        let paymentAmountThisPeriodSum = data.reduce((acc, currentValue) => {
          currentValue.paymentAmountThisPeriod = currentValue.paymentAmountThisPeriod === '' ? 0 : currentValue.paymentAmountThisPeriod
          let l1 = currentValue.level === 1 ? Number(currentValue.paymentAmountThisPeriod) : 0
          return acc + l1
        } , 0)
        return data.map((item, index, array) => {
          item.paymentAmountThisPeriod = item.paymentAmountThisPeriod === '' ? 0 : item.paymentAmountThisPeriod
          item.paymentAmountSamePeriod = item.paymentAmountSamePeriod === '' ? 0 : item.paymentAmountSamePeriod
          if (item.paymentAmountSamePeriod === 0) {
            item.paymentAmountYearGrowth = '-'
          } else {
            item.paymentAmountYearGrowth = this.toPercent((item.paymentAmountThisPeriod - item.paymentAmountSamePeriod) / item.paymentAmountSamePeriod)
          }
          item.paymentAmountThisStructureRatio = this.toPercent(item.paymentAmountThisPeriod / paymentAmountThisPeriodSum)
          item.paymentAmountThisPeriod = (item.paymentAmountThisPeriod / 10000).toFixed(2)
          item.paymentAmountSamePeriod = (item.paymentAmountSamePeriod / 10000).toFixed(2)
          item.incomingRateThisPeriod = item.incomingRateThisPeriod === '' ? 0 : this.fixIncomingRate(item.incomingRateThisPeriod)
          item.incomingRateSamePeriod = item.incomingRateSamePeriod === '' ? 0 : this.fixIncomingRate(item.incomingRateSamePeriod)
          if (item.incomingRateSamePeriod === 0) {
            item.incomingRateYearGrowth = '-'
          } else {
            item.incomingRateYearGrowth = (item.incomingRateThisPeriod - item.incomingRateSamePeriod).toFixed(2) + '%'
          }
          item.isDropList = false
          item.isShow = false
          if (array[index+1] && array[index+1].level > item.level) {
            item.isDropList = true
            item.classList = 'el-icon-caret-right'
          }
          if (item.level === 1) item.isShow = true
          return item
        })
      }
    },
    mounted() {
      this.sendMessageToParent('zgds ready!')
      window.addEventListener("message", this.receiveMessage, false);
    },
    beforeDestroy() {
      window.removeEventListener("message", this.receiveMessage);
    }
  }
</script>

<style>
  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    height: 8px;
    width: 8px;
    background-color: #f5f5f5;
    box-shadow: none!important;
  }
  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    height: 5px;
    background: #e8e8e8;
    border: 1px solid #ccc;
    box-shadow: none!important;
    border-radius: 50px;
  }
  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #f5f5f5;
    border: 1px solid #aaa;
    box-shadow: none!important;
  }
  ::-webkit-scrollbar-thumb:window-inactive {
    background: #fff;
  }
  .el-icon-caret-right, .el-icon-caret-bottom{
    cursor: pointer;
  }
  .el-table__row td:first-child .cell {
    position: relative;
  }
  .el-table__row td:first-child .cell>i {
    position: absolute;
    top: 5px;
  }
  .el-table thead.is-group th {
    background-color: rgb(233, 236, 239);
    font-weight: bold;
    color: black;
  }
  .el-table td, .el-table th, .el-table--border, .el-table--group, .el-table,
  .el-table--border td, .el-table--border th,
  .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed{
    border-color: #ccc!important;
  }
  .el-table--border::after, .el-table--group::after, .el-table::before{
    background-color: #ccc;
  }
  .el-table th{
    padding: 9px 0;
  }
  .el-table th .cell{
    text-align: center;
    font-weight: bold;
  }
  .el-table td{
    text-align: right;
    padding: 6px 0;
  }
  .el-table td:first-child{
    text-align: left;
  }
</style>
