<template>
  <div class="config-style-card my-slide-bar">
    <div class = "card-line">
      <div class="title-card"><span class="point"></span>设计</div>
      <div class="config-line">
        <div class="config-line-item">
          <div class="content">
            <el-radio v-model="cardType" @change="cardTypeChange"  label="1">维度卡片</el-radio>
            <el-radio v-model="cardType" @change="cardTypeChange" :disabled="cardTypeDisabled" label="2">属性卡片</el-radio>
            <el-radio v-model="cardType" @change="cardTypeChange" :disabled="cardTypeDisabled" label="3">链接卡片</el-radio>
            <el-radio v-model="cardType" @change="cardTypeChange" :disabled='sortType===2||isDimValue < 0||dimList.length!==1||metricList.length!==1' label="4">排名卡片</el-radio>
          </div>
        </div>
        <div class="config-line-item" v-show="cardType === '2'">
          <div class="content" style="margin-left: 25px">
              <el-radio v-model="metricPro"  label="momRate">同比</el-radio>
              <el-radio v-model="metricPro"  label="yeyRate">环比</el-radio>
              <el-radio v-model="metricPro"  label="contraRate">对比</el-radio>
              <el-radio v-model="metricPro"  label="proporRate">占比</el-radio>
          </div>
        </div>
        <div v-show="cardType === '3'">
          <div class="config-line-item">
            <el-checkbox :disabled="disabled" v-model="isShowTotal">合计</el-checkbox>
          </div>
          <div class="config-line-item">
            <el-checkbox v-model="isShowTrend">趋势标记</el-checkbox>
          </div>
          <div class="config-line-item" v-show="isShowTrend">
            <div class="content" style="margin-left: 20px">
              <el-radio v-model="metricPro"  label="momRate">同比</el-radio>
              <el-radio v-model="metricPro"  label="yeyRate">环比</el-radio>
              <el-radio v-model="metricPro"  label="contraRate">对比</el-radio>
              <el-radio v-model="metricPro"  label="proporRate">占比</el-radio>
            </div>
          </div>
          <div class="config-line-item">
            <el-checkbox v-model="isShowLink">添加链接</el-checkbox>
          </div>
          <div v-for="(linkItem, index) in linkList" :key="index" v-show="isShowLink">
             <div class="config-line-item">
                <label class="card-label"></label>
                <div class="content">
                    <span>{{linkItem.metricName}}</span>
                </div>
             </div>
             <div class="config-line-item">
              <label class="card-label"></label>
              <div class="content">
                <el-select
                  v-model="linkItem.reportName"
                  size="small"
                  placeholder="请选择报表名"
                  remote
                  filterable
                  :remote-method="(value) => {rmoteSearch(value, index)}"
                  @change="reportNameChange(index,linkItem.reportName)"
                  >
                  <el-option
                    v-for="item in linkItem.reportNameList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
             </div>
             <div class="config-line-item">
                <label class="card-label"></label>
                <div class="content">
                  <el-select
                    v-model="linkItem.reportVersion"
                    size="small"
                    placeholder="请选择版本号"
                    @change="reportVersionChange(index,linkItem.reportVersion)"
                    >
                    <el-option
                      v-for="item in linkItem.reportVersionList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
             </div>
          </div>
        </div>
        <div class="config-line-item" v-show="cardType === '4'">
          <label>排名数</label>
            <el-select  size="mini"  v-model="rankValue" placeholder="请选择" class="e-select">
              <el-option
                  v-for="item in rankOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/web-design/api/report'
import eventBus from '../../utils/eventBus'
export default {
  name: 'CardStyle',
  data() {
    return {
    }
  },
  computed: {
    // 选中容器的index
    index () {
      return this.$store.state.charts.chartsOption.filter(item => !item.drop && item.selected)[0].i
    },
    feature () {
      return this.$store.state.charts.chartsOption[this.index].feature
    },
    metricList(){
      return this.feature.metricList||[]
    },
    dimList(){
      return this.feature.dimList||[]
    },
    // 图标样式
    styleConfig () {
      return this.feature.styleConfig
    },
    linkList() {
      return this.styleConfig.linkList || []
    },
    sortType() {
       return this.$store.state.charts.chartsOption[this.index].sortType
    },
    isDimValue () {
        if(this.dimList.length !==0 ){
          return this.dimList[0].dimCode.indexOf('_WD_')
        }
    },
    disabled(){
       const unitArr = []
        this.metricList.map((item)=>{
          unitArr.push(item.mulUnits[0].unitNm)
       })
       if(new Set(unitArr).size === 1){
         return false
       }else{
         return true
       }
    },
    cardTypeDisabled(){
      if(this.dimList.length ===0){
        return false
      }else{
        return true
      }
    },
    rankOptions(){
       return this.styleConfig.rankOptions
    },
    cardType: {
        get () {
           return this.styleConfig.cardType
        },
        set (value) {
          this.$store.commit('showTypeToggle', {
            index: this.index,
            key: 'cardType',
            value
          })
        }
    },
    metricPro: {
        get () {
           return this.styleConfig.metricPro
        },
        set (value) {
          this.$store.commit('showTypeToggle', {
            index: this.index,
            key: 'metricPro',
            value
          })
        }
    },
    // 选中指标属性
    checkList: {
      get () {
        return this.styleConfig.checkList||[]
      },
      set (value) {
        this.$store.commit('showTypeToggle', {
          index: this.index,
          key: 'checkList',
          value
        })
      }
    },
    isShowTotal:{
       get () {
        if(this.disabled ===true){
          return false
        }
        return this.styleConfig.isShowTotal
      },
      set (value) {
        this.$store.commit('showTypeToggle', {
          index: this.index,
          key: 'isShowTotal',
          value
        })
      }
    },
    isShowTrend:{
       get () {
        return this.styleConfig.isShowTrend
      },
      set (value) {
        this.$store.commit('showTypeToggle', {
          index: this.index,
          key: 'isShowTrend',
          value
        })
      }
    },
    isShowLink:{
       get (value) {
        return this.styleConfig.isShowLink
      },
        set(value) {
          if (!value) {
            const  linkList = []
            this.$store.commit('saveLinkList', {
              index: this.index,
              key:'linkList',
              linkList:linkList
            })
          } else {
            if(this.linkList.length === 0){
               this.setLinkList() // 如果选中就去请求接口
            }
          }
          this.$store.commit('showTypeToggle', {
          index: this.index,
          key: 'isShowLink',
          value
        })
      }
    },
    rankValue:{
      get () {
        return this.styleConfig.rankValue
      },
      set (value) {
        this.$store.commit('showTypeToggle', {
          index: this.index,
          key: 'rankValue',
          value
        })
      }
    }
  },
  methods: {
    cardTypeChange(value) {
      this.$store.commit('showTypeToggle', {
        index: this.index,
        key: 'cardType',
        value
      })
    },
    rmoteSearch(value, index) {
      const [ ...linkList ] = this.linkList
      this.$nextTick(async () => {
        let res = await api.getLockedReportList({ params: { searchKey:value }})
        let reportNameList = []
        if (res && res.data) {
          res.data.forEach((item, index) => {
            let reportVersion = item.reportVersion.map(report => ({
              value: report,
              label: report
            }))
            reportNameList.push({value: item.reportId, label: item.reportName,  children: reportVersion})
          })
        }
        linkList[index].reportNameList = reportNameList
        this.$store.commit('saveLinkList', {
        index: this.index,
        key:'linkList',
        linkList
        })
      })
    },
    setLinkList (searchKey = '') {
      this.$nextTick(async () => {
        let res = await api.getLockedReportList({ params: { searchKey }})
        let reportNameList = []
        if (res && res.data) {
          res.data.forEach((item, index) => {
            let reportVersion = item.reportVersion.map(report => ({
              value: report,
              label: report
            }))
            reportNameList.push({value: item.reportId, label: item.reportName,  children: reportVersion})
          })
        }
        const linkList = []
        this.metricList.map((item, index)=>{
          linkList.push({
            metricName:item.metricName,
            reportName : '',
            reportNameList :reportNameList,
            reportVersion:'',
            reportVersionList: []
          })
        })
        this.$store.commit('saveLinkList', {
        index: this.index,
        key:'linkList',
        linkList
        })
      })
    },
    reportNameChange(index,value){
      const [ ...linkList ] = this.linkList
      linkList[index].reportVersion = ''
      linkList[index].reportName = value
      linkList[index].reportVersionList = linkList[index].reportNameList.filter(item => item.value === value)[0].children
      this.$store.commit('saveLinkList', {
        index: this.index,
        key:'linkList',
        linkList:linkList
      })
    },
    reportVersionChange(index,value){
      const [ ...linkList ] = this.linkList
      linkList[index].reportVersion = value
      this.$store.commit('saveLinkList', {
        index: this.index,
        key:'linkList',
        linkList:linkList
      })
    }
  },
  mounted() {
    if (this.styleConfig.isShowLink === true  && this.linkList.length === 0){
        this.setLinkList()
    }
  },
  watch: {
    metricList: {
      handler () {
        if(this.metricList.length !== this.linkList.length)
        this.setLinkList()
      },
      deep: true
    }
  },
}
</script>
<style  lang="less">
.config-style-card {
  height: calc(100vh - 300px);
  overflow-y: auto;
  overflow-x: hidden;
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #333;
  }
  .el-checkbox__label {
    color: #333333;
  }
  .el-radio+.el-radio {
    margin-left: 0px;
  }
  .el-radio {
    margin-right: 47px;
    margin-left: 1;
    color: #606266;
    font-weight: 500;
    line-height: 1;
    cursor: pointer;
    white-space: nowrap;
    outline: 0;
  }
  .el-input--small .el-input__inner {
    padding: 0;
    height: 32px;
    line-height: 32px;
  }
  .title-card {
    color: #666666;
    line-height: 20px;
    margin-top: 16px;
  }
  .card-line {
    border-top: 1px solid #e8eaeb;
    padding: 0px 0px 10px 0px;
    .point {
      display: inline-block;
      height: 6px;
      width: 6px;
      box-sizing: border-box;
      border-radius: 100%;
      background: #d8d8d8;
      vertical-align: top;
      margin: 6px 8px 6px 10px;
    }
    .config-line {
      .config-line-item {
        padding-top: 5px;
        padding-left: 25px;
        clear: both;
        .content {
          float: left;
        }
        .e-select {
            margin-left: 5px;
            width: 120px;
            min-height: 32px;
            height: 32px;
          }
      }
    }
  }
}
</style>
