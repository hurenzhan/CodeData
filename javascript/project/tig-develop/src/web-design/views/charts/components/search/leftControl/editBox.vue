<!-- 自适应高度的div -->
<template>
  <div class="textarea-wrapper">
    <div class="content-editable">{{value}}</div>
<!--     <textarea class="field-textarea"
      placeholder="请输入文本内容"
      v-model="innerText" 
      @change="trimSpacesAndUppercase($event, 'innerText')">
    </textarea> -->
  </div>
</template>

<script>
export default {
  name: "edit-box",
  props: {
    placeholder: {
      type: String,
      default: "请输入内容"
    },
    value: {
      type: String,
      default: ""
    }
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
.textarea-wrapper {
  position: relative;
  display: block;
  .content-editable {
    position: relative;
    display: block;
    line-height: 32px;
    min-height: 32px;
    word-break: break-all;
    word-wrap: break-word;
    margin-bottom: 8px;
  }
  .field-textarea {
    position: absolute;
    top: 0;
    left: 0;
    border: none;
    width: 100%;
    height: 100%;
    line-height: 20px;
    box-sizing: border-box;
    text-align: left;
    resize: none;
    overflow: hidden;
    background-color: transparent;
    &::-webkit-input-placeholder {
      text-align: left;
      padding-left: 10px;
      font-size: 12px;
      line-height: 20px;
      color: #999;
    }
  }
}
</style>