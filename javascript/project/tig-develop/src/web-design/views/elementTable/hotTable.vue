<template>
<div class="element-hot-table">

<div class="hottable-header"  v-if="designConfig">
  <h3 class="hottable__title" v-text="design.reportName"></h3>
  <Button type="ghost"  style="margin-left: 20px;" icon="reply" v-if="drillCurrent.number > 1" @click="drillBack"></Button>
  <div style="flex:1;"></div>
  <Button v-if="design.exportData" :disabled="exportDisable ||  exportStatus"  style="color: #409EFF;" type="text"  @click="exportDataShow = true"><object data="static/design/svg/export.svg" type="image/svg+xml"></object><span style="margin-left: 5px;">导出报表</span></Button>
  <Dropdown  style="background: #F5F5F5;border-radius: 3px;padding: 7px 10px;width: 160px;"  placement="bottom-end" v-if="design.reportFunction === 1" trigger="click" :visible="dimensionSplitShow">
    <a href="javascript:void(0)" style="color: #333;font-size: 12px;" @click="changeDimensionSplitShow">
      <span>维度切分</span>
      <i class="el-icon-arrow-down" style="float: right;"></i>
    </a>
    <DropdownMenu slot="list">
      <DropdownItem
        v-for="(item, index) in headerColumns"
        v-if="item.type === 0"
        :key="index"
        :disabled="loadingTableData || item.prop === design.drill.selectedDrillItem.id"
        @click.native="triggerDim(item, index)"
        style="display: flex; align-items:center;">
        <span  style="width: 20px;display:inline-block;">
          <Icon type="ios-checkmark-empty" size="20" color="#51A6FF" v-show="item.show"></Icon>
        </span>
        <span  style="padding: 0 .1rem;" v-text="item.name"></span>
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
 
  <Modal
    v-model="exportDataShow"
    :mask-closable="false"
    title="导出">
    <Form ref="form" :rules="formRule" :model="exportForm" :label-width="80">
      <FormItem label="名称" prop="exportName">
          <Input v-model="exportForm.exportName" placeholder="请输入"/>
      </FormItem>
      <FormItem label="格式" prop="fileType">
      <RadioGroup v-model="exportForm.fileType">
        <Radio :label="0">CSV</Radio>
        <Radio :label="1">MS-EXCEL</Radio>
      </RadioGroup>
      </FormItem>
      <FormItem label="注意">
          <span>订阅豆芽天工服务号公众号，系统处理成功后，会通过豆芽通知您!</span>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button
        type="primary"
        :loading="exportLoading" @click="exportDataOperat">确定</Button>
    </div>
  </Modal>
</div>

<div>
  <el-button type="text" @click="filterShow = !filterShow"><span style="color: #333;font-size: 12px;">查询条件</span> <i class="el-icon-arrow-down" v-if="filterShow"></i> <i v-if="!filterShow" class="el-icon-arrow-up"></i> </el-button>  
 </div>
<div v-show="filterShow" class="hottable-filter" v-if="designConfig" style="border: 1px dashed #ddd;padding: 10px;">
  <div style="display: flex;align-items:center;">
    <span>时间周期</span>
    <div style="flex: 1;margin-left: 20px;">
  <el-select @change="changeTimeType" v-model="timeType" placeholder="请选择" size="mini"
  style="width: 80px;text-align:center;">
    <el-option
      v-for="el in timeTypeList"
      :key="el.value"
      :label="el.name"
      :value="el.value">
    </el-option>
  </el-select>
    <span class="hottable_filter_day" v-if="timeType === 'day'">
      <el-date-picker
        @change="changeStartDay"
        :picker-options="dateOptions"
        size="mini"
        type="date"
        placeholder="选择日期"
        class="hottable-filter__datepicker"
        format="yyyyMMdd"
        value-format="yyyyMMdd"
        v-model="condiDate[0]"
        :clearable="false"></el-date-picker>
      <span> - </span>
      <el-date-picker
        @change="changeEndDay"
        size="mini"
        type="date"
        :picker-options="dateOptionsEnd"
        class="hottable-filter__datepicker"
        format="yyyyMMdd"
        value-format="yyyyMMdd"
        v-model="condiDate[1]"
        placeholder="选择日期"
        :clearable="false"></el-date-picker>

      <Icon type="ios-plus-outline" v-if="isRatio"></Icon>

      <el-date-picker
        @change="changeStartRatioDay"
        v-if="isRatio"
        :picker-options="dateOptions"
        class="hottable-filter__datepicker "
        format="yyyyMMdd"
        value-format="yyyyMMdd"
        v-model="condiDateRatio[0]"
        placeholder="选择日期"
        size="mini"
        :clearable="false"></el-date-picker>

      <span  v-if="isRatio"> - </span>

      <el-date-picker
        @change="changeEndRatioDay"
        v-if="isRatio"
        :picker-options="dateRatioOptionsEnd"
        class="hottable-filter__datepicker "
        format="yyyyMMdd"
        value-format="yyyyMMdd"
        v-model="condiDateRatio[1]"
        placeholder="选择日期"
        size="mini"
        :clearable="false"></el-date-picker>

    </span>

    <span v-if="timeType === 'month'">
      <el-date-picker
        @change="changeStartDay"
        :picker-options="dateOptions"
        class="hottable-filter__datepicker "
        v-model="condiDate[0]"
        format="yyyy-MM"
        value-format="yyyy-MM"
        type="month"
        size="mini"
        placeholder="起始月"
        :clearable="false"></el-date-picker>
      <span> - </span>
      <el-date-picker
        @change="changeEndDay"
        :picker-options="dateOptionsEnd"
        class="hottable-filter__datepicker "
        v-model="condiDate[1]"
        format="yyyy-MM"
        value-format="yyyy-MM"
        type="month"
        size="mini"
        placeholder="终止月"
        :clearable="false"></el-date-picker>

      <Icon  v-if="isRatio" type="ios-plus-outline"></Icon>

      <el-date-picker
      @change="changeStartRatioDay"
      v-if="isRatio"
      :picker-options="dateOptions"
      class="hottable-filter__datepicker "
      v-model="condiDateRatio[0]"
      format="yyyy-MM"
      value-format="yyyy-MM"
      type="month"
        size="mini"
      placeholder="起始月"
      :clearable="false"></el-date-picker>
      <span  v-if="isRatio"> - </span>
      <el-date-picker
        @change="changeEndRatioDay"
        v-if="isRatio"
        :picker-options="dateRatioOptionsEnd"
        class="hottable-filter__datepicker "
        v-model="condiDateRatio[1]"
        format="yyyy-MM"
        value-format="yyyy-MM" 
        type="month" 
        size="mini"
        placeholder="终止月" 
        :clearable="false"></el-date-picker>
    </span>

    <span v-if="timeType === 'year'">
      <el-date-picker
      @change="changeStartDay"
      :picker-options="dateOptions"
      class="hottable-filter__datepicker "
      v-model="condiDate[0]"
      format="yyyy"
        size="mini"
      value-format="yyyy"
      type="year"
      placeholder="起始年"
      :clearable="false"></el-date-picker>
      <span> - </span>
      <el-date-picker
        @change="changeEndDay"
        :picker-options="dateOptionsEnd"
        class="hottable-filter__datepicker "
        v-model="condiDate[1]" 
        format="yyyy"
        value-format="yyyy"
        type="year"
        size="mini"
        placeholder="终止年"
        :clearable="false"></el-date-picker>

      <Icon  v-if="isRatio" type="ios-plus-outline"></Icon>

      <el-date-picker
        @change="changeStartRatioDay" 
        v-if="isRatio"
        :picker-options="dateOptions"
        class="hottable-filter__datepicker "
        v-model="condiDateRatio[0]"
        format="yyyy"
        size="mini"
        value-format="yyyy"
        type="year"
        placeholder="起始年"
        :clearable="false"></el-date-picker>
      <span  v-if="isRatio"> - </span>
      <el-date-picker
        @change="changeEndRatioDay"
        v-if="isRatio"
        :picker-options="dateRatioOptionsEnd"
        class="hottable-filter__datepicker "
        v-model="condiDateRatio[1]" 
        format="yyyy"
        size="mini"
        value-format="yyyy"
        type="year" 
        placeholder="终止年"
        :clearable="false"></el-date-picker>
    </span>
  </div>
    <div>
       
    </div>
  </div>
  
  <div style="display: flex;flex-wrap: wrap;align-items: center;">
 
    <span v-for="(query, index) in queryList" :key="index" class="hottable-querylist">
      <span :title="query.name" v-text="query.name" class=" hottable-querylist___title"></span>
      <el-select size="mini" v-if="query.type === 0" class="hottable-search-select" v-model="query.operator" style="width: 80px" clearable>
        <el-option  v-for="(op, key) in operatorList" :key="key" v-text="op" :label="op" :value="key"></el-option>
      </el-select>
      
      <el-select
        size="mini"
        v-if="query.type === 1"
        class="hottable-search-select" v-model="query.operator" style="width: 80px" clearable>
        <el-option v-text="operatorList[0]" :label="operatorList[0]" :value="0"></el-option>
        <el-option v-text="operatorList[1]" :label="operatorList[1]" :value="1"></el-option>
      </el-select>
      <el-select
        size="mini"
        v-if="query.type === 0"
        filterable
        remote
        clearable
        :remote-method="(key => queryDim(query, key))"
        class="hottable-search-select"
        v-model="query.value"
        style="width: 160px;margin-left: 5px;">
        <el-option
          v-for="(valueItem, valueIndex) in query.valueList"
          :key="valueIndex"
          :label="valueItem.dimValueNm"
          v-text="valueItem.dimValueNm"
          :value="valueItem.dimValue"></el-option>
      </el-select>

      <el-input  v-if="query.type === 1" v-model="query.value" size="mini" placeholder="请输入"  style="width: 160px;margin-left: 5px;" clearable></el-input>
    </span>

    <div style="flex: 1;text-align:right;">
      <el-button
     size="mini"
     style="width: 80px;margin-top: 10px;"
    type="primary"
    @click="searchData"
    :disabled="loadingTableData ||  !tableAuth || !condiDate[0] || !condiDate[1]">查询</el-button>
    </div>
  </div>
</div>
<h-table
  v-if="designConfig"
  ref="htable"
  :source="source"
  :loadingTableData="loadingTableData"></h-table>

<div v-if="design.pageSize > 0 && paging.total > 0" style="background: #f5f5f5;display: flex;align-items: center;padding: 4px 20px;">
  <span style="margin-right: 10px;">当前 {{  tablePage && tablePage[paging.page] && ( (paging.page - 1) * design.pageSize + 1) || 0}} - {{ tablePage && tablePage[paging.page] &&  ((paging.page - 1) * design.pageSize + tablePage[paging.page].length) }} 条 
     </span>
     <span style="margin-right: 10px;">共 {{paging.total}} 条</span>
     <span>每页展示</span>
  <el-input disabled v-model="design.pageSize" style="width: 50px;margin-left: 10px;margin-right: 10px;" size="mini"></el-input>
  <span>条</span>
  <span style="flex: 1;"></span>
  <el-button type="text" :disabled="paging.page === 1" style="margin-right: 10px;color: #777;" @click="changePage(false)">上一页</el-button>
  <span>{{paging.page}} / {{ paging.total % design.pageSize === 0 ?  ( paging.total / design.pageSize) : parseInt(( paging.total / design.pageSize)) + 1  }}</span>
  <el-button type="text" style="color: #777;margin-left: 10px;" @click="changePage(true)">下一页</el-button>

  <span style="margin-left: 40px;">跳转至</span>
  <el-input v-model.number="tempPage"  @keyup.enter.native="changePage(true, true)"  style="width: 50px;margin-left: 10px;margin-right: 10px;" size="mini"></el-input>
  <span>页</span>
</div>
<div
  v-if="!designConfig && alertCanShow"
  style="padding-top: 100px;">
  <Alert
    type="warning"
    show-icon
    style="max-width: 400px;margin: 0 auto;">
      提示
      <template slot="desc">
          报表内容不存在
      </template>
  </Alert>
</div>
</div>
</template>

<script>
import draggable from 'vuedraggable'
import enums from '@/components/Utils/enums'
import moment from 'moment'
import ClipLoader from 'vue-spinner/src/ClipLoader'
import tableApi from '@/web-design/api/table'
import filter from './filter'
import hTable from './hTable'
import initHeader from './initHeader'
import initTable from './initTable'

export default {
  mixins: [
    initHeader,
    initTable,
    filter,
  ],
  components: {
    hTable,
    draggable,
    ClipLoader
  },
  data() {
    return {
      tempPage: '',
      filterShow: true,
      exportStatus: false,
      LogFlag: 0,
      tableAuth: true,
      design: {
        // 查询条件相关
        queryList: [],
        filterList: [],
        timeDistance: '',
        pageSize: 0,
        // 表格配置相关
        reportName: '',
        columnList: [],
        reportFunction: 0, // 维度切分
        exportData: false, // 是否导出
        style: {
          tyle: 'style1',
          custom: {
            spacing: 10,
            fontSize: 14,
            bgColor: '#fff'
          }
        },
        subtotal: {
          // 合并列
          mergeColumn: [],
          // 合计列
          total: []
        },
        freeze: {
          freezeBoolean: 0, // 冻结表头
          rowNumber: 0 // 冻结前 n 列
        }
      },
      drillIndex: 0,
      emptyText: '暂无数据',
      exportDataShow: false,
      exportLoading: false,
      dimensionSplitShow: false,
      alertCanShow: false,
      operatorList: enums.operator,
      exportForm: {
        exportName: '',
        fileType: 0,
        pulishType: 1 // 0 无 1 豆芽推送
      },
      formRule: {
        exportName: [
          { required: true, message: '请输入报表名称', trigger: 'blur' }
        ],
        fileType: [
          { required: true, message: '请选择文件类型', trigger: 'blur', type: 'number' }
        ]
      },
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now() - 86400000
        }
      },
      // 日期结束时间
      dateOptionsEnd: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now() - 86400000
        }
      },
      // 对比日期结束时间
      dateRatioOptionsEnd: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now() - 86400000
        }
      },
      source: {
        // 数据
        columns: [ // 列
        ],
        headerRows: 1,          // 表头行数
        headerStyle: {},        // 表头样式
        mergeCells: [], // 合并单元格
        data: [ // 表头内容 + 表格内容
        ],
        // 样式
        fixedColumnsLeft: 0, // 冻结 1 列
        fixedRowsTop: 0,     // 冻结表头
        cellStyle: {
          padding: '10px',
          fontSize: '14px',
          textAlign: 'center',
          paddingBottom: '20px',
          paddingTop: '10px',
          backgroundColor: '#fff'
        },
      }
    }
  },
  methods: {
    queryDim(item, key) {
      tableApi.dimensionQuery({
        dimId: (item && item.id) || '',
        key,
        offset: 0,
        limit: 100
      }).then((res) => {
        if (res && res.statusCode && res.statusCode === '0') {
          item.valueList = res.data
        } else {
          item.valueList = []
        }
        this.queryList.push()
      })
    },
    async initTableDesign(val) {
      console.log(val)
      if (val && Object.keys(val).length > 0) {
        if (this.$route.query.reportType) {
          val.reportType = Number(this.$route.query.reportType)
        }
        if (this.$route.query.export === 1 || this.$route.query.export === '1') {
          this.exportStatus = true
        }
        if (this.$route.query.flag === 1 || this.$route.query.flag === '1') {
          this.LogFlag = 1
        }
        if (val.reportType === 2) {
          this.filter.type = 2
        }
        this.design = val
        if (val.systemId) {
          this.filter.systemId = val.systemId
        }
        this.filter.reportId =  this.$route.query.see ? '' : this.report.reportId
        this.filter.versionId = this.report.versionId
        this.transformFilter()
        const drill = this.design.drill
        if (drill && drill.dirllRoad && drill.dirllRoad.routeCode && drill.dirllRoad.routeNm
        && drill.dirllRoad.dimRoute && drill.selectedDrillItem.id && drill.selectedDrillItem.name) {
          for (let i = 0; i < this.design.columnList.length; i += 1) {
            const dCol = this.design.columnList[i]
            dCol.index = i
            if (drill.selectedDrillItem.id === dCol.id) {
              this.drillCol = i
            }
          }
        }
        this.initHeader()
        this.initTable()
        // 初始化htable
        this.$nextTick().then(() => {
          this.$refs.htable.initTable()
        })
        this.initData()
      }
    },
    changeStartRatioDay(day) {
      if (moment(day).unix() > moment(this.condiDateRatio[1]).unix()) {
        this.$Message.error('结束时间不能早于起始时间')
        this.condiDateRatio[1] = ''
      }
    },
    changeEndRatioDay(day) {
      if (moment(day).unix() < moment(this.condiDateRatio[0]).unix()) {
        this.$Message.error('起始时间不能晚于结束时间')
        this.condiDateRatio[0] = ''
      }
    },
    changeStartDay(day) {
      if (moment(day).unix() > moment(this.condiDate[1]).unix()) {
        this.$Message.error('结束时间不能早于起始时间')
        this.condiDate[1] = ''
      }
    },
    changeEndDay(day) {
      if (moment(day).unix() < moment(this.condiDate[0]).unix()) {
        this.$Message.error('起始时间不能晚于结束时间')
        this.condiDate[0] = ''
      }
    },
    changeDimensionSplitShow() {
      this.dimensionSplitShow = !this.dimensionSplitShow
    },
    // 报表导出操作
    exportDataOperat() {
      if (this.exportForm && this.exportForm.exportName
        && this.exportForm.exportName.length > 120) {
        this.$Message.error('导出名称过长，请小于120个字符')
        return
      }
      this.exportLoading = true
      if (!this.report.reportId || !this.report.versionId) {
        this.$Message.error('缺失报表信息，无法进行导出操作')
        this.exportLoading = false
        return
      }
      this.$refs.form.validate((val) => {
        if (val) {
          const exportCondition = {
            exportName: this.exportForm.exportName,
            fileType: this.exportForm.fileType,
            pulishType: this.exportForm.pulishType,
          }
          // 自定义表头
          exportCondition.headerList = this.headerExport
          // 合并表头
          const tableHeaderActive = this.design.tableHeaderActive
          const handsonMerge = this.design.handsonMerge
          if (tableHeaderActive && handsonMerge.length > 0) {
            const arr = []
            for (let i = 0; i < handsonMerge.length; i += 1) {
              const item = handsonMerge[i]
              arr.push(`${item.row},${(item.row + item.rowspan) - 1},${item.col},${(item.col + item.colspan) - 1}`)
            }
            exportCondition.mergedRegionList = arr
          }
          const post = JSON.parse(JSON.stringify(this.filter))
          post.exportTask = exportCondition
          const config = {}
          if (this.LogFlag === 1) {
            config.headers = {
              LogFlag: 1
            }
          }
          tableApi.export(post, config).then((res) => {
            if (res) {
              this.$Message.success('操作成功')
              this.exportDataShow = false
            }
            if (res && res.data && res.data.statusCode !== '0') {
              this.$Message.error((res.data && res.data.msg) || res.data.errmsg || '抱歉')
            }
            this.exportLoading = false
          }).catch(() => {
            this.exportLoading = false
          })
        } else {
          this.exportLoading = false
        }
      })
    },
    // 上卷下钻操作 下钻
    drillNext(prop, dimValueId) {
      this.loadingTableData = true
      const columns = this.headerColumns
      const drill = this.drillCurrent
      drill.number += 1
      const num = drill.number
      // 存储路径过程中的维值
      drill.drillDimValArr[drill.number - 1] = dimValueId
      // 判断是否存在 合计
      if (this.filter.autoSum) {
        const sumCodeList = this.filter.sumCodeList
        const sumCodeArr = []
        let drillSum = 0
        for (let s = 0; s < sumCodeList.length; s += 1) {
          let sumCodeItem = sumCodeList[s]
          if (drillSum === 0 && (sumCodeItem === drill.drillDimArr[num - 2])) {
            sumCodeItem = drill.drillDimArr[num - 1]
            sumCodeArr.push(sumCodeItem)
            drillSum += 1
          } else {
            sumCodeArr.push(sumCodeItem)
          }
        }
        this.filter.sumCodeList = sumCodeArr
      }
      // 是否合并单元格
      if (this.filter.mergeCell) {
        const mergeCodeList = this.filter.mergeCodeList
        const sumCodeArr = []
        let drillSum = 0
        for (let s = 0; s < mergeCodeList.length; s += 1) {
          let sumCodeItem = mergeCodeList[s]
          if (drillSum === 0 && (sumCodeItem === drill.drillDimArr[num - 2])) {
            drillSum += 1
            sumCodeItem = drill.drillDimArr[num - 1]
          }
          sumCodeArr.push(sumCodeItem)
        }
        this.filter.mergeCodeList = sumCodeArr
      }

      const el = columns[this.drillCol]
      if (el.id === prop && drill.number >= 1 && drill.total > 1) {
        el.name = drill.drillRoadArr[num - 1] // 变成下一个节点名称
        el.id = drill.drillDimArr[num - 1] // 到下一层拿数据
      }
      this.handleColumns(1)
      // 查询数据
      const filter = this.filter
      const drillDimCode = drill.drillDimArr[drill.number - 2]
      const nextDimCode = drill.drillDimArr[drill.number - 1]
      const nextDimName = drill.drillRoadArr[drill.number - 1]
      filter.drill = {
        dimValueId,
        drillDimCode,
        drillPath: drill.pathCode,
        drillNumber: 1,
        nextDimCode,
        nextDimName
      }
      // 到第二级下钻开始变换dimList
      if (drill.number >= 3) {
        for (let i = 0; i < filter.dimList.length; i += 1) {
          const dim = filter.dimList[i]
          if (dim.dimId === drill.drillDimArr[drill.number - 3]) {
            dim.dimId = drillDimCode
            dim.dimName = drill.drillRoadArr[drill.number - 2]
          }
        }
      }
      this.filter = filter
      this.resetData()
      this.initData()
    },
    // 返回上卷 (上钻的上钻的下钻)
    drillBack() {
      this.loadingTableData = true
      const columns = this.headerColumns
      const drill = this.drillCurrent
      drill.number -= 1
      const num = drill.number
      // 判断是否存在 合计
      if (this.filter.autoSum) {
        const sumCodeList = this.filter.sumCodeList
        const sumCodeArr = []
        let drillSum = 0
        for (let s = 0; s < sumCodeList.length; s += 1) {
          let sumCodeItem = sumCodeList[s]
          if (drillSum === 0 && (sumCodeItem === drill.drillDimArr[num])) {
            drillSum += 1
            sumCodeItem = drill.drillDimArr[num - 1]
            sumCodeArr.push(sumCodeItem)
          } else {
            sumCodeArr.push(sumCodeItem)
          }
        }
        this.filter.sumCodeList = sumCodeArr
      }
      // 是否合并单元格
      if (this.filter.mergeCell) {
        const mergeCodeList = this.filter.mergeCodeList
        const sumCodeArr = []
        let drillSum = 0
        for (let s = 0; s < mergeCodeList.length; s += 1) {
          let sumCodeItem = mergeCodeList[s]
          if (drillSum === 0 && (sumCodeItem === drill.drillDimArr[num])) {
            drillSum += 1
            sumCodeItem = drill.drillDimArr[num - 1]
            sumCodeArr.push(sumCodeItem)
          } else {
            sumCodeArr.push(sumCodeItem)
          }
        }
        this.filter.mergeCodeList = sumCodeArr
      }
      const el = columns[this.drillCol]
      if (el.id === drill.drillDimArr[drill.number]) {
        el.name = drill.drillRoadArr[num - 1] // 变成下一个节点名称
        el.id = drill.drillDimArr[num - 1]
      }
      this.handleColumns(1)
      // 查询数据
      const filter = this.filter
      // 到第二级上级下钻开始变换dimList
      if (drill.number >= 2) {
        let dimChangeTimes = 0
        for (let i = 0; i < filter.dimList.length; i += 1) {
          const dim = filter.dimList[i]
          if ((dim.dimId === drill.drillDimArr[drill.number - 1]) && dimChangeTimes === 0) {
            dimChangeTimes += 1
            dim.dimId = drill.drillDimArr[drill.number - 2]
            dim.dimName = drill.drillRoadArr[drill.number - 2]
          }
        }
      }
      if (drill.number === 1) {
        delete filter.drill
      } else {
        const nextDimCode = drill.drillDimArr[drill.number - 1]
        const nextDimName = drill.drillRoadArr[drill.number - 1]
        filter.drill = {
          dimValueId: drill.drillDimValArr[drill.number - 1],
          drillDimCode: drill.drillDimArr[drill.number - 2],
          drillPath: drill.pathCode,
          drillNumber: 1,
          nextDimCode,
          nextDimName
        }
      }
      this.filter = filter
      this.resetData()
      this.initData()
    },
    // 清空数据
    resetData() {
      // 置空数据
      this.paging.page = 1
      this.paging.total = 0
      this.tableData = []
    },
  },
  props: {
    // 禁止导出按钮
    exportDisable: {
      default: false
    },
    designConfig: {
      default() {}
    },
    designLimit: {
      default: 5000
    },
    businessType: {
      default: ''
    },
    report: {
      default() {
        return {
          versionId: '',
          reportId: '',
        }
      }
    }
  },
  watch: {
    designConfig(val) {
      this.initTableDesign(val)
    }
  },
  created() {
    if (this.designConfig) {
      this.initTableDesign(this.designConfig)
    }
    setTimeout(() => {
      this.alertCanShow = true
    }, 300)
  }
}

</script>

<style>
.hottable-filter .ivu-input-icon-normal + .ivu-input {
  padding-right: 20px;
}
.hottable-filter .ivu-input-icon {
  width: 20px;
}
</style>

<style scoped>
.hottable-querylist___title {
  margin-right: 10px;width: 58px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
}
.hottable-page {
  float:right;
  margin-top: .2rem;
  margin-bottom: .2rem;
}
.hottable__title {
  font-size: 16px;
  font-weight: 600;
}
.hottable-header {
  padding-top: .1rem;
  display: flex;
  align-items: center;
}
.hottable-filter {
  margin-bottom: .2rem;
}
.hottable-filter-left {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
}
.hottable-filter-right {
  text-align: center;
  align-self: flex-end;
}
.hottable {
  height: 100%;
}
. {
  margin-top: .1rem;
}
.hottable-querylist {
  margin-top: 10px;
  margin-right: 10px;
  display: flex;
  align-items: center;
}
.hottable-filter__datepicker {
  width: 160px;
}
</style>
