<!-- 设置维度下拉控件的类型 -->
<template>
  <div class="control-type">
    <el-popover
      trigger="click"
      placement="bottom"
      v-model="showDrop"
      :disabled="disabledShow"
      popper-class="control-popover"
    >
  <!--<div @click.stop slot="reference" class="icon_area"><img src="/static/charts/images/metric-more.png" alt=""></div>-->
      <div slot="reference" class="icon_area"><i class="el-icon-more"></i></div>
      <div class="control-popper-content" ref="drop_container_area">
        <el-radio-group :disabled="isCascade" v-model="selectType" @change="setSelectType">
          <el-radio :label="1">单选控件</el-radio>
          <el-radio :label="0">多选控件</el-radio>
          <el-radio :label="2">输入控件</el-radio>
        </el-radio-group>
      </div>
    </el-popover>
  </div>
</template>

<script>
  export default {
    name: 'MetricProperty',
    props: {
      dimData: {}           // 维度数据
    },
    data () {
      return {
        showDrop: false,
        selectType: 0
      }
    },
    computed: {
      currentContainer () {
        return this.$store.state.charts.chartsOption.filter(item => item.selected)[0]
      },
      disabledShow () {
        let dimCode = this.dimData.dimCode
        let dropDownData = this.currentContainer.feature.dropDownData
        return !dropDownData.some(item => item.dimCode === dimCode)
      },
      // 是否级联
      isCascade () {
        let dimCode = this.dimData.dimCode
        let dropDownData = this.currentContainer.feature.dropDownData.filter(item => item.dimCode === dimCode)
        if (dropDownData.length && dropDownData[0].children.length) {
          return true
        } else {
          return false
        }
      }
    },
    watch: {
      // 获取最新的selectType状态
      showDrop (newValue) {
        if (newValue) {
          let nowType = 0
          let dimCode = this.dimData.dimCode
          let dropDownData = this.currentContainer.feature.dropDownData
          dropDownData.forEach(item => {
            if (item.dimCode === dimCode) {
              // 版本兼容
              nowType = item.controlType !== undefined ? item.controlType : 0
            }
          })
          this.selectType = nowType
        }
      }
    },
    methods: {
      setSelectType (value) {
        let dimCode = this.dimData.dimCode
        this.$store.commit('setSelectType', {
          index: this.currentContainer.i,
          dimCode,
          value
        })
      },
      checkArea (e) {
        // console.log(this.$el)
         if (!this.$el.contains(e.target) && !this.$refs['drop_container_area'].contains(e.target)) {
          if (this.showDrop) {
            this.showDrop = false
          }
        }
      }
    },
    mounted () {
      // 事件捕获
      document.addEventListener('click', this.checkArea, true)
    },
    beforeDestroy() {
      document.removeEventListener('click', this.checkArea, true)
    }
  }
</script>

<style lang="less">
  .control-type {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    padding-left: 10px;
  }
  @img-width: 12px;
  .control-type .icon_area {
    position: relative;
    height: 24px;
    width: 24px;
    font-size: 14px;
    cursor: pointer;
    color: #51a6ff;
    &:before{
      position: absolute;
      left: -7px;
      top: 4px;
      content: '';
      width: 1px;
      height: 60%;
      background-color: #B2B8BE !important
    }
    img{
      width: @img-width;
      height: @img-width;
      margin-right: 6px;
      margin-top: 5px;
    }
  }
  .control-popper-content {
    min-width: 100px;
    box-sizing: border-box;
    text-align: center;
    padding: 12px;
  }
  .focusing {
    border: none;
  }
</style>
<style>
  .control-popper-content .el-radio {
    display: block;
    padding: 5px 0;
  }
  .control-popper-content .el-radio+.el-radio {
    margin-left: 0px;
  }
  .control-popover {
    min-width: 100px;
    padding: 0px;
  }
</style>
