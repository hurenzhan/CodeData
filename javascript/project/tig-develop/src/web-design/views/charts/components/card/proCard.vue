<template>
  <div>
    <div v-for="(dim, index) in showData" :key="index">
      <div v-for="(metric, index) in getMetricsCodeArr" :key="index">
          <p class="pro">
            <span :title="dim[`${metric.code}Name`]" class="metric-name">{{dim[`${metric.code}Name`]}}({{metric.unit}})</span>
            <span class="metric-code">{{dim[metric.code] | splitByComma}}</span>
            <span class="rate" v-if="styleConfig.metricPro === 'momRate'">
              <span class="rate-name">同比</span>
              <span class="rate-number">{{dim[`${metric.code}_2`] | percentage}}</span>
            </span>
            <span class="rate" v-if="styleConfig.metricPro === 'yeyRate'">
              <span class="rate-name">环比</span>
              <span class="rate-number">{{dim[`${metric.code}_4`] | percentage}}</span>
            </span>
            <span class="rate" v-if="styleConfig.metricPro === 'contraRate'">
              <span class="rate-name">对比</span>
              <span class="rate-number">{{dim[`${metric.code}_6`] | percentage}}</span>
            </span>
            <span class="rate" v-if="styleConfig.metricPro === 'proporRate'">
              <span class="rate-name">占比</span>
              <span class="rate-number">{{dim[`${metric.code}_8`] | percentage}}</span>
            </span>
          </p>
       </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ProCard',
    props: {
      styleConfig:{},//样式相关
      showData:{},//查询数据
      getMetricsCodeArr:{} //指标
    },
    computed: {

    },
    filters: {
      // 三位数字用，号隔开
      splitByComma (value) {
        if (value === undefined || value === "" || value === '-' || value ===  ' - ') return ' - '
        if(value.length > 12) return Number(parseInt(value)).toLocaleString()
        return Number(value).toLocaleString()
      },
      // 指标属性百分比转换
      percentage (value) {
        if (value === undefined){
          return ' - '
        }else{
          const num = (value * 100).toString().substring(0,(value * 100).toString().indexOf('.'));
          if(num.length <=3){
             return (Number(value) * 100).toFixed(2) + '%'
          }
          if(num.length === 4){
             return (Number(value) * 100).toFixed(1) + '%'
          }
          if(num.length >= 5){
             return (Number(value) * 100).toFixed(0) + '%'
          }
        }
      }
    }
  }
</script>


