<template>
  <div>
    <div class="ranking-item" :class="{'top-tree':serialNumber <= 2}">
      <img v-show="serialNumber === 0 && sortType === 1" class="ranking-img" src="/static/charts/images/first.svg" alt="">
      <img v-show="serialNumber === 1 && sortType === 1" class="ranking-img" src="/static/charts/images/second.svg" alt="">
      <img v-show="serialNumber === 2 && sortType === 1" class="ranking-img" src="/static/charts/images/third.svg" alt="">
      <img v-show="serialNumber === 0 && sortType === 0" class="ranking-img" src="/static/charts/images/last.svg" alt="">
      <img v-show="serialNumber === 1 && sortType === 0" class="ranking-img" src="/static/charts/images/lastButOne.svg" alt="">
      <img v-show="serialNumber === 2 && sortType === 0" class="ranking-img" src="/static/charts/images/lastButTwo.svg" alt="">
      <p class="serial">
        <img src="/static/charts/images/ranking.svg" alt="">
        <span>No.{{serialNumber + 1}}</span>
      </p>
      <span class="dim">{{dimName | sliceDimName}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RankingCard',
    props: {
      sortType:{},
      serialNumber:{},
      dimName:{}, //维度名称
    },
    filters: {
      //维值过长截取前8位
      sliceDimName(value) {
        const namePattern = new RegExp(/^\w+###/);
        const expDate = new RegExp(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/);
        const expHour = new RegExp(/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+[0-5]\d$/);
        if(expDate.test(value)||expHour.test(value)||!namePattern.test(value)) return value
        if (namePattern.test(value)) return value.replace(namePattern, '').slice(0,8)
        if (value === undefined || value === " " || value === "" || value === '-' || value ===  ' - ') return '-'
      }
    }
  }
</script>


