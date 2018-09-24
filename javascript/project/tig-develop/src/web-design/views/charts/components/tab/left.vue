<template>
  <div class="grid-wrapper my-wrapper">
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
        :y="item.y || 0"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :minH="containerInit.minH"
        drag-ignore-from=".container-inner"
        class="grid-item"
        :class="{active: item.selected, [`grid-item-${item.i}`]: true}"
        @click.native.stop="selectContainer(item.i)"
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
          <span v-show="item.nameToggle" style="border-bottom: 1px solid #fff;">
            <img src="/static/charts/images/titleArrow.png" alt="">
            {{item.name}}
            <el-button type="danger" class="more-data" size="mini" v-if="chartsOptionAll[item.i].showMoreDataFlag" @click="getMoreData(item.i)">更多数据</el-button>
          </span>
        </div>
        <!--标签提示-->
        <tip :metricsId="item.feature.metricList" :isTab="true" :opacity="tipsArr[item.i]" :class="{noTitle: !item.nameToggle}" v-if="item.id === 0"></tip>
        <container-inner :index="item.i">图表组件</container-inner>
      </grid-item>
    </grid-layout>
    <add-panel class="add-panel" :containerIndex="containerIndex" :tabIndex="tabIndex"></add-panel>
  </div>
</template>

<script>
  import {GridLayout, GridItem} from 'vue-grid-layout'
  import {containerInit} from '../../static/configData'
  import addPanel from './addPannel'
  import containerInner from './containerInner'
  import eventBus from '../../utils/eventBus'
  import leftMixin from '../../layout/mixins/leftMixin/leftMixin'
  import {wait} from '../../utils/utils'

  export default {
    name: 'Left',
    mixins: [leftMixin],
    data () {
      return {
        containerInit,
        chartsOption: [], // 必须要有本地的chartsOption，如果直接用computed里会先加载，但是dom加载在后
        tipsArr: []
      }
    },
    props: [
      'containerIndex', // 当前第几个容器
      'tabIndex', // tab页面index
    ],
    components: {
      GridLayout,
      GridItem,
      addPanel,
      containerInner
    },
    computed: {
      chartsOptionCopy () {
        return this.$store.state.charts.chartsOption.filter(
          item => !item.drop && item.tabContainerIndex === this.containerIndex && item.activeTabIndex == this.tabIndex
        )
      },
      isDisDraggable () {
        return this.$route.path === '/visual' || this.$store.state.charts.previewToggle
      },
      chartsOptionAll () {
        return this.$store.state.charts.chartsOption
      }
    },
    mounted () {
      // 等dom加载完毕后再改变本地的chartsOption
      this.$nextTick(() => {
        this.chartsOption = this.chartsOptionCopy
      })
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
        }
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
        if (this.tipsArr[index] && this.$route.path === '/visual') {
          this.$set(this.tipsArr, index, false)
        }
      }
    },
    // 监听vuex上的chartsOption，实时改变本地的chartsOption
    watch: {
      chartsOptionCopy(value) {
        this.chartsOption = value
      }
    }
  }
</script>

<style lang="less">
.my-wrapper{
  background: none;
  .vue-grid-layout{
    overflow: hidden;
  }
}
</style>



