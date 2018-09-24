<template>
  <div class="grid-wrapper">
    <div class="hide-border">
      <grid-layout
      ref="gridLayout"
      :layout="chartsOption"
      :col-num="containerInit.colNum"
      :row-height="containerInit.rowHeight"
      :use-css-transforms="containerInit.useCssTransforms"
      :is-draggable="!isDisDraggable"
      :margin= "containerInit.margin">
        <grid-item
          v-loading="item.loading"
          v-for="item in chartsOption"
          :key="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :minH="containerInit.minH"
          drag-ignore-from=".container-inner"
          class="grid-item"
          :class="{active: item.selected,[`grid-item-${item.i}`]: true}"
          @click.native="selectContainer(item.i)"
          @resized="resizeOrMove(item.i)"
          @moved="resizeOrMove(item.i)"
          @mouseenter.native="showTips(item.i)"
          @mouseleave.native="hideTips(item.i)">
          <el-dropdown class="actions-btn" :class="{noShow: !item.nameToggle}" trigger="click" @command="handleCommand" @click.native.stop>
            <span class="el-dropdown-link">
              <i class="actions">• • •</i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="'a'+item.i">
                <i class="el-icon-document"></i>删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="drag-handle" :class="{noShow: !item.nameToggle}">
            <span v-show="item.nameToggle">
              <img src="/static/charts/images/titleArrow.png" alt="">
              {{item.name}}
              <el-button type="danger" class="more-data" size="mini" v-if="chartsOptionAll[item.i].showMoreDataFlag" @click="getMoreData(item.i)">更多数据</el-button>
            </span>
          </div>
          <!--标签提示-->
          <tip :metricsId="item.feature.metricList" :opacity="tipsArr[item.i]" :class="{noTitle: !item.nameToggle}" v-if="item.id === 0"></tip>
          <container-inner :index="item.i" >图表组件</container-inner>
        </grid-item>
      </grid-layout>
    </div>
    <add-panel class="add-panel"></add-panel>
  </div>
</template>

<script>
  import {GridLayout, GridItem} from 'vue-grid-layout'
  import {containerInit} from '../static/configData'
  import addPanel from './addPannel'
  import containerInner from './left/containerInner'
  import eventBus from '../utils/eventBus'
  import leftMixin from './mixins/leftMixin/leftMixin'

  export default {
    name: 'Left',
    mixins: [leftMixin],
    data () {
      return {
        containerInit,
        tipsArr: []
      }
    },
    components: {
      GridLayout,
      GridItem,
      addPanel,
      containerInner
    },
    computed: {
      chartsOption () {
        return this.$store.state.charts.chartsOption.filter(item => !item.drop && item.tabContainerIndex === undefined)
      },
      isDisDraggable () {
        return this.$route.path === '/visual' || this.$store.state.charts.previewToggle
      },
      chartsOptionAll () {
        return this.$store.state.charts.chartsOption
      }
    },
    mounted () {
      this.blurHandle()
    },
    methods: {
      // 跳转到更多数据页
      getMoreData(index) {
        const selectedReport = this.chartsOptionAll[index].selectedReport
        const selectedReportVersion = this.chartsOptionAll[index].selectedReportVersion
        if (selectedReport !== '' && selectedReportVersion !== '') {
          let routeData = this.$router.resolve({
            path:'/visual',
            query: {reportId: selectedReport, versionId: selectedReportVersion},
          })
          window.open(routeData.href, '_blank')
        }
      },
      selectContainer (index) {
        this.$store.commit('selectedChange', index)
      },
      resizeOrMove (index) {
        this.$store.commit('resizeOrMove', this.chartsOption)
        this.$nextTick(() => {
          setTimeout(() => {
            eventBus.$emit(`resizeOrMove_${index}`, index)
          }, 200)
        })
      },
      handleCommand (command) {
        if (command[0] === 'a') {
          this.$store.commit('delContainer', command.slice(1))
        }
        if (command[1] === 'b') {
          console.log('导出')
        }
      },
      // 点击非容器区域，所有容器失去焦点
      blurHandle () {
        // 判断是否在容器内点击
        const _isInContainerClick = path => {
          let flag = false
          path.forEach(item => {
            if (item.className && item.className.includes('vue-grid-item')) flag = true
          })
          return flag
        }
        const _this = this
        window.addEventListener('click', function (e) {
          if (!_isInContainerClick(e.path)) _this.$store.commit('selectedChange')
        })
      },
      /**
       * 预览时的tips，当鼠标移入时显示，移出时消失
       */
      showTips (index) {
        if (!this.tipsArr[index] && this.$route.path === '/visual') {
          this.$set(this.tipsArr, index, true)
        }
      },
      hideTips (index) {
        if (this.tipsArr[index] && this.$route.path === '/visual' ) {
          this.$set(this.tipsArr, index, false)
        }
      }
    }
  }
</script>

<style lang="less">
  @active-border-color: rgb(113,182,255);
  @drag-handle-height: 40px;

  .grid-wrapper{
    background:url(/static/charts/images/background.svg) no-repeat;
    background-size:100%;
    // background-position: 10px 10px;
    position: relative;
    overflow-x: hidden; overflow-y: auto;

    .grid-item{
      //overflow: hidden;
      background: #fff;
      transition: box-shadow 0.3s ease;
      box-shadow: 0 4px 10px 0 rgba(0,0,0,0.14);
      &.active{
        box-shadow: 0 0 1px 1px @active-border-color;
      }
      .drag-handle{
        background: #f5f5f5;
        height: @drag-handle-height;
        transition: all 0.2s ease;
        line-height: @drag-handle-height;
        &.noShow{
          display: none;
        }
        >span{
          font-weight: bold;
          padding-left: 16px;
          color: #333;
          font-size: 14px;
          line-height: @drag-handle-height;
          width: 100%;
          display: inline-block;
          height: @drag-handle-height;
        }
        .more-data{
          display: inline;
          position: relative;
          padding: 5px 10px;
          margin-left: 10px;
          &::after{
            position: absolute;
            content: '';
            height: 16px;
            width: 16px;
            right: -8px;
            top: 3px;
            transform: rotate(225deg);
            border-left: 1px solid #f56c6c;
            border-bottom: 1px solid #f56c6c;
            border-color: inherit;
            background-color: inherit;
          }
        }
      }
    }
    .actions-btn{
      position: absolute;
      right: 10px;
      cursor: pointer;
      z-index: 5;
      &.noShow{
          display: none;
      }
      i {
        color: #666;
        font-size: 12px;
        position: relative;
        top: 10px;
        &:hover {
          color: #51A6FF;
        }
      }
    }
    .add-panel{
      margin: 0 10px;
    }
  }
</style>
<style>
  ul.el-dropdown-menu{
    padding: 3px 0;
  }
</style>
