<template>
  <div class="version-select">
    <el-select v-model="version" @change="selectChange(version)" size="medium" style="width: 100px">
      <el-option v-for="(item, index) in report.reportVersion" :key="index" :label="item" :value="item"></el-option>
    </el-select>
  </div>
</template>

<script>

export default {
  name: 'versionSelect',
  data() {
    return {
      version: ''
    }
  },
  props: {
    report: Object
  },
  mounted() {
    this.version = this.report.reportVersion[0]
  },
  methods: {
    // 选中项改变时触发
    selectChange(currentVersion) {
      let count = 0 ;
      this.report.reportVersion.map((item, index)=>{
          if(currentVersion === item){
              count = index
          }
      })
      var operateObj = {
        reportId: this.report.reportId,
        selectVersion: currentVersion,
        index:count
      }
      this.$emit('versionChange', operateObj)
    }
  }
}
</script>

<style lang="less">
  div.version-select {
    div.el-select {
      div.el-input {
        input.el-input__inner {
          height: 32px;
        }
      }
    }
  }
</style>
