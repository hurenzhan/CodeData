<template>
  <div>
    <p>{{cart}}</p>
    <p>{{vxcart}}</p>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  export default {
    props: ['cart'],
    computed: {
      ...mapState([
        'vxcart'
      ])
    }
  }
</script>
