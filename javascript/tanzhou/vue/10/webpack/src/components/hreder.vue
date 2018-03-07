<template>
  <div>
    <!--<img src="/static/18560855790257725.gif" alt="">-->
    这里是头部{{ aaaa }}
    <ul>
      <li v-for="item in nav"><router-link :to="`/xxxx/${item.id}.html`">{{item.title}}</router-link></li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: ['aaaa'],
    data () {
      return {
        nav: [
          { title: '首页', id: '/', img: 'xxx,jpg' },
          { title: 'a', id: '/a' },
          { title: 'b', id: '/b' }
        ]
      }
    }
  }
</script>
