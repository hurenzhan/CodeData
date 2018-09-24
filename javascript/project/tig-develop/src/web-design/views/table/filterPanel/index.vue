<template>
  <div class="cockpit-filterPanel">
    <div class="cockpit-selected">
      <span class="left-panel">已选指标</span>
      <div class="sort-items">
        <Tag v-for="(item,key) in checkList2" :key="item.metricsCode" :closable="true" @on-close="handleClose(item,key)" v-cloak>{{item.metricName}}</Tag>        
      </div>
    </div>
    <div class="wrapper">
      <div class="cockpit-checkbox">
        <slot name="dimension">
          <span class="left-panel">展示维度</span>
        </slot>
        <CheckboxGroup v-model="checkArray" >
          <Checkbox v-for="item in checkList"  disabled :key="item.dimCode" :label="item.dimCode" >{{item.dimName}}</Checkbox>
        </CheckboxGroup>
        <slot name="footer"></slot>
      </div>
      <span class="cockpit-empty" @click="emptyFilter">清空</span>
    </div>

    
  </div>
</template>

<script>
export default {
  name: 'filterPanel',
  props: {
    checkList: [Array, String],
    checkList2: [Array, String],
    demo1: [Array, String],
    checkArray: Array
  },
  data() {
    return {
      demo2: [],
      // checkArray: []
    }
  },
  methods: {
    handleClose(item, index) {
      this.$emit('handleCloseEvent', index, item)
    },
    emptyFilter() {
      this.$emit('emptyAll')
    },
  }
}
</script>

<style scoped lang="less">
@filterPanel-color: #F5F5F5;
.cockpit-filterPanel {
  background-color: @filterPanel-color;
  margin: 10px 0;
  padding: 16px 12px;
}
.ivu-checkbox-group{
  display: inline-block;
}
.cockpit-selected{
  display: flex;
}
.cockpit-selected .left-panel{
  white-space: nowrap; // 强制文字不换行
  line-height: 24px;
}
.left-panel{
  color: #A2A2A2;
  font-size: 13px;
  margin-right: 18px;
}
.sort-items {
  display: inline
}
div.cockpit-filterPanel div.sort-items div.ivu-tag{
  background-color: #fff;
}
.cockpit-checkbox{
  padding-top: 14px;
}
.cockpit-empty{
  align-self: flex-end;
  color: #A2A2A2;
  cursor: pointer;
}
.wrapper{
  display: flex;
  justify-content: space-between;
}

</style>
