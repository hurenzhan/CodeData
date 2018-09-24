<template>
  <div class="table-style-wrapper my-slide-bar">
    <div class="table-style">
      <div class="style-title">
        <span class="point"></span>
        布局
      </div>
      <div class="page-style">
        <span>分页属性</span>
        <el-select
          size="small"
          v-model="pageSize"
          class="select-style"
          placeholder="请选择"
          @change="Change('pageSize', pageSize)">
          <el-option
            v-for="item in pageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="table-border">
        <el-checkbox
          v-model="tableBorder"
          @change="Change('tableBorder', tableBorder)"></el-checkbox>
          <span class="tablestyle-checkbox">边框</span>
      </div>
      <!-- 拆分 -->
      <div class="dimSplitWrap">
        <div class="splitItem">
          <label>拆分指标</label>
          <el-select v-model="dimSplit.metricSelected" 
            size="small" 
            clearable
            @change="dimSplit.dimCodeSelected = {};dimSplit.dimValueSelected = []" 
            placeholder="请选择">
            <el-option
              v-for="item in metricListFlatFilter"
              :key="item.metricCode"
              :label="item.metricName"
              :value="item.metricCode">
            </el-option>
          </el-select>
        </div>
        <div class="splitItem">
          <label>选择维度</label>
          <el-select 
            v-model="dimSplit.dimCodeSelected"
            size="small" 
            clearable
            value-key="dimCode"
            :disabled="!dimSplit.metricSelected"
            @change="getDimValueList" 
            placeholder="请选择">
            <el-option
              v-for="item in crossDimList"
              :key="item.dimCode"
              :label="item.dimName"
              :value="item">
            </el-option>
          </el-select>
        </div>
        <div class="dimValueWrap">
          <label>选择维值</label>
          <el-select 
            v-model="dimSplit.dimValueSelected" 
            size="small"
            clearable
            filterable
            remote
            :remote-method="getDimValueList"
            multiple
            value-key="dimValue"
            collapse-tags
            :multiple-limit="10"
            :disabled="!dimSplit.dimCodeSelected.dimCode"
            placeholder="请选择">
            <el-option
              v-for="(item, index) in dimSplit.dimValueList"
              :key="index"
              :label="item.dimValueNm.replace(/###/,'_')"
              :value="item">
            </el-option>
          </el-select>
        </div>
        <div class="splitItem">
          <el-button size="small" type="primary" :disabled="dimSplit.dimValueSelected.length === 0" @click="goSplit">确定</el-button>
        </div>
      </div>  

      <!-- <div class="is-proportion">
        <el-checkbox
          v-model="isExport"
          @change="Change('isExport', isExport)">
        </el-checkbox>
        <span class="tablestyle-checkbox">启用导出</span>   
      </div> -->
    </div>   
  </div>
</template>

<script>
  import bus from '../../utils/eventBus'
  import api from '@/web-design/api/charts'
  import {getCrossDimList} from '../../utils/utils'
  import _unionwith from 'lodash.unionwith'
  import _isEqual from 'lodash.isequal'
  export default {
    name: 'table-style',
    components: {
    },
    props: {
      index: {
        default: 0
      }
    },
    data() {
      return {
        pageOptions: [{
          value: 10,
          label: '10条'
        }, {
          value: 20,
          label: '20条'
        }, {
          value: 30,
          label: '30条'
        }, {
          value: 0,
          label: '不分页'
        }],
        tableBorder: true,
        pageSize: 10, // 分页 默认10
        // row: 1, // 表头行数
        // dialogVisible: false, // 模态框
        isExport: false,
        dimSplit:{ //拆分
          metricSelected: '',
          dimCodeSelected: {},
          dimValueList: [],
          dimValueSelected: []
        },
      }
    },
    computed: {
      chartsOption() {
        return this.$store.state.charts.chartsOption
      },
      selectedOption () {
        return this.chartsOption.filter(item => !item.drop && item.selected)[0]
      },
      crossDimList () {
        if (!this.selectedOption || !this.selectedOption.feature || !this.selectedOption.feature.metricList) {
          return
        }
        let crossDimListFilter = []
        let crossDimList = getCrossDimList(this.$store.state.charts.dataSet, this.selectedOption.feature.metricList)
        for (let i = 0; i < crossDimList.length; i += 1) {
          let isDimExist = false
          for (let j = 0; j < this.dimList.length; j += 1) {
            if (crossDimList[i].dimCode === this.dimList[j].dimCode) {
              isDimExist = true
              break
            } else {
              isDimExist = false
            }
          }
          if (!isDimExist) {
            crossDimListFilter.push(crossDimList[i])
          }
        }
        return crossDimListFilter
      },    
      dimList() {
        return this.chartsOption[this.index].feature.dimList
      },
      metricListFlat(){
        return this.chartsOption[this.index].feature.metricListFlat
      },
      metricListFlatFilter(){
        return this.chartsOption[this.index].feature.metricListFlat.filter(item => item.metricCode.slice(-2) !== '_x')
      },
      // 选中的容器
      selectedOption () {
        return this.$store.state.charts.chartsOption.filter(item => !item.drop && item.selected)[0]
      }
    },
    watch: {
      index(val, oldValue) {
        // 切换图表时
        const styleConfig = this.chartsOption[this.index].feature.styleConfig
        this.initState(styleConfig)   
      }
    },
    mounted() {
      const styleConfig = this.chartsOption[this.index].feature.styleConfig
      this.initState(styleConfig)
      // 接受清空配置
      bus.$on(`crossTableClearSettings`, (deliver) => {
        if (deliver.index === this.index) {
          this.clearState()
        }
      })
    },
    methods: {
      // 清空状态
      clearState() {
        // 初始化清空置为false
        Object.keys(this._data).forEach(v => {
          if (this._data[v] !== undefined && this._data[v] !== '' && typeof this._data[v] === 'boolean') {
            this[v] = false
          }
        })
        
        this.pageSize = 10
        // this.row = 1
        this.tableBorder = true
        this.isExport = false
        this.dimSplit.metricSelected = ''
        this.dimSplit.dimCodeSelected = {}
        this.dimSplit.dimValueList = []
        this.dimSplit.dimValueSelected = []
      },
      initState(styleConfig) {
        this.radioDisabled = false
        // this.clearState()
        // 初始化
        Object.keys(this._data).forEach(v => {
          if (v in styleConfig) {
            if (styleConfig[v] !== undefined) {
              this[v] = styleConfig[v]
            }
          }
          if(v === 'dimSplit'){
            this.dimSplit = styleConfig.splitInfo
            if(JSON.stringify(this.dimSplit) === "{}"){
              this.dimSplit = {
                metricSelected: '',
                dimCodeSelected: {},
                dimValueList: [],
                dimValueSelected: []
              }
            }
          }
        })
      },
      Change(name, value) {
        this.$store.commit('changeCrossOption', {
          index: this.index,
          name: name,
          value: value
        })
      },
      async getDimValueList(item){
        if (item === "") return this.dimSplit.dimValueSelected = []
        if(typeof(item) === 'string'){
          let res = await api.dimListValue({dimId: this.dimSplit.dimCodeSelected.dimCode, offset:0, limit:50,key:item})
          this.dimSplit.dimValueList = res ? res.data : []
        }else{
          this.dimSplit.dimValueSelected = []
          let res = await api.dimListValue({dimId: this.dimSplit.dimCodeSelected.dimCode, offset:0, limit:50,key:''})
          this.dimSplit.dimValueList = res ? res.data : []
        }
      },
      goSplit(){
        // console.log(this.dimSplit.dimValueList)
        // console.log(this.dimSplit.dimValueSelected)
        // debugger
        this.dimSplit.dimValueList = _unionwith(this.dimSplit.dimValueList, this.dimSplit.dimValueSelected, _isEqual)
        bus.$emit(`split${this.index}`, this.dimSplit)
      }
    },
    beforeDestroy() {
      bus.$off(`splitTableRow`)
      bus.$off(`crossTableClearSettings`)
    }
  }
</script>
<style scoped lang="less">  
  .el-collapse{
    width: 175px;
    display: inline-block;
    padding-left: 10px;
    border: none;
  }
  .table-style-wrapper{
    height: calc(100vh - 300px);
    overflow: auto;
    .table-style{

      font-size: 14px;
      .style-title {
        color: #666666;
        line-height: 20px;
        border-top: 1px solid #E8EAEB;
        padding: 10px 0px 0 0;
        .point{
          display: inline-block;
          height: 6px;
          width: 6px;
          box-sizing: border-box;
          border-radius: 100%;
          background: #d8d8d8;
          vertical-align: top;
          margin: 6px 8px 6px 10px;
        }
      }
      .select-style{
        width: 116px;
      }
      .before-tolal {
        width: 10px;
        margin-top: 10px;
        margin-left: 28px;
        margin-right: 30px;
      }
      .after-tolal {
        width: 10px;
        margin-top: 10px;
      }
      .page-style,
      .row-style,
      .show-picture{
        padding-top: 8px;
        padding-left: 25px;
      }
      .show-total,
      .show-header,
      .show-number,
      .input-number,
      .jump-detail,
      .table-border,
      .more-metric,
      .show-picture,
      .is-proportion,
      .freeze,
      .more-dim{
        span{
          padding-left: 6px;
        }
        .more-dim-select{
          display: block;
          width: 174px;
          padding-left: 23px;
          margin-top: 8px;
        }
        padding-left: 25px;
        padding-top: 8px;
      }
      .input-number{
        .input-style{
          width: 50px;
          padding-left: 5px;
          height: 23px;
        }
      }
      .dim-start-single{
        padding-left: 24px;
        padding-top: 8px;
      }
      .dimSplitWrap{
        padding: 4px 0;
        .splitItem{
          display: flex;
          align-items: center;
          margin-top: 10px;
          margin-left: 25px;
          .el-select{
            width: 116px;
            margin-left: 4px;
          }
        }
        .dimValueWrap{
          margin-top: 10px;
          margin-left: 25px;
          .el-select{
            width: 175px;
            margin-top: 8px;
          }
        }
      }
    }
  }
  
</style>