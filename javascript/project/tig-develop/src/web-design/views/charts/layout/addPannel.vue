<template>
  <div class="add-panel">
    <div class="add-panel-item" v-for="(item, index) in category" :key="index">
      <el-tooltip effect="dark" placement="bottom" popper-class="add-popper" :content="'添加'+ item.name">
        <el-button @click.stop="add(item.id)">
          <span class="img" :icon="item.icon" :style="getBackground(item.icon)"></span>
        </el-button>
      </el-tooltip>
      <span>{{item.name}}</span>
    </div>
  </div>
</template>

<script>
  import {containerCategory} from '../static/configData'
  import addPanel from './mixins/addPanelMixin'
  export default {
    name: 'AddPanel',
    mixins: [addPanel],
    data () {
      return {
        category: containerCategory
      }
    },
    methods: {
      add (id) {
        this.$store.commit('addContainer', {id})
      }
    }
  }
</script>

<style lang="less">
  @panel-height: 80px;
  @panel-border-color: #D2D2D2;
  @item-width: 36px;
  .add-panel{
    height: @panel-height;
    align-items: center;
    display: flex;
    justify-content: center;
    border: 1px dashed @panel-border-color;
    .add-panel-item{
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: 50px;
      line-height: 1;
      > .el-button {
        padding: 0;
        width: 36px;
        height: 36px;
        transition: all 0.2s ease;
        background: transparent;
        border-color: transparent;
        > span {
          span.img {
            display: inline-block;
            width: 36px;
            height: 36px;
            &:hover {
              background-position-y: 35.5%!important;
            }
          }
          span[icon = iframe]{
            background-repeat: no-repeat;
            &:hover{
              background-image: url('/static/charts/images/containerType/hover-iframe.png')!important;
              background-position: 0%!important;
              background-size: 35px 35px !important ;
            }
          }
        }
      }
      > span {
        margin-top: 6px;
        color: #333;
      }
    }
  }
  .add-popper{
    padding: 5px;
  }
</style>
