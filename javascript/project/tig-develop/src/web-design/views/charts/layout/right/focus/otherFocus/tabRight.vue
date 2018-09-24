<template>
  <div class="tab-right my-slide-bar">
    <p class="tab-right-title">
      <span>容器标题</span>
      <el-checkbox v-model="nameShow">显示</el-checkbox>
    </p>
    <el-input placeholder="请输入标题" size="small" v-model="name"></el-input>
    <div class="tab-items">
      <p class="tab-items-name">TAB设置<el-checkbox v-model="showTab">显示tab名称</el-checkbox></p>
      <p class="tab-item" v-for="(item, index) in tabs" :key="index" v-if="!item.drop">
        <span>TAB{{index+1}}</span>
        <el-input :maxlength="30" size="mini" :placeholder="'请输入'+(index+1)+'名称'" :value="item.name" @input="tabNameChange(index, $event)"></el-input>
        <i v-if="index>1" class="el-icon-minus" @click="delTab(index)"></i>
      </p>
      <el-button size="mini" type="primary" @click="addTab(tabs.length)" style="font-size: 14px;">添加TAB</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TabRight',
    data () {
      return {}
    },
    computed: {
      containerOption () {
        return this.$store.state.charts.chartsOption.filter(item => item.selected)[0]
      },
      tabs () {
        return this.containerOption.feature.tabs
      },
      showTab: {
        get () {
          return this.containerOption.feature.showTabFlag
        },
        set (value) {
          this.$store.commit('showTabName', { index: this.containerOption.i, value })
        }
      },
      nameShow: {
        get () {
          return this.containerOption.nameToggle
        },
        set (value) {
          this.$store.commit('containerNameToggle', {
            index: this.containerOption.i,
            value
          })
        }
      },
      name: {
        get () {
          return this.containerOption.name
        },
        set (value) {
          this.$store.commit('changeContainerName', {
            index: this.containerOption.i,
            value
          })
        }
      }
    },
    methods: {
      // 每个标签页的name的change
      tabNameChange (tabIndex, value) {
        this.$store.commit('tabNameChange', {
          index: this.containerOption.i,
          tabIndex,
          value
        })
      },
      // 添加标签页
      addTab (tabIndex) {
        this.$store.commit('addTab', {
          index:this.containerOption.i,
          id:tabIndex + 1
          })
      },
      // 删除标签页
      delTab (tabIndex) {
        this.$store.commit('delTab', {
          index: this.containerOption.i,
          tabIndex
        })
      }
    }
  }
</script>

<style lang="less">
  @px16: 16px;
  .el-checkbox__label{
    font-weight: normal;
    padding-left: 6px;
  }
  .el-checkbox__input.is-checked+.el-checkbox__label{
    color: #666;
  }
  .tab-items {
    padding-left: @px16;
    .el-input__inner{
      padding: 0 8px;
    }
    .tab-items-name{
      font-size: 14px;
      font-weight: bold;
      margin: 6px 16px 16px 0;
      display: flex;
      justify-content: space-between;
    }
    p.tab-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      >span{
        font-size: 14px;
      }
      >.el-input{
        width: 65%;
        margin-left: 5px;
      }
      >i.el-icon-minus{
        cursor: pointer;
        margin-left: 5px;
        border: 1px solid #C1C3C3;
        padding: 2px;
        padding-right: 2px;
        border-radius: 4px;
      }
    }
  }
  .tab-right{
    >.el-input{
      .el-input__inner{
        padding: 0 8px;
        font-size: 14px;
        color: #999;
      }
    }
    >.tab-right-title{
      display: flex;
      justify-content: space-between;
      margin: @px16;
      margin-top: 11px;
      >span {
        font-size: 14px;
        font-weight: bold;
      }
    }
    >div.el-input {
      padding: @px16;
      padding-top: 0;
    }
    .el-button{
      margin-top: 9px;
      width: calc(~'100%' - @px16);
    }
  }
</style>
