<template>
<div>
  <header class="header">
    <div>
      <span class="back-to-choose" @click="backToChoose"> 返回指标选择 </span>
      <Input class="cus-input" :class="{'input-warning': this.inputWaring}" :maxlength="30" @input= "reportNameFocus" v-model="reportName" @on-focus="reportFocus" @on-blur="reportBlur" placeholder="未命名的报表" style="width: 200px"></Input>
    </div>
    <div class="right-place" style="color: #fff;margin-right: 15px;">
      <span class="icon-wrap preview" @click="changeShowPreview">
        <i class="preview-icon" style="color: #fff;"></i>
        预览
      </span>
      <span class="icon-wrap save" @click="update(1)" style="margin-right: 26px;">
        <i class="save-icon" style="color: #fff;"></i>
        保存
      </span>
      <span class="icon-wrap save" @click="update(0)">
        <Icon type="power" style="color: #fff;"></Icon>
        关闭
      </span>
    </div>
  </header>
  <Modal
    v-model="preview"
    :mask-closable="false"
    title="报表预览"
    width="80%">
      <hot-table v-if="preview" :exportDisable="true" ref="hotTable" :designConfig="tableConfig" 
      :report="{ reportId: '', versionId: this.$route.query.versionId}"
       :designLimit="100"></hot-table>
        <div slot="footer"></div>
    </Modal>
</div>
</template>

<script>
import hotTable from '../elementTable/hotTable'
import { checkReportName } from '@/components/Utils'

export default {
  name: 'design-header',
  components: {
    hotTable,
  },
  data() {
    return {
      preview: false,
      tableConfig: {
        exportData: false,
        columnList: [],
        filterList: [],
        pageSize: 10,
        queryList: [],
        reportFunction: 0, // 0 固定报表 1 维度切分
        timeDistance: 'day', // 时间粒度
      },
      inputWaring: false
    }
  },
  computed: {
    reportName: {
      get() {
        return this.$store.getters.getReportName
      },
      set(newValue) {
        this.$store.commit('handleReportNameChange', newValue)
      }
    },
    // 业务端可以更改报名名称，开发端不可以
    inputDisable() {
      const pathname = location.pathname
      if (pathname.includes('business')) {
        return false
      }
      return true
    },
    metric() {
      return this.$store.getters.getColumnList.filter(v => v.type === 1)
    },
    crossMetric() {
      return this.$store.state.design.crossMetric
    },
    columnDim() {
      return this.$store.state.design.columnDim
    },
    tableHeaderActive() {
      return this.$store.state.design.tableHeaderActive
    },
    // 表格数据
    tableHeader() {
      return this.$store.state.design.tableHeader
    },
    columnList() {
      return this.$store.state.design.columnList
    },
    filterList() {
      return this.$store.state.design.filterList
    },
    row() {
      return this.$store.state.design.row
    },
    reallyRow() {
      if (this.tableHeaderActive) {
        return this.row
      } else {
        return 1
      }
    }
  },
  methods: {
    reportFocus() {
      this.$store.commit('keepActive', false)
      // console.log('aa')
    },
    reportBlur() {
      this.$store.commit('keepActive', true)
      // console.log('bb')
    },
    reportNameFocus() {
      if (this.inputWaring) {
        this.reportName = ''
      }
      this.inputWaring = false
    },
    verification() {
      // debugger
      // 验证报表名称
      if (this.reportName.indexOf('未命名') !== -1 || this.reportName === '' || this.reportName === '请在此输入正确的表名称') {
        this.reportName = '请在此输入正确的表名称'
        this.inputWaring = true
        return false
      }
      // 根据交叉表的状况而言,行维度中并不能加入指标,而是检验交叉指标是否存在
      // 此处行为和二维表并不一致
      const reportType = this.$route.query.reportType
      const metric = this.metric
      // 二维表保存验证
      if (Number(reportType) === 1 && !metric.length) {
        this.$Message.info('请先选择要展示的指标数据！')
        return false
      }
      // 交叉表保存验证
      if (Number(reportType) === 2 && !this.crossMetric.id) {
        this.$Message.info('请先选择交叉指标数据！')
        return false
      }
      if (Number(reportType) === 2 && !Object.keys(this.columnDim.dimValue).length) {
        this.$Message.info('请先选择列维度数据！')
        return false
      }
      // 自定义表头最后一行验证
      // if (this.tableHeaderActive && this.tableHeader[this.tableHeader.length - 1]) {
      //   const lastLine = this.tableHeader[this.tableHeader.length - 1]
      //   if (lastLine.length !== this.columnList.length) {
      //     this.$Message.info('自定义表头的最后一列必须和下方表格头列数一致！')
      //     return false
      //   }
      // }
      // TIG-428: 报表设计器-筛选设置-是否设置筛选内容判断，拖拽至筛选条件区域的维度均需要设置筛选条件内容，否则报表无法保存、预览
      let flag = false
      this.filterList.forEach((v) => {
        const IsExist = 'filterCondition' in v
        if (!IsExist || v.filterValue === '' || v.filterValue.length === 0) {
          flag = true
        }
      })
      // 存在筛选条件查询条件或者查询维值为空的情况
      if (flag) {
        this.$Message.error('过滤筛选条件不能为空哦！')
        return false
      }
      return true
    },
    handleData() {
      // 处理表头数据 改为预览需要的数据
      const tableChange = JSON.stringify(this.$store.state.design)
      const tableData = JSON.parse(tableChange)
      const tableHeader = tableData.tableHeader
      const columnList = tableData.columnList
      const tableHeaderArray = []
      tableHeader.forEach((v) => {
        const eachArray = []
        columnList.forEach((c) => {
          eachArray.push(v[c.id])
        })
        tableHeaderArray.push(eachArray)
      })
      tableHeaderArray.splice(this.reallyRow, 5)
      tableData.tableHeader = tableHeaderArray
      // 处理合并顺序
      const payloadHandle = {}
      const mergeColumn = [] // 和并列
      const total = [] // 合计
      // 处理顺序和列中顺序一样
      tableData.columnList.forEach((v) => {
        tableData.subtotal.mergeColumn.forEach((j) => {
          if (v.id === j) {
            mergeColumn.push(j)
          }
        })
        tableData.subtotal.total.forEach((k) => {
          if (v.id === k) {
            total.push(k)
          }
        })
      })
      payloadHandle.mergeColumn = mergeColumn
      payloadHandle.total = total
      tableData.subtotal = payloadHandle
      return tableData
    },
    // 展示预览
    changeShowPreview() {
      // 预览前校验
      if (this.verification() === false) return false
      this.tableConfig = this.handleData()
      this.preview = !this.preview
      return true
    },
    update(type) {
      // 保存前校验
      if (this.verification() === false) return false
      // 0 关闭--> 请求+ 跳转
      // 1 保存--> 请求
      // 判断报表名称
      if (!checkReportName(this.reportName)) {
        this.$Message.error('报名名称不符合规则，请重新输入报表名称')
        return false
      }
      const query = this.$route.query
      // reportName支持修改，并不能从地址栏取，应该从store取
      query.reportName = this.$store.state.design.reportName
      if (Object.keys(query).length > 1) {
        this.$store.dispatch('updateReport', { ...query, type })
      }
      return true
    },
    backToChoose() {
      // 返回指标选择
      // 清空自定义列
      this.$store.state.design.customColumn = []
      const query = this.$route.query
      const config = {}
      // 如果是开发端，要带上applyId，业务段则不需要
      const systemType = location.pathname
      if (systemType.includes('develop')) {
        config.applyId = query.applyId
      }
      config.reportId = query.reportId
      config.versionId = query.versionId
      config.systemLabel = query.systemLabel
      config.reportType = query.reportType
      this.$router.push({ path: '/tableUpdate', query: config })
    }
  }
}
</script>

<style lang="less" scoped>
.back-to-choose{
  cursor: pointer;
  color: #fff;
  margin-left: 15px;
}
.header {
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(90deg, #27cccb 8%, #07A7E3 100%);
  align-items: center;
  height: 46px;
  width: 100%;
}
.preview-icon{
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("/static/design/svg/yulan.svg");
  background-size: cover;
}
.save-icon{
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("/static/design/svg/baocun.svg");
  background-size: cover;
}
.right-place{
  display: flex;
  .icon-wrap{
    display: flex;
    align-items: center;
    margin-right: 10px;
    cursor: pointer;
    i{
      margin-right: 4px;
    }
  }
  .preview{
    margin-right: 30px;
  }
}
.input-warning {
  &:before{
    content:url('/static/design/waring.png');
    position: absolute;
    left: 6px;
    top: 7px;
    z-index: 99;
  }
}
</style>

<style>
.ivu-modal-footer {
  clear: both;
}
.cus-input {
  margin-left: 120px;
}
.cus-input input {
width: 200px;
background: rgba(255,255,255,0.1);
border: none;
color: #fff;
border-radius: 3px;
height: 24px;
}
.input-warning input{
  background-color: #fff;
  color: red;
  padding-left: 30px;
  border: 1px solid red;
}
</style>
