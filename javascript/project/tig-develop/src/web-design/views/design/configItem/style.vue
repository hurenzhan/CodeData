<template>
<div>
  <configHeader :name="name"></configHeader>
  <div class="style-wrap">
    <div class="style-title">表格风格</div>
    <RadioGroup v-model="style.type" class="radio-group">
      <Radio label="style1"><span>默认</span></Radio>
      <Radio label="style2"><span>风格B</span></Radio>
    </RadioGroup>
    <div>
      <div class="title1">单元格上下间距</div>
      <InputNumber :min="1" :max="30" v-model="style.custom.spacing" class="distance" size="small"></InputNumber>
    </div>
    <div>
      <div class="title1 font-title">字体大小</div>
      <InputNumber :min="1" :max="48" v-model="style.custom.fontSize" class="distance" size="small"></InputNumber>
    </div>
    <div>
      <div class="title1 font-title">背景色</div>
      <span>填充颜色</span>
      <ColorPicker size="small" v-model="style.custom.bgColor" />
    </div>
  </div>
</div>
</template>

<script>
import ConfigHeader from './ConfigHeader'

/* eslint-disable */
  export default {
    components: {
      ConfigHeader
    },
  name: 'design-config-style',
  // TIPS: 当v-model绑定在vuex根节点的object上时，改变值不能触发set？？？
/*   computed: {
    style: {
      get() {
        return this.$store.getters.getStyle
      },
      set(newValue) {
        this.$store.commit('handleStyleChange', newValue)
      }
    }
  }, */
  computed: {
    _style() {
      // console.log(this.$store.state.design)
      return this.$store.state.design.style
    }
  },
  data() {
    return {
      name: '表格样式',
      style: { // 表格样式
        type: 'style1', // 默认风格类型
        custom: { // 自定义类型字段
          spacing: 1, // 单元格上下间距
          fontSize: 14, // 表格字体大小
          bgColor: '#fff' // 表格背景色
        }
      }
    }
  },
  watch: {
    style: {
      handler(newValue) {
        this.$store.commit('handleStyleChange', newValue)
        this.$store.commit('renderColumns')
      },
      deep: true
    },
    _style: {
      handler(val) {
        // console.log(val)
        this.style = val
      },
      deep: true
    }
  },
  mounted() {
    // console.log(this._style)
    this.style = this._style
  }
}
</script>

<style scoped lang="less">
.style-wrap {
  padding: 20px 14px;
  .style-title {
    margin-bottom: 10px;
  }
  .radio-group {
    padding-left: 10px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 28px;
  }
  .title1 {
    margin-bottom: 10px;
  }
  .distance {
    width: 100%;
  }
  .font-title {
    margin-top: 28px;
  }
}
</style>

<style lang="less">
@tabMainColor: #00C5E1;
.style-wrap {
  .ivu-radio-group-item {}
  /*   .ivu-radio-checked .ivu-radio-inner{
    border-color: @tabMainColor;
  }
  .ivu-radio-inner:after{
    background-color: @tabMainColor;
  } */
  .ivu-color-picker .ivu-select-dropdown {
    margin-left: -80px;
  }
}
</style>

