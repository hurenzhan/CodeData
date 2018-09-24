<template>
  <div>
    <div v-for="(dim, index) in showData" :key="index" class="linkCard">
          <p v-for="(metric, index) in getMetricsCodeArr" :key="index" >
            <span
               target="_blank"
               :title="dim[`${metric.code}Name`]"
               class="metric-name"
               :class="{'hyper-link': styleConfig.linkList.length !==0  && styleConfig.linkList[index] && styleConfig.linkList[index].reportName !== '' && styleConfig.linkList[index].reportVersion !== '' }"
               @click="aLink(index)">
               {{dim[`${metric.code}Name`]}}({{metric.unit}})
            </span>
            <span class="metric-code">{{dim[metric.code] | splitByComma}}</span>
            <span  v-if="styleConfig.metricPro === 'momRate' && styleConfig.isShowTrend === true &&  dim[metric.code] !== '' &&  dim[metric.code] !== undefined &&  dim[metric.code] !== '-' &&  dim[metric.code] !== ' - ' ">
              <img v-if="dim[`${metric.code}_2`] > 0" src="/static/charts/images/labelUp.svg" alt="">
              <img v-if="dim[`${metric.code}_2`] == 0" src="/static/charts/images/labelTied.svg" alt="">
              <img v-if="dim[`${metric.code}_2`] < 0" src="/static/charts/images/labelDown.svg" alt="">
            </span>
            <span v-if="styleConfig.metricPro === 'yeyRate' && styleConfig.isShowTrend === true &&  dim[metric.code] !== '' &&  dim[metric.code] !== undefined &&  dim[metric.code] !== '-' &&  dim[metric.code] !== ' - ' ">
              <img v-if="dim[`${metric.code}_4`] > 0" src="/static/charts/images/labelUp.svg" alt="">
              <img v-if="dim[`${metric.code}_4`] == 0" src="/static/charts/images/labelTied.svg" alt="">
              <img v-if="dim[`${metric.code}_4`] < 0" src="/static/charts/images/labelDown.svg" alt="">
            </span>
            <span v-if="styleConfig.metricPro === 'contraRate' && styleConfig.isShowTrend === true &&  dim[metric.code] !== ''&&  dim[metric.code] !== undefined &&  dim[metric.code] !== '-' &&  dim[metric.code] !== ' - ' ">
              <img v-if="dim[`${metric.code}_6`] > 0" src="/static/charts/images/labelUp.svg" alt="">
              <img v-if="dim[`${metric.code}_6`] == 0" src="/static/charts/images/labelTied.svg" alt="">
              <img v-if="dim[`${metric.code}_6`] < 0" src="/static/charts/images/labelDown.svg" alt="">
            </span>
            <span v-if="styleConfig.metricPro === 'proporRate' && styleConfig.isShowTrend === true &&  dim[metric.code] !== ''&&  dim[metric.code] !== undefined &&  dim[metric.code] !== '-' &&  dim[metric.code] !== ' - ' ">
              <img v-if="dim[`${metric.code}_8`] > 0" src="/static/charts/images/labelUp.svg" alt="">
              <img v-if="dim[`${metric.code}_8`] == 0" src="/static/charts/images/labelTied.svg" alt="">
              <img v-if="dim[`${metric.code}_8`] < 0" src="/static/charts/images/labelDown.svg" alt="">
            </span>
          </p>
          <p>
          <hr style="width:170px;margin-top:9px;height:2px;border:none;border-top:2px dashed #BBC1C4;">
           <span v-show="showTotal&&styleConfig.isShowTotal" class="total">合计</span>
           <span v-show="showTotal&&styleConfig.isShowTotal" class="sum">{{metricSum.toString() | splitByComma}}</span>
          </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LinkCard',
    props: {
      styleConfig:{},//样式相关
      showData:{},//查询数据
      getMetricsCodeArr:{} //指标
    },
    computed: {
      //合计
      metricSum(){
      let sum = 0;
       this.getMetricsCodeArr.map((item)=>{
          this.showData.map((v)=>{
            sum =  sum  +   Number(v[item.code])
          })
       })
       return sum
      },
      //指标单位不统一不显示合计
      showTotal(){
        const unitArr = []
        this.getMetricsCodeArr.map((item)=>{
          unitArr.push(item.unit)
       })
       if(new Set(unitArr).size === 1){
         return true
       }else{
         return false
       }
      }
    },
    methods: {
      aLink(i){
        if(this.styleConfig.linkList.length !==0  && this.styleConfig.linkList[i].reportName !== '' && this.styleConfig.linkList[i].reportVersion !== '')
        window.open(`?systemId=${this.$store.state.design.systemId}#/visual?reportId=${this.styleConfig.linkList[i].reportName}&versionId=${this.styleConfig.linkList[i].reportVersion}`);
      },

    },
    filters: {
      // 三位数字用，号隔开
      splitByComma (value) {
        if (value === undefined || value === "" || value === '-' || value ===  ' - ' || isNaN(value)) return ' - '
        if(value.length > 12) return Number(parseInt(value)).toLocaleString()
        return Number(value).toLocaleString()
      }
    }
  }
</script>


