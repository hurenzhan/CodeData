<template>
  <div class="label-style-wrapper">
    <div>
      <p class="label-name"><dot></dot>布局</p>
      <p class="label-layout">
        <el-radio v-model="showType" label="2">指标纵向</el-radio>
        <el-radio v-model="showType" label="1">指标横向</el-radio>
        <el-radio v-model="showType" :disabled="dimList.length !==0 " label="3">自动换行</el-radio>
      </p>
    </div>
    <div>
      <p class="label-name"><dot></dot>设计</p>
      <p class="label-design">
        <el-checkbox-group v-model="checkList" :max="4">
          <el-checkbox class="label-check" label="同比值"></el-checkbox>
          <el-checkbox class="label-check" label='同比率'></el-checkbox>
          <el-checkbox class="label-check" label='环比值'></el-checkbox>
          <el-checkbox class="label-check" label='环比率'></el-checkbox>
          <el-checkbox class="label-check" label='对比值'></el-checkbox>
          <el-checkbox class="label-check" label='对比率'></el-checkbox>
          <el-checkbox class="label-check" label='占比值'></el-checkbox>
          <el-checkbox class="label-check" label='占比率'></el-checkbox>
        </el-checkbox-group>
        <el-checkbox v-model="showNumb">显示整数</el-checkbox>
        <el-checkbox v-model="filterDimValueFlag" :disabled="dimList.length === 0 || dimValueFlag < 0">筛选维值</el-checkbox>
        <el-select
          v-model="selectedDimValue"
          multiple
          filterable
          collapse-tags
          size="mini"
          :disabled="!filterDimValueFlag"
          remote
          placeholder="请输入关键词"
          @change="changeDimValue"
          :remote-method="searchDimValueList">
          <el-option
            v-for="item in dimValueList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </p>
    </div>
  </div>
</template>

<script>
  import dot from '../../layout/right/focus/chartFocus/dot'
  import searchMixin from '../../../../api/search'
  import mixin from './mixin'
  import eventBus from '../../utils/eventBus'
  export default {
    name: 'LabelStyle',
    props: ['config'],
    mixins: [searchMixin, mixin],
    data () {
      return {
      }
    },
    components: {
      dot
    },
    computed: {
      // 显示模式,1横向，2纵向
      showType: {
        get () {
          return this.config.feature.styleConfig.showType || '1'
        },
        set (value) {
          this.$store.commit('showTypeToggle', {
            index: this.config.i,
            key: 'showType',
            value
          })
        }
      },
      // 选中指标属性
      checkList: {
        get () {
          return this.config.feature.styleConfig.checkList||[]
        },
        set (value) {
          this.$store.commit('showTypeToggle', {
            index: this.config.i,
            key: 'checkList',
            value
          })
        }
      },
      //显示整数
      showNumb: {
        get () {
          return this.config.feature.styleConfig.showNumb || false
        },
        set (value) {
          this.$store.commit('showNumbInt', {
            index: this.config.i,
            key: 'showNumb',
            value
          })
        }
      },
      filterDimValueFlag: {
        get () {
          return this.config.feature.styleConfig.filterDimValueFlag || false
        },
        set (value) {
          this.$store.commit('filterDimValue', {
            index: this.config.i,
            value
          })
          // 如果取消选中就把下拉框选中的维值清空
          if(!value) {
            const selectedDimValue = []
            this.$store.commit('selectDimValue', {index: this.config.i, selectedDimValue})
          } else {
            this.getDimListValue()
          }
          eventBus.$emit(`changeFilterData_${this.config.i}`, value)
        }
      },
      selectedDimValue: {
        get () {
          return this.config.feature.styleConfig.selectedDimValue || []
        },
        set (value) {
          this.$store.commit('selectDimValue', {
            index: this.config.i,
            selectedDimValue: value
          })
        }
      },
      dimValueList() {
        const [...dimValueList] = this.config.feature.styleConfig.dimValueList
        dimValueList.map(item=>{
          item.label = item.label.replace(/###/, '_')
          item.value = item.value.replace(/###/, '_')
        })
        return dimValueList || []
      },
      dimList () {
        return this.config.feature.dimList || []
      },
      dimValueFlag () {
        if(this.dimList.length !==0 ){
          return this.dimList[0].dimCode.indexOf('_WD_')
        }
        return this.config.feature.dimList || []
      },
      containerOption () {
        return this.$store.state.charts.chartsOption.filter(item => item.selected)[0]
      }
    },
    methods: {
      searchDimValueList(value) {
        if (value !== '' ) {
          this.getDimListValue(value)
        }
      },
      async queryData({ index, conditionListArr , value }) {
        let filterData = await this.updateDataPre({
          index,
          conditionListArr
        })
        if(filterData === undefined ||filterData.length === 0){
          filterData = []
          let data = []
          const reg = /(.+)_(.+)/
          value.map((item) => {
            this.dimValueList.forEach((e) => {
              if(item === e.value.match(reg)[1]){
                this.containerOption.feature.metricList.map((i)=>{
                    data = {
                    [this.dimList.length === 0 ? null : this.dimList[0].dimCode]:e.label,
                    [i.metricCode]:' - ',
                    [`${i.metricCode}Name`]:i.metricName,
                    dimName:e.label
                  }
                })
                filterData.push(data)
              }
            });
          })
          if(value.length === 0) {
            this.containerOption.feature.metricList.map((i)=>{
                    data = {
                    dimCode:null,
                    [i.metricCode]:' - ',
                    [`${i.metricCode}Name`]:i.metricName,
                    dimName:null
                  }
                })
            filterData.push(data)
          }
        }
        this.$store.commit('saveFilterData', { index: this.config.i, filterData })
        eventBus.$emit(`filterDimValue_${this.config.i}`)
      },
      changeDimValue(value) {
        // 当清空选项时重新请求列表
        if (value.length === 0) {
          this.getDimListValue(value)
        }
        const reg = /(.+)_(.+)/
        value = value.map(item => {
          return item.match(reg)[1]
        })
        let condiComparedValue = value.toLocaleString()
        let condiCode = this.dimList[0].dimCode
        let conditionListArr = [{condiCode, condiComparedValue, condiRateType: 0, condiType: 0, operator: 6 }]
        this.queryData({index: this.config.i, conditionListArr,value})
      }
    },
    mounted() {
      this.$nextTick(() => {
        if (this.filterDimValueFlag && this.dimList.length !== 0 && this.dimValueFlag >= 0) {
          this.getDimListValue()
        }
      })
    }
  }
</script>

<style lang="less">
  .label-style-wrapper{
    padding: 0 27px;
    .el-select{
      margin-top: 5px;
    }
    .el-radio__label {
      font-size: 14px;
      padding-left: 6px;
    }
    .el-radio+.el-radio {
      margin-left: 0px;
    }
    .el-select__tags span{
    .el-tag--mini:first-child{
      .el-select__tags-text{
        display: inline-block;
        width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: middle;
      }
    }
  }
    .label-name {
      color: #666;
      font-size: 14px;
      padding: 5px 0;
    }
    .label-layout{
      float: left;
      position: relative;
      padding-bottom: 10px;
      margin-left: 14px;
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        right: -27px;
        height: 1px;
        background: #E1E3E3;
        width: 116%;
      }
    }
    .label-design{
      display: flex;
      flex-direction: column;
      margin-left: 14px;
      label{
        margin-left: 0;
      }
      .label-check{
        margin-right: 10px;
      }
    }
  }
</style>
