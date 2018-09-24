<template>
  <div>
     <p v-for="(item, index) in report.createUser" :key="index">
        <span v-if="showIndex === index ">{{item}}</span>
     </p>
  </div>
</template>

<script>

export default {
  name: 'createUser',
  data() {
    return {
      showIndex : 0
    }
  },
  props: {
    report: Object, // 当前操作的报表对象
    operateObj: {}, // 当前用户操作的报表对象
  },
  mounted() {
    this.showIndex = 0
  },
  watch: {
    operateObj: function() {
      const operateReportId = this.operateObj.reportId
      if (operateReportId == this.report.reportId) {
          this.showIndex = this.operateObj.index
      }
    }
  }
}
</script>

