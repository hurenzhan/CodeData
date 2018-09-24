<template>
  <div style="padding-left: 10px;padding-top: 10px">
    <div class="title-area">
      <div class="dot"></div>
      <span style="color: #666;">TAB绑定</span>
      <el-checkbox style="margin-left:68px" v-model="enableTab" :disabled="chartId !==2" >启用</el-checkbox>
    </div>
    <div style="margin-left:18px;margin-top:8px;">
        <span>选择容器</span>
        <el-select size="small" clearable v-model="selectedTab" placeholder="请选择" :disabled="!enableTab" style="width:120px;margin-left:5px">
          <el-option
            v-for="item in tapOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tabControl',
  computed: {
    chartsOption(){
       return this.$store.state.charts.chartsOption
    },
    // 选中的容器
    selectedOption () {
      return this.chartsOption.filter(item => !item.drop && item.selected)[0]
    },
    //判断当前的容器类型
    chartId(){
       return this.selectedOption.feature.chartId
    },
    // 是否启用Tab绑定
    enableTab: {
      get() {
        return this.selectedOption.enableTab || false
      },
      set(value) {
        this.$store.commit('saveEnableTab', { index: this.selectedOption.i, value})
        this.$store.commit('saveSelectedTab', {index: this.selectedOption.i, selectedTab: ''})
      }
    },
    selectedTab: {
        get () {
            return this.selectedOption.selectedTab || null
        },
        set (value) {
          this.$store.commit('saveSelectedTab', {index: this.selectedOption.i, selectedTab: value})
        }
      },
    tapOptions() {
      const options = []
      this.$store.state.charts.chartsOption.map((item, index) => {
        if (item.drop === false && item.feature.tabs !== undefined ) {
          const option = {
            label: item.name,
            value: index,
          }
          options.push(option)
        }
      })
      return options
    },
  }
}
</script>

<style lang="less" scoped>
</style>







