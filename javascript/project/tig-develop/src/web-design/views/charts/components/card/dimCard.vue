<template>
  <div>
    <div class="dim-item">
      <p class="dim">
         <span :title="dimName" class="dim-name">{{dimName | sliceDimName}}</span>
      </p>
      <div class="metric">
        <p v-for="(metric, index) in getMetricsCodeArr" :key="index">
          <span :title="dim[`${metric.code}Name`]" class="metric-name">{{dim[`${metric.code}Name`].slice(0,7)}}({{metric.unit| unitFilter}})</span>
          <span class="metric-code">{{dim[metric.code] | splitByComma}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DimCard',
    props: {
      styleConfig: {}, // 同环占对的显示toggle
      dim:{},//维度
      dimName:{}, //维度名称
      getMetricsCodeArr:{} //指标
    },
    computed: {
    },
    filters: {
      //维值过长截取前8位
      sliceDimName(value) {
        const namePattern = new RegExp(/^\w+###/);
        const expDate = new RegExp(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/);
        const expHour = new RegExp(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+[0-5]\d$/);
        if(expDate.test(value)||expHour.test(value)) return value
        if (namePattern.test(value)) return value.replace(namePattern, '').slice(0,8)
        if (value === undefined || value === " " || value === "" || value === '-' || value ===  ' - ') return '-'
      },
      // 三位数字用，号隔开
      splitByComma (value) {
        if (value === undefined || value === "" || value === '-' || value ===  ' - ') return ' - '
        if(value.length > 12) return Number(parseInt(value)).toLocaleString()
        return Number(value).toLocaleString()
      },
      // 无单位显示为'-'
      unitFilter (value) {
        if (value === undefined || value === " " || value === "" || value === '-' || value ===  ' - ') return '-'
        return value
      }
    }
  }
</script>


