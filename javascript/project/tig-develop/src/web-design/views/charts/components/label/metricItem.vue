<template>
  <div>
    <div class="metric-item-top" :class="{radius:checkList.length !== 0}">
      <p class="metric" :title="name1">
        <span class="name1" :class="noValue">{{name1 | sliceDimName}}</span><span class="unit">&nbsp;({{unit}})</span>
      </p>
      <p v-if="!styleConfig.showNumb" class="number">
        <span class="num1" :title="num">{{num | splitByComma}}</span>
      </p>
      <p v-else class="number">
        <span class="num1" :title="num">{{num | numberToInt}}</span>
      </p>
    </div>
    <div class="metric-item-bottom" :class="{'no-padding':checkList.length === 0}">
      <p v-if="momValue >= 0" :class="{worth:momRate < 0}">
        <span>同比</span>
        <span>{{num2 | splitByComma}}</span>
      </p>
      <p v-if="momRate >= 0" :class="{worth:momValue < 0 ,rate:noValue<0,littleRate:momValue >= 0}">
        <span :class="{hideName:momValue >= 0}">同比</span>
        <span>{{num3 | percentToInt}}</span>
        <img v-if="num3>0" src="/static/charts/images/labelUp.svg" alt="">
        <img v-if="num3==0" src="/static/charts/images/labelTied.svg" alt="">
        <img v-if="num3<0" src="/static/charts/images/labelDown.svg" alt="">
      </p>
      <p v-if="yeyValue >= 0" :class="{worth:yeyRate < 0}">
        <span>环比</span>
        <span>{{num4 | splitByComma}}</span>
      </p>
      <p v-if="yeyRate >= 0" :class="{worth:yeyValue < 0 ,rate:noValue<0,littleRate:yeyValue >= 0}">
        <span :class="{hideName:yeyValue >= 0}">环比</span>
        <span>{{num5 | percentToInt}}</span>
        <img v-if="num5>0" src="/static/charts/images/labelUp.svg" alt="">
        <img v-if="num5==0" src="/static/charts/images/labelTied.svg" alt="">
        <img v-if="num5<0" src="/static/charts/images/labelDown.svg" alt="">
      </p>
      <p v-if="contrastsValue >= 0" :class="{worth:contrastsRate < 0}">
        <span>对比</span>
        <span>{{num6 | splitByComma}}</span>
      </p>
      <p v-if="contrastsRate >= 0" :class="{worth:contrastsValue < 0 ,rate:noValue<0,littleRate:contrastsValue >= 0}">
        <span :class="{hideName:contrastsValue >= 0}">对比</span>
        <span>{{num7 | percentToInt}}</span>
        <img v-if="num7>0" src="/static/charts/images/labelUp.svg" alt="">
        <img v-if="num7==0" src="/static/charts/images/labelTied.svg" alt="">
        <img v-if="num7<0" src="/static/charts/images/labelDown.svg" alt="">
      </p>
      <p v-if="proportionValue >= 0" :class="{worth:proportionRate < 0}">
        <span>占比</span>
        <span>{{num8 | splitByComma}}</span>
      </p>
      <p v-if="proportionRate >= 0" :class="{worth:proportionValue < 0 ,rate:noValue<0,littleRate:proportionValue >= 0}">
        <span :class="{hideName:proportionValue >= 0}">占比</span>
        <span>{{num9 | percentToInt}}</span>
        <img v-if="num9>0" src="/static/charts/images/labelUp.svg" alt="">
        <img v-if="num9==0" src="/static/charts/images/labelTied.svg" alt="">
        <img v-if="num9<0" src="/static/charts/images/labelDown.svg" alt="">
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MetricItem',
    props: {
      index: {}, // 容器index
      styleConfig: {}, // 同环占对的显示toggle
      name1: {},
      num1: {}, // 本期
      num2: {}, // 同比值
      num3: {}, // 同比率
      num4: {}, // 环比值
      num5: {}, // 环比率
      num6: {}, // 对比值
      num7: {}, // 对比率
      num8: {}, // 占比值
      num9: {}, // 占比率
      unit: {}  // 指标单位
    },
    computed: {
      checkList(){
       return this.styleConfig.checkList || []
      },
      noValue(){
        return this.checkList.join('-').indexOf('值')
      },
       //同比值
      momValue(){
        return this.checkList.indexOf('同比值')
      },
      //同比率
      momRate(){
        return this.checkList.indexOf('同比率')
      },
      //环比值
      yeyValue(){
        return this.checkList.indexOf('环比值')
      },
      //环比率
      yeyRate(){
        return this.checkList.indexOf('环比率')
      },
      //占比值
      proportionValue(){
        return this.checkList.indexOf('占比值')
      },
      //占比率
      proportionRate(){
        return this.checkList.indexOf('占比率')
      },
      //对比值
      contrastsValue(){
        return this.checkList.indexOf('对比值')
      },
      //对比率
      contrastsRate(){
        return this.checkList.indexOf('对比率')
      },
      num(){
        if(this.unit === '%'&& !isNaN(parseInt(this.num1))){
          return this.num1 * 100
        }else{
          return this.num1
        }
      }
    },
    filters: {
      // 三位数字用，号隔开
      splitByComma (value) {
        if (isNaN(parseInt(value))) return ' - '
        return Number(value).toLocaleString()
      },
      // 没有数据时展示成--
      percentToInt (value) {
        if (isNaN(parseInt(value))){
          return ' - '
        }else{
          const  num = parseInt(value * 100).toString().length
          if( num <=3 ){
             return (Number(value) * 100).toFixed(2) + '%'
          }
          if( num === 4 ){
             return (Number(value) * 100).toFixed(1) + '%'
          }
          if( num >= 5 ){
             return (Number(value) * 100).toFixed(0) + '%'
          }
        }
      },
      // 指标展示整数部分
      numberToInt (value) {
        if (isNaN(parseInt(value))) return ' - '
         return Number(parseInt(value)).toLocaleString()
      },
      sliceDimName(value) {
        const expDate = new RegExp(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/);
        const expHour = new RegExp(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+[0-5]\d$/);
        if (value === undefined || value === " " || value === "" || value === '-' || value ===  ' - ') return '-'
        if(expDate.test(value)||expHour.test(value)) return value
        return value.slice(0,12)
      },
    }
  }
</script>


