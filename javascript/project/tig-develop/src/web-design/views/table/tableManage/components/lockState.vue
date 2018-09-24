<template>
  <div>
    <div v-if="isPreVersion||report.isLock">
      <span class="commonStyle locked"></span>&nbsp;已锁定
    </div>
    <div v-if="!(isPreVersion||report.isLock)">
      <span class="commonStyle unlocked"></span>&nbsp;未锁定
    </div>
  </div>
</template>

<script>
export default {
  name: 'versionLockSelect',
  data() {
    return {
      isPreVersion: false, // 是否是之前的版本
    }
  },
  props: {
    report: Object, // 当前操作的报表对象
    operateObj: {}, // 当前用户操作的报表对象
  },
  methods: {
  },
  watch: {
    operateObj: function() {
      var operateVersion = this.operateObj.selectVersion
      var operateReportId = this.operateObj.reportId
      if (operateReportId == this.report.reportId) {
        if (operateVersion == this.report.reportVersion[0]) {
          this.isPreVersion = false
        } else {
          this.isPreVersion = true
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .commonStyle {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%
  }
  .locked {
    background-color: rgba(0, 0, 0, 0.25);;
  }
  .unlocked {
    background-color: #51A6FF;
  }
</style>
