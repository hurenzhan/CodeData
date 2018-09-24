<template>
  <div>
    <title-bar :title="titleInfo" :bread="[{link:'',name:'报表'},{link:'',name:'创建自定义报表'},{link:'',name:'指标详情'}]"></title-bar>
    <metricDetail  @receiveMsg="receiveMsg"></metricDetail>
  </div>
</template>

<script>
import metricDetail from '../metricDetails'

export default {
  name: 'metricDetails',
  data() {
    return {
      titleInfo: ''
    }
  },
  components: {
    metricDetail
  },
  methods: {
    receiveMsg(data) {
      this.titleInfo = data
    }
  }
}
</script>

