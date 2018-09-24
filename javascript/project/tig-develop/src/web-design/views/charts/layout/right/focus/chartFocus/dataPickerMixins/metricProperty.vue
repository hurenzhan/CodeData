<template>
  <el-popover
    :width="popoverWidth"
    :ref="'metricPopover_'+metricIndex"
    @show="handleShow"
  >
    <div @click.stop slot="reference" class="metric-property-img"><img src="/static/charts/images/metric-more.png" alt=""></div>
    <div class="metric-property-popper-content">
      <el-tree
        :data="metricFeatureTree"
        show-checkbox
        node-key="id"
        ref="tree"
        check-strictly
        :expand-on-click-node="true"
        :default-checked-keys="metricFeatureChecked"
        @check-change="metricCheckChange"
        :props="defaultProps">
      </el-tree>
      <p class="line"></p>
      <p class="unit">
        <span>单位 </span>
        <el-select v-model="unitSelected" size="mini">
          <!--
          <el-option
            v-for="item in metric.mulUnits"
            :key="item.unitCode"
            :label="item.unitNm"
            :value="item.unitCode"
          >
          </el-option>
          /-->
          <el-option
            v-for="(item, index) in metric.mulUnits"
            :key="index"
            :label="item.unitNm"
            :value="item.unitCode"
          >
          </el-option>
        </el-select>
      </p>
    </div>
  </el-popover>
</template>

<script>
  import {MFSelected1, MFSelected2, getCrossDimList} from '../../../../../utils/utils'

  export default {
    name: 'MetricProperty',
    props: {
      index: {}, // 容器index
      metricIndex: {}, // 指标的index
    },
    data () {
      return {
        popoverWidth: 160, // popover的宽度
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    computed: {
      containerMetricList () {
        return this.$store.state.charts.chartsOption[this.index].feature.metricList
      },
      metric () {
        return this.$store.state.charts.chartsOption[this.index].feature.metricList[this.metricIndex]
      },
      metricFeature () {
        return this.metric.feature
      },
      metricFeatureChecked: {
        get () {
          let arr = []
          for(let i in this.metricFeature){
            if(this.metricFeature[i]){
              arr.push(i)
            }
          }
          return arr
        },
        set (value) {}
      },
      value1: {
        get () {
          return this.metricFeature.value1
        },
        set (value) {
          // this.syncMetricFeature('value1', value)
        }
      },
      value2: {
        get () {
          return this.metricFeature.value2
        },
        set (value) {
          // this.syncMetricFeature('value2', value)
        }
      },
      value3: {
        get () {
          return this.metricFeature.value3
        },
        set (value) {
          // this.syncMetricFeature('value3', value)
        }
      },
      value4: {
        get () {
          return this.metricFeature.value4
        },
        set (value) {
          // this.syncMetricFeature('value4', value)
        }
      },
      value5: {
        get () {
          return this.metricFeature.value5
        },
        set (value) {
          // this.syncMetricFeature('value5', value)
        }
      },
      value6: {
        get () {
          return this.metricFeature.value6
        },
        set (value) {
          // this.syncMetricFeature('value6', value)
        }
      },
      value7: {
        get () {
          return this.metricFeature.value7
        },
        set (value) {
          // this.syncMetricFeature('value7', value)
        }
      },
      value8: {
        get () {
          return this.metricFeature.value8
        },
        set (value) {
          // this.syncMetricFeature('value8', value)
        }
      },
      value9: {
        get () {
          return this.metricFeature.value9
        },
        set (value) {
          // this.syncMetricFeature('value9', value)
        }
      },
      value1_1: {
        get () {
          return this.metricFeature.value1_1
        },
        set (value) {
          // this.syncMetricFeature('value1_1', value)
        }
      },
      value6_1: {
        get () {
          return this.metricFeature.value6_1
        },
        set (value) {
          // this.syncMetricFeature('value6_1', value)
        }
      },
      value6_2: {
        get () {
          return this.metricFeature.value6_2
        },
        set (value) {
          // this.syncMetricFeature('value6_2', value)
        }
      },
      value6_3: {
        get () {
          return this.metricFeature.value6_3
        },
        set (value) {
          // this.syncMetricFeature('value6_3', value)
        }
      },
      // 选中的单位
      unitSelected: {
        get () {
          return this.metric.unitSelected
        },
        set (value) {
          this.$store.commit('unitChange', {
            index: this.index,
            metricIndex: this.metricIndex,
            value
          })
        }
      },
      // 同环占的disabled
      disabled1 () {
        return MFSelected1(this.containerMetricList)
      },
      // 对比的disabled
      disabled2 () {
        return MFSelected2(this.containerMetricList)
      },
      // 判断交叉维度中是否有门店(可比)
      isComparable(){
        let crossDimList = getCrossDimList(this.$store.state.charts.dataSet, this.containerMetricList)
        return crossDimList.filter(v => v.dimName === '门店' || v.dimName === '大区' || v.dimName === '城市公司').length > 0 ? true : false
      },
      // 树形图数据
      metricFeatureTree() {
        return [{
          id: 'value1',
          label: '本期',
          children: [{
            id: 'value1_1',
            label: '可比额',
            disabled: !this.value1 || !this.isComparable || !(this.value2 || this.value3 || this.value4 || this.value5 || this.value6 || this.value7) || ((this.value2 || this.value3) && (this.value4 || this.value5))
          }]
        },{
          id: 'value2',
          label: '同比值',
          disabled: this.disabled1 || (this.value1_1 && (this.value4 || this.value5))
        },{
          id: 'value3',
          label: '同比率',
          disabled: this.disabled1 || (this.value1_1 && (this.value4 || this.value5))
        },{
          id: 'value4',
          label: '环比值',
          disabled: this.disabled1 || (this.value1_1 && (this.value2 || this.value3))
        },{
          id: 'value5',
          label: '环比率',
          disabled: this.disabled1 || (this.value1_1 && (this.value2 || this.value3))
        },{
          id: 'value6',
          label: '对比值',
          disabled: this.disabled2,
          children: [{
            id: 'value6_1',
            label: '可比额',
            disabled: !this.value6 || !this.isComparable
          },{
            id: 'value6_2',
            label: '可比差额',
            disabled: !this.value6 || !this.isComparable
          },{
            id: 'value6_3',
            label: '可比率',
            disabled: !this.value6 || !this.isComparable
          },{
            id: 'value6_4',
            label: '增量',
            disabled: !this.value6 || !this.value1
          }]
        },{
          id: 'value7',
          label: '对比率',
          disabled: this.disabled2
        },{
          id: 'value8',
          label: '占比值'
        },{
          id: 'value9',
          label: '占比率'
        }]
      }
    },
    methods: {
      // 指标属性变化时触发
      metricCheckChange(node,value,child){
        if(!value){
          switch(node.id){
            case 'value1':
              this.disableAttr('value1_1')
            case 'value2':
              if(!this.value3 && !this.value4 && !this.value5) this.disableAttr('value1_1')
            case 'value3':
              if(!this.value2 && !this.value4 && !this.value5) this.disableAttr('value1_1')
            case 'value4':
              if(!this.value2 && !this.value3 && !this.value5) this.disableAttr('value1_1')
            case 'value5':
              if(!this.value2 && !this.value3 && !this.value4) this.disableAttr('value1_1')
            case 'value6':
              this.disableAttr('value6_1')
              this.disableAttr('value6_2')
              this.disableAttr('value6_3')
              if(!this.value7) this.disableAttr('value1_1')
            case 'value7':
              if(!this.value6) this.disableAttr('value1_1')
            default :
              break
          }
        }
        // 多个图表切换时会高亮更新按钮，暂不知原因，先做判断
        let compareArr = []
        this.$refs.tree.getCheckedNodes().map(v =>{
          compareArr.push(v.id)
        })
        if(JSON.stringify(compareArr) !== JSON.stringify(this.metricFeatureChecked)){
          this.$nextTick(()=>{
            this.syncMetricFeature(node.id, value)
            this.metricFeatureHandler()
          })
        }
      },
      // 同步指标的属性值
      syncMetricFeature (key, value) {
        this.$store.commit('metricFeatureChange', {
          index: this.index,
          metricIndex: this.metricIndex,
          key,
          value
        })
      },
      // 指标属性的显示与否改变时，的处理函数
      metricFeatureHandler (val) {
        this.$store.commit('updateBtnActiveToggle', {
          index: this.index,
          value: true
        })
        // 指标属性改变，将metricList复制一份，扁平化，将所有指标的属性伪装成指标
        this.$store.commit('metricListFlat', {index: this.index})
      },
      // 显示时触发，然后关闭其他popover
      // all 是否关闭所有popover
      handleShow (all) {
        if(!this.isComparable){
          this.disableAttr('value1_1')
          this.disableAttr('value6_1')
          this.disableAttr('value6_2')
          this.disableAttr('value6_3')
        }
        this.$parent.$children.forEach(item => {
          const theRef = item.$refs
          const theRefName = Object.keys(theRef)[1]
          if (theRefName && theRefName.includes('metricPopover_')) {
            if (Number(theRefName.slice(-1)) !== this.metricIndex) {
              if (theRef[theRefName]) {
                theRef[theRefName].showPopper = false
              }
            }
            if (all) {
              if (theRef[theRefName]) {
                theRef[theRefName].showPopper = false
              }
            }
          }
        })
      },
      // 禁用可比属性
      disableAttr(val){
        this.$refs.tree.setChecked(val, false)
        this.syncMetricFeature(val, false)
        this.$store.commit('metricListFlat', {index: this.index})
      }
    }
  }
</script>

<style lang="less">
  @img-width: 12px;
  .metric-property-img{
    position: relative;
    &:before{
      position: absolute;
      left: -7px;
      top: 4px;
      content: '';
      width: 1px;
      height: 60%;
      background-color: #B2B8BE !important
    }
    img{
      width: @img-width;
      height: @img-width;
      margin-right: 6px;
      margin-top: 5px;
    }
  }
  .metric-property-popper-content{
    display: flex;
    flex-direction: column;
    .el-checkbox+.el-checkbox{
      margin-left: 0;
    }
    p{
    }
    p.line{
      height: 1px;
      background: #DBDDDF;
      margin-bottom: 10px;
      margin-top: 6px;
    }
    p.unit{
      display: flex;
      justify-content: space-between;
      align-items: center;
      div.el-select{
        width: 65%;
      }
    }
    .el-tree{
      max-height: 260px;
      overflow: auto;
    }
  }
</style>