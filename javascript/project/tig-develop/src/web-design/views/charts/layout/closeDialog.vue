/*
 * @Author: Jacob
 * @Date: 2018-06-05 10:23:28
 * @Last Modified by: Jacob
 * @Last Modified time: 2018-07-03 17:49:21
 * @Description: 点返回按钮弹出对话框提示是否要保存，用的iview的Modal组件
 */
<template>
  <el-dialog
  title="提示"
  :visible.sync="closeFlag"
  :close-on-click-modal="maskClosable"
  :close-on-press-escape="closable"
  :show-close="closable"
  width="400px"
  top="30vh"
  append-to-body
  custom-class="closeDialog">
    <span>即将关闭窗口，编辑的内容将不会被保存<br>是否要保存?</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel" size="mini">取 消</el-button>
      <el-button @click="unsave" size="mini">放弃</el-button>
      <el-button type="primary" @click="save" size="mini">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'closeDialog',
  props: {
    styles: {
      type: Object
    },
    closeFlag: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: false
    },
    maskClosable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    cancel () {
      this.$emit('cancelDialog')
    },
    save () {
      this.$emit('saveDialog')
    },
    unsave () {
      this.$emit('unsaveDialog')
    }
  }
}
</script>

<style lang="less">
.closeDialog{
  .el-dialog__header{
    padding: 14px 24px;
    border-bottom: 1px solid #E6E6E6;
    .el-dialog__title{
      color: #333;
      font-size: 16px;
      font-weight: bold;
    }
  }
  .el-dialog__body{
    padding: 20px;
    text-align: center;
    span{
      color: #333;
    }
  }
  .el-dialog__footer{
    button{
      padding: 0px 22px;
      font-size: 14px;
      color: rgba(0,0,0,0.65);
      line-height: 30px;
      height: 32px;
      font-weight: normal;
      &.el-button--primary{
        color: #fff;
      }
    }
  }
}
</style>

