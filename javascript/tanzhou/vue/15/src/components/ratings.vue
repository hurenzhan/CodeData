<template>
  <div>ratings</div>
</template>
<script>
  import axios from 'axios'
  export default {
    props: ['datas'],
    data () {
      return {
        ratings: []
      }
    },
    mounted () {
      axios.get('/static/data.json').then(res => {
        this.ratings = res.data.ratings
      })
    },
    activated () {
      // 有没有被缓存都会执行这里
      console.log(222222222222222)
    }
  }
</script>
