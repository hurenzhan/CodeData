<template>
  <div class="design-center" :class="{'left-toggle': this.$store.state.design.leftToggle === true, 'right-toggle': this.$store.state.design.rightToggle === true}">
    <Row type="flex"  class="row-span">
      <Col span="2" class="left-panel">
        {{ firstLineText }}
      </Col>
      <Col span="22">
      <!-- {{ columnList }} -->
        <draggable
          :options="options"
          class="drag-in-area"
          v-model="columnList"
          @change="handleChange('column', $event)">
          <el-tag 
            @close="handleClose('column', item)"
            v-show="item.type !== 3"
            closable
            type="info"
            size="small"
            v-for="(item, index) in columnList"
            :key="index">{{ item.type !== 2 ? item.name : item.cusName }} | {{ index | turnToAbc }}</el-tag>
        </draggable>
      </Col>
    </Row>
    <Row type="flex"  class="row-span" v-if="reportType == 2">
      <Col span="2" class="left-panel">
        列维度
      </Col>
      <Col span="22">
      <!-- {{ leftDimList.filter(v => v.type === 0).map(v => v.id) }} -->
        <Select
          style="width: 200px"
          @on-change="handleDim"
          :value="columnDim.dim.id">
          <Option
            v-for="item in leftDimList.filter(v => v.type === 0)"
            v-if="item.id !== 'dasp_date'"
            :key="item.id"
            :value="item.id"
            placeholder="请选择列维度">
            {{ item.name }}
          </Option>
        </Select>
        <!-- 支持多选和远程搜索 -->
        <Select
          style="width: 500px"
          id="selectDimValue"
          placeholder="请选择维值"
          :value="columnDim.dimValue"
          @on-change="handleDimvalue"
          multiple
          filterable
          remote
          :loading="loading1"
          :label="columnDim.dimValue"
          :remote-method = "(query => queryDim(columnDim.dim.id, query))">
          <Option
            v-for="(item, index) in dimValueList"
            :key="index"
            :value="item.dimValueNm">
            {{ item.dimValueNm }}
          </Option>
        </Select>
      </Col>
    </Row>
    <Row type="flex"  class="row-span" v-if="reportType == 2">
      <Col span="2" class="left-panel">
        交叉指标
      </Col>
      <Col span="22">
        <Select
          style="width: 200px"
          placeholder="请选择交叉指标"
          :value="crossOnlyMetric.id"
          @on-change="handleCrossMetric">
          <Option
            v-for="item in metrics"
            :key="item.id"
            :value="item.id">
            {{ item.name }}
          </Option>
        </Select>
      </Col>
    </Row>
     <Row type="flex"  class="row-span">
      <Col span="2" class="left-panel">
        查询条件
      </Col>
      <Col span="22">
      <!-- {{ queryList }} -->
        <draggable
          :options="options"
          class="drag-in-area"
          v-model="queryList"
          @change="handleChange('query', $event)">
          <el-tag
            @close="handleClose('query', item)"
            closable
            type="info"
            size="small"
            v-for="(item, index) in queryList"
            :key="index">{{ item.name }}</el-tag>
        </draggable>
      </Col>
    </Row>
     <Row type="flex"  class="row-span">
      <Col span="2" class="left-panel">
        过滤条件
      </Col>
      <Col span="22">
        <draggable
          :options="options"
          class="drag-in-area"
          v-model="filterList"
          @change="handleChange('filter', $event)">
          <el-tag
            @close="handleClose('filter', item)"
            closable
            type="info"
            size="small"
            v-for="(item, index) in filterList"
            :key="index">{{ item.name  }} </el-tag>
        </draggable>
      </Col>
    </Row>
    <Row type="flex"  class="row-span">
      <Col span="2" class="left-panel">
        默认时间
      </Col>
      <Col span="22">
        <Select v-model="timeDistance" style="width:20%" size="small">
          <Option v-for="item in timeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Col>
    </Row>
    <Row type="flex"  class="row-span">
      <Col span="2" class="left-panel">
        分页设置
      </Col>
      <Col span="22">
        <Select v-model="pageSize" style="width:20%" size="small">
          <Option v-for="item in dividePage" :value="item.value" :key="item.value">{{ item.name }}</Option>
        </Select>
      </Col>
    </Row>
    <Row>
      <Col span="2" class="left-panel">报表功能</Col>
      <Col span="16">
        <RadioGroup v-model="reportFunction" @on-change="dimSegmentation">
          <Radio class="radio-justice" :label="0">
            <span>固定报表</span>
          </Radio>
          <Radio class="radio-justice" :label="1" :disabled="this.$store.state.design.tableHeaderActive || (this.$store.state.design.drill.selectedDrillItem.id !== '' &&  this.$store.state.design.drill.dirllRoad.routeCode)">
            <el-tooltip v-if="this.$store.state.design.tableHeaderActive || (this.$store.state.design.drill.selectedDrillItem.id !== '' &&  this.$store.state.design.drill.dirllRoad.routeCode)" class="item" effect="dark" placement="bottom-start">
            <div slot="content">维度切分不能与自定义表头同时生效 <br/>维度切分不能与上卷下钻同时生效</div>
            <span>维度切分</span>
            </el-tooltip>
            <span v-else>维度切分</span>
          </Radio>
        </RadioGroup>
        <!-- <Checkbox style="display: inline-block;padding-left: 4px;" class="export-styles" v-model="getExportData">数据导出</Checkbox> -->
      </Col>
    </Row>
    <Row>
      <Col class="table-wrapper">
        <!-- <Table border :columns="columnList"></Table> -->
        <!-- <testEditableTable style="margin-bottom: 50px;"></testEditableTable> -->
        <handsontable style="margin-bottom: 10px;"></handsontable>
       <!--  <el-table
          border
          v-if="!this.tableHeaderActive"
          style="width: 100%;">
          <el-table-column
            v-for="(k, index) in columnList"
            :key="index"
            :label="calcLabelForUnit(k)"
            align="center"
            min-width="180"
            :prop ="JSON.stringify({ id: k.id, type: k.type, name: k.name ? k.name : k.cusName})"
            :render-header="renderHeader"></el-table-column>
        </el-table> -->
      </Col>
    </Row>
  </div>
</template>

<script>
/* eslint-disable */
  import api from '@/web-design/api/design'
  import draggable from 'vuedraggable'
  import _uniqBy from 'lodash.uniqby'
  import _differenceBy from 'lodash.differenceby'
  import { mapMutations } from 'vuex'
  import { Tag, Table, TableColumn } from 'element-ui'
  import testEditableTable from '../editableTable'
  import handsontable from '../handsontable'
  import methods from './mixin'
  import computed from './computed'

  export default {
    name: 'design-center',
    mixins: [methods, computed],
    components: {
      draggable,
      elTag: Tag,
      elTable: Table,
      elTableColumn: TableColumn,
      testEditableTable,
      handsontable
    },
    filters: {
      turnToAbc(index) {
        const char = String.fromCharCode(65 + index)
        return `${char}`
      }
    },
    watch: {
      // 检查维值中是否有空值
      columnDim(val) {
        if (val && val.dimValue && val.dimValue.length) {
          this.$store.commit('clearEmptyDimValue')
        }
      },
      columnList: { // 日 TG_00000004 ，月 TG_00000005 ，年 TG_00000006
      // 字段timeGranularity，timeGranularityName
        handler(val, oldvalue) {
          // console.log(val)
          // console.log(oldvalue)
          
          // 初始化进来不要执行 不然会把保存的合并单元格配置去掉
          // if (!this.isMounted) {
          //   this.$store.commit('clearHeaderConfig')
          // }
          this.isMounted = false
          const flag = {
            year: 0,
            month: 0,
            day: 0
          }
          for (let i = 0; i < val.length; i += 1) {
            if (val[i].timeGranularity === 'TG_00000006') {
              flag.year += 1
            } else if (val[i].timeGranularity === 'TG_00000005') {
              flag.month += 1
            } else if (val[i].timeGranularity === 'TG_00000004') {
              flag.day += 1
            }
          }
          if (flag.year > 0) {
            this.timeList = [
              {
                value: 'year',
                label: '上一年',
                name: '年'
              }
            ]
            return false
          }
          if (flag.month > 0) {
            this.timeList = [
              {
                value: 'month',
                label: '上一月',
                name: '月'
              },
              {
                value: 'year',
                label: '上一年',
                name: '年'
              }
            ]
            return false
          }
          if (flag.day > 0) {
            this.timeList = [
              {
                value: 'day',
                label: '上一日',
                name: '日'
              },
              {
                value: 'month',
                label: '上一月',
                name: '月'
              },
              {
                value: 'year',
                label: '上一年',
                name: '年'
              }
            ]
            return false
          }
          // console.log(flag)
          return true
        },
        deep: true
      },
      timeList: {
        handler(val) {
          this.$store.commit('handleTimeList', val)
        },
        deep: true
      }
    },
    mounted() {
      // 问题: 创建交叉表时,store中timeList为空
      this.$store.commit('handleTimeList', this.timeList)
    },
    data() {
      return {
        isMounted: true,
        loadingStatus: false,
        dimValueList: [],
        leftToggle: false,
        loading1: true,
        dividePage: [
          {
            name: '显示10条',
            value: 10
          },
          {
            name: '显示20条',
            value: 20
          },
          {
            name: '显示50条',
            value: 50
          },
          {
            name: '显示100条',
            value: 100
          },
          {
            name: '全部显示',
            value: 0
          }
        ],
        options: {
          group: {
            name: 'drag-item',
            pull: false,
            put: true
          },
          sort: true
        },
        timeList: [
          {
            value: 'year',
            label: '上一年',
            name: '年'
          },
          {
            value: 'month',
            label: '上一月',
            name: '月'
          },
          {
            value: 'day',
            label: '上一日',
            name: '日'
          }
        ],
        reportType: this.$route.query.reportType
      }
    },
    methods: {

      // 更改交叉指标
      handleCrossMetric(data) {
        if ( data ) {
          let config
          // 指标
          this.metrics.forEach(v => {
            if (data === v.id) {
              config = {
                id: v.id,
                name: v.name,
                type: 1,
                unitDefaultNm: v.unitDefaultNm
              }
            }
          })
          this.$store.commit('handleCrossMetricChange', config)
          const payloadQuery = {}
          payloadQuery.type = 'query'
          payloadQuery.item = null
          this.$store.commit('syncQuery', payloadQuery)
          const payloadFilter = {}
          payloadFilter.type = 'filter'
          payloadFilter.item = null
          this.$store.commit('syncSelected', payloadFilter)
          this.$store.commit('reNewHandsontable', false)
        }
      },
      // renderHeader(h, { column, $index }) {
      //   let header = ""
      //   const label = column.label.split(",")
      //   if (label[1] == 'undefined') {
      //     header = label[0]
      //   } else {
      //     header = label[0] + "("+ label[1] + ")"
      //   }

      //   return h('div', {
      //     domProps: {
      //       title: `${header} | ${String.fromCharCode(65 + $index)}`
      //     },
      //   }, `${header} | ${String.fromCharCode(65 + $index)}`)
      // },
      handleClose(type, item) {
        switch (type) {
          case 'column': {
            const selectedId = this.$store.getters.getSelectedColumn.id
            if (item.id === selectedId) {
              this.$store.commit('removeSelectedValue')
            }
            // this.columnList.splice(item, 1)
            // type为0 ，就是删除行为
            const payload = {}
            payload.type = 0
            payload.item = item
            // 同步删除自定义列
            if (item.type === 2) {
              const id = item.id
              this.$store.commit('syncCustomColumn', id)
            }
            this.$store.commit('syncColumn', payload)
            // 分类汇总merge.vue数据要与删除columnList行为联动
            this.$store.commit('syncDelActionWithMerge', item)
            // 同步删除筛选/查询条件中的指标
            if (item.type === 1) {
              this.$store.commit('syncQueryAndFilterWithColumnList', item.id)
            }
            break
          }
          case 'query': {
            const payload = {}
            payload.type = 0
            payload.item = item
            this.$store.commit('syncQuery', payload)
            break
          }
          case 'filter': {
            const payload = {}
            payload.type = 0
            payload.item = item
            this.$store.commit('syncSelected', payload)
            break
          }
          default: {
            this.$Message.info('Oops, you just forget to import one param --> type')
            break
          }
        }
      },
      /**
       * type: String
       * data: Object
       * 用来处理重复添加和排序等行为
       */
      handleChange(type) {
        switch (type) {
          case 'column': {
            // debugger
            // 因为自定义列没有name属性，（来自iview 输入框使用v-model绑定item.name字段会失去焦点的bug）
            const aloneColumnList = _uniqBy(this.columnList, 'id')
            // console.log(aloneColumnList)
            if (aloneColumnList.length !== this.columnList.length) {
              this.$Message.warning('请不要重复添加列')
              this.columnList = aloneColumnList
            }
            break
          }
          case 'query': {
            const aloneQueryList = _uniqBy(this.queryList, 'name')
            if (aloneQueryList.length !== this.queryList.length) {
              this.$Message.warning('请不要重复添加查询条件')
              this.queryList = aloneQueryList
            }
            break
          }
          case 'filter': {
            // TODOS: filter处理情形与column和query并不相同，错误提示信息待改造
            /* const aloneFilterList = _uniqBy(this.filterList, 'name')
            if (aloneFilterList.length !== this.filterList.length) {
              this.$Message.warning('请不要重复添加过滤条件')
              this.filterList = aloneFilterList
            } */
            // 处理多组件同步选中列信息
            // this.syncSelected(this.filterList)

            break
          }
          default: {
            this.$Message.info('缺失type参数')
          }
        }
      }
    },
  }
</script>

<style scoped lang="less">
@import "element-ui/lib/theme-chalk/tag.css";
@import "element-ui/lib/theme-chalk/icon.css";
@import "element-ui/lib/theme-chalk/table.css";
@import "element-ui/lib/theme-chalk/table-column.css";
.right-toggle{
  margin-right: 35px;
}
.left-toggle{
  margin-left: 30px;
}
.left-panel{
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 80px;
}
.design-center .row-span{
  min-width: 200px;
  flex-wrap: nowrap;
  margin-bottom: 10px;
}
.drag-in-area{
  display: flex;
  align-items: center;
  width: 99%;
  padding: 0 6px 6px 6px;
  min-height: 32px;
  border: 1px dotted #dddee1;
  border-radius: 3px;
  overflow: auto;
  flex-wrap: wrap;
}
.radio-justice{
  margin-right: 30px;
}
.table-wrapper{
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 15px;
}
</style>
<style lang="less">
@tabMainColor: #00C5E1;
.row-span {
  .ivu-select-selection{
    background-color: #F5F5F5;
  }
  .ivu-tag:not(.ivu-tag-border):not(.ivu-tag-dot):not(.ivu-tag-checked) {
    background: transparent;
    border: 1px solid rgba(135,141,153,.2)
  }
}
.radio-justice{
  .ivu-radio{
    margin-right: 10px;
  }
}
.design-center{
  .ivu-table th{
    background-color: #FFF;
  }
  .ivu-table-tip table td{
    height: 160px;
  }
  .el-tag{
    margin: 6px 4px 0 0;
  }
  .el-table td, .el-table th {
    padding: 0;
  }
  .ivu-select-selection{
    max-height: 68px;
    overflow: auto;
  }
}
.export-styles{
  .ivu-checkbox{
    padding-right: 8px;
  }
}
</style>

