<template>
  <div>
    <div class="data-config"
      :class="{'wrapperDispaly':  wrapperDispaly === true}">
      <div
        :class="{'wrapperDispaly':  wrapperDispaly === true,
        'wrapperDisapper': wrapperDispaly === false }"
        >  
        <ul class="menuList menuBar">
          <li v-for="(item, index) in iconList"
            :key="item.name"
            style="cursor: pointer;"
            v-show="reportType == 1 || (reportType == 2 && (item.name !== 'merge' && item.name !=='custom-column'))"
            :class="{'active': item.active,
              'recommend': (item.name ==='align' || item.name ==='formatter') && recommend}"
            @click="handleClick(item, index)">
              <Tooltip
                class="icon"
                :class="item.name"
                :content="item.label" 
                placement="left">
              </Tooltip>
          </li>
        </ul>
        <transition>
          <div class="wrapper" v-if="!wrapperDispaly">
            <ul class="content-list">
              <li v-for="(item, index) in componentList"
                :key="index"
                class="content-item"
                :class="{active: selectedIndex === index}"
                @click="handleChangeContent()">
                 <div
                  :is="item.name"
                  v-show="reportType == 1 || (reportType == 2 && (item.name !== 'merge' && item.name !=='custom-column'))"
                  ></div>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
    <div class="triangleWrapper"
      :class="{'triangleWrapper-right':  wrapperDispaly === true,
      'triangleWrapper-bg': triangleWrapper === true}"
      @mouseover.stop.prevent="mouseover"
      @mouseleave.stop.prevent="mouseleave"
    >
      <div v-if="!wrapperDispaly"
          class="triangle-wrapper"
          v-show="triangleWrapper"
          @click="wrapperToggle">
        <div :class="{'triangle':  wrapperDispaly === false}"></div>
      </div>
      <div v-if="wrapperDispaly"
          class="triangle-inverted-wrapper"
          v-show="triangleWrapper"
          @click="wrapperToggle">
        <div :class="{'triangle-inverted':  wrapperDispaly === true}"></div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import align from './configItem/align'
import customColumn from './configItem/customColumn'
import drill from './configItem/drill'
import dFilter from './configItem/filter'
import merge from './configItem/merge'
import sort from './configItem/sort'
import freeze from './configItem/freeze'
import dStyle from './configItem/style'
import tableHeader from './configItem/tableHeader'
import warning from './configItem/warning'
import formatter from './configItem/formatter'

export default {
  name: 'design-right',
  computed: {
    reportType() {
      return this.$route.query.reportType
    },
    selectedCell() {
      return this.$store.state.design.cell
    },
    tableHeaderActive() {
      return this.$store.state.design.tableHeaderActive
    },
    row() {
      return this.$store.state.design.row
    },
    reallyRow() {
      if (this.tableHeaderActive) {
        return this.row
      } else {
        return 1
      }
    },
    recommend() {
      if (this.selectedCell[0] > (this.reallyRow - 2)) {
        return true
      } else {
        return false
      }
    }
  },
  components: {
    align,
    customColumn,
    drill,
    dFilter,
    merge,
    sort,
    freeze,
    dStyle,
    tableHeader,
    warning,
    formatter
  },
  data() {
    return {
      triangleWrapper: false,
      selectedIndex: 0,
      wrapperDispaly: false,
      iconList: [
        {
          name: 'filter',
          label: '筛选'
        },
        {
          name: 'merge',
          label: '分类汇总'
        },
        {
          name: 'tableHeader',
          label: '自定义表头'
        },
        {
          name: 'sort',
          label: '排序'
        },
        {
          name: 'freeze',
          label: '冻结'
        },
        {
          name: 'align',
          label: '对齐方式'
        },
        {
          name: 'style',
          label: '表格样式'
        },
        {
          name: 'drill',
          label: '上卷下钻'
        },
        {
          name: 'custom-column',
          label: '自定义列设置'
        },
        {
          name: 'formatter',
          label: '数值格式'
        }
      ],
      componentList: [
        {
          name: 'dFilter'
        },
        {
          name: 'merge'
        },
        {
          name: 'tableHeader'
        },
        {
          name: 'sort'
        },
        {
          name: 'freeze'
        },
        {
          name: 'align'
        },
        {
          name: 'dStyle'
        },
        {
          name: 'drill'
        },
        {
          name: 'custom-column'
        },
        {
          name: 'formatter'
        }
      ]
    }
  },
  created() {
    this.iconList.forEach((v) => {
      this.$set(v, 'active', false)
    })
    this.iconList[0].active = true
  },
  methods: {
    mouseleave() {
      this.triangleWrapper = false
    },
    mouseover() {
      this.triangleWrapper = true
    },
    handleClick(item, index) {
      if (this.$store.state.design.reportFunction && item.name === 'drill') {
        return
      }
      this.selectedIndex = index
      this.iconList.forEach((v) => {
        v.active = false
      })
      this.iconList[index].active = true

      this.$store.commit('activeIcon', item.name)
    },
    wrapperToggle() {
      this.wrapperDispaly = !this.wrapperDispaly
      this.$store.commit('rightToggle', this.wrapperDispaly)
    },
    handleChangeContent() {

    }
  }
}
</script>

<style scoped lang="less">
@icon-width: 30px;
@icon-width-warp: 35px;
  .data-config{
    // &:hover{
    //   .triangleWrapper{
    //     display: block;
    //   }
    // }
    &.wrapperDispaly{
      width: 35px;
      margin-left: 205px;
    }
    .wrapperDisapper{
      padding-left: 30px;
      width: 240px;
    }
    position: relative;
    display: flex;
    height: 100%;
    // padding-bottom: 200px;
    // overflow-y: auto;
    background-color: #F5F5F5;
    .menuList{
      background-color: #E8E8E8;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      // width: @icon-width;
      flex-basis: @icon-width;
      display: flex;
      flex-direction: column;
      padding: 12px 0;
      .icon{
        display: inline-block;
        width: @icon-width;
        height: @icon-width;
      }
      li.active .icon{
        background-color: #F5F5F5;
      }
      .filter{
        background: url("/static/design/svg/shaixuan.svg") no-repeat center center;
        background-size: 14px 14px;
      }
      .merge{
        background: url("/static/design/svg/fenleihuizong.svg") no-repeat center center;
        background-size: 14px 14px;
      }
      .sort{
        background: url("/static/design/svg/paixu.svg") no-repeat center center;
        background-size: 14px 14px;
      }
      .tableHeader{
        background: url("/static/design/svg/biaotou.svg") no-repeat center center;
        background-size: 14px 14px;
      }
      .freeze{
        background: url("/static/design/svg/dongjie.svg") no-repeat center center;
        background-size: 14px 14px;
      }
      .align{
        background: url("/static/design/svg/duiqi.svg") no-repeat center center;
        background-size: 14px 14px;
      }
      .style{
        background: url("/static/design/svg/biaoge.svg") no-repeat center center;
        background-size: 14px 14px;
      }
      .drill{
        background: url("/static/design/svg/xiazuan.svg") no-repeat center center;
        background-size: 14px 14px;
      }
      .warning{
        background: url("/static/design/svg/yujing.svg") no-repeat center center;
        background-size: 14px 14px;
      }
      .custom-column{
        background: url("/static/design/svg/lie.svg") no-repeat center center;
        background-size: 14px 14px;
      }
      .formatter{
        background: url("/static/design/svg/123.svg") no-repeat center center;
        background-size: 14px 14px;
      }
      .recommend{
        background-color: skyblue;
      }
    }
    .wrapper{
      flex: 1;
      width:200px;
      height: 100%;
      overflow-y: auto;
      background: #FAFAFA;
    }
    .content-list{
      .content-item{
        display: none;
        &.active{
          display: block;
        }
      }
    }
  }
  .triangleWrapper{
    width: 7px;
    height: 100%;
    position: absolute;
    right: 230px;
    top: 0;
    z-index: 99;
    &.triangleWrapper-right{
      right: 25px;
    }
    &.triangleWrapper-bg{
      background-color: #D6D6D6;
      box-shadow: 3px 0px 2px #D9D9D9;
    }
    .triangle-wrapper{
      position: relative;
      top: 49%;
      left: 1px;
      .triangle{
        display: inline-block;
        width: 0; 
        height: 0; 
        border-top: 6px solid transparent; 
        border-left: 8px solid #979393; 
        border-bottom: 6px solid transparent;
      }
    }
    .triangle-inverted-wrapper{
      position: relative;
      top: 49%;
      .triangle-inverted{
        display: inline-block;
        width: 0; 
        height: 0; 
        border-top: 6px solid transparent; 
        border-right: 8px solid #979393; 
        border-bottom: 6px solid transparent; 
        position: absolute;
      }
    }
  }
</style>
