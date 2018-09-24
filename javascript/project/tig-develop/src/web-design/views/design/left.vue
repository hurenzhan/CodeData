<template>
  <div class="left left-wrap">
    <div class="data-source" v-show ="!leftToggle">
      <div class="data-top">
        <!-- <span @click="leftToggleClick">>>></span> -->
        <div class="left-title">
          <i class="dimension-icon icon"></i>
          维度
        </div>
        <!-- {{list}} -->
        <draggable
          element="ul"
          class="list"
          v-model="getDim"
          :options="options">
          <li
            class="item"
            v-for="(item, index) in getDimValue"
            @click="dimValue(item)"
            :key="index"
            :class="{activeClass: item.activeClass}">{{ item.name }}</li>
        </draggable>
      </div>
      <div class="data-bottom">
        <div class="left-title">
          <i class="metric-icon icon"></i>
          指标
        </div>
        <draggable
          element="ul"
          class="list"
          v-model="getMetric"
          :options="options">
          <li
            class="item"
            v-for="(item, index) in getmetricValue"
            @click="metricValue(item)"
            :key="index"
            :class="{activeClass: item.activeClass}">{{ item.name }}</li>
        </draggable>
      </div>
    </div>
    <div v-if="leftToggle" :class="{'toggle-width': leftToggle === true}">     
    </div>
    <div class="left-toggle"
      :class="{'triangleWrapper-right':  wrapperDispaly === true,
      'left-toggle-bg': triangleWrapper === true}"
      @mouseover.stop.prevent="mouseover"
      @mouseleave.stop.prevent="mouseleave"
    >
      <div
        v-if="wrapperDispaly"
        class="triangle-wrapper"
        v-show="triangleWrapper"
        @click="wrapperToggle">
        <div :class="{'triangle':  leftToggle === true}"></div>
      </div>
      <div
        v-if="!wrapperDispaly"
        class="triangle-inverted-wrapper"
        v-show="triangleWrapper"
        @click="wrapperToggle">
        <div :class="{'triangle-inverted':  leftToggle === false}"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import { mapGetters } from 'vuex'

  export default {
    name: 'design-left',
    components: {
      draggable
    },
    computed: {
      ...mapGetters([
        'getDim',
        'getMetric',
        'getColumnList'
      ]),
      // 交叉指标
      crossOnlyMetric() {
        return this.$store.state.design.crossMetric
      },
      getDimValue() {
        const dimValues = this.getColumnList.map(v => v.id).join('')
        const getDimValue = this.getDim
        getDimValue.forEach((v) => {
          if (dimValues.indexOf(v.id) !== -1) {
            v.activeClass = true
          } else {
            v.activeClass = false
          }
        })
        return getDimValue
      },
      getmetricValue() {
        const reportType = this.$route.query.reportType
        const getmetricValue = this.getMetric
        // console.log(reportType)
        if (Number(reportType) === 1) {
          const metricValues = this.getColumnList.filter(v => !v.timestamp).map(v => v.id).join('')
          getmetricValue.forEach((v) => {
            if (metricValues.indexOf(v.id) !== -1) {
              v.activeClass = true
            } else {
              v.activeClass = false
            }
          })
          return getmetricValue
        } else if (Number(reportType) === 2) {
          const crossOnlyMetricId = this.crossOnlyMetric.id          
          // console.log(this.crossOnlyMetric)
          getmetricValue.forEach((v) => {
            if (crossOnlyMetricId.indexOf(v.id) !== -1) {
              v.activeClass = true
            } else {
              v.activeClass = false
            }
          })
          return getmetricValue
        }
        
      },
      leftToggle() {
        return this.$store.state.design.leftToggle
      }
    },
    data() {
      return {
        dim: [],
        metric: [],
        options: {
          group: {
            name: 'drag-item',
            pull: 'clone',
            put: false
          },
          sort: false,
        },
        triangleWrapper: false,
        wrapperDispaly: false,
        reportType: this.$route.query.reportType
      }
    },
    methods: {
      mouseleave() {
        this.triangleWrapper = false
      },
      mouseover() {
        this.triangleWrapper = true
      },
      wrapperToggle() {
        this.wrapperDispaly = !this.wrapperDispaly
        this.$store.commit('leftToggle', this.wrapperDispaly)
      },
      // leftToggleClick() {
      //   this.leftToggle = !this.leftToggle
      //   this.$store.commit('leftToggle', this.leftToggle)
      // },
      dimValue(item) {
        // type 为1 则为添加行为
        const payload = {}
        if (item.activeClass) {
          payload.type = 0
          // 分类汇总merge.vue数据要与删除columnList行为联动
          this.$store.commit('syncDelActionWithMerge', item)
        } else {
          payload.type = 2
        }
        
        payload.item = item
        this.$store.commit('syncColumn', payload)
        // 触发set 动作时查看自定义列中是否已设置同环比，如果有，则要去掉columnList中的
        let flag = false
        const customColumn = this.$store.getters.getCustomColumn
        // console.log(customColumn)
        customColumn.forEach((v) => {
          if (v.colSetting === 1) { // 同环比情况
            flag = true
          }
        })
        if (flag) {
          this.$store.commit('removeTimeFromColumnList')
        }
      },
      metricValue(item) {
        if (parseFloat(this.reportType) === 2) {
          this.$Message.error('创建交叉表时,不能在行维度中加入指标')
          return
        }
        // type 为3 则为添加行为
        const payload = {}
        if (item.activeClass) {
          payload.type = 0
          this.$store.commit('syncQueryAndFilterWithColumnList', item.id)
        } else {
          payload.type = 3
        }
        payload.item = item
        // console.log(this.getMetric)
        this.$store.commit('syncColumn', payload)
      }
    }
  }
</script>

<style scoped lang="less">
@border-color: #F0F0F0;
@design-left-bgcolor: #F5F5F5;
.data-source{
  display: flex;
  flex-direction: column;
  height: 100%;
  .data-top{
    margin-bottom: 8px;
  }
  .data-top,.data-bottom{
    border: 1px solid @design-left-bgcolor;
    background-color: @design-left-bgcolor;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .left-title{
    display: flex;
    align-items: center;
    padding: 5px;
    padding-left: 13px;
    border-bottom: 1px solid @border-color;
    .icon{
      display: inline-block;
      margin-right: 6px;
      width: 14px;
      height: 14px;
    }
    .dimension-icon{
      background: url("/static/design/svg/weidu.svg");
      background-size: cover;
    }
    .metric-icon{
      background: url("/static/design/svg/duliang.svg");
      background-size: cover;
    }
  }
}
.list{
  .item{
    position: relative;
    padding: 6px;
    padding-left: 24px;
    margin-left: 8px;
    cursor: pointer;
    margin-bottom: 2px;
    user-select: none;
    background-color: @design-left-bgcolor;
  }
}
.left{
  width: 200px;
  float: left;
  margin-left: -100%;
  height: 100%;
}
.left-wrap{
  height: 100%;
}
.left-toggle{
  width: 7px;
  height: 100%;
  position: absolute;
  left: 200px;
  top: 0;
  z-index: 99;
  &.triangleWrapper-right{
      left: 30px;
    }
  &.left-toggle-bg{
      background-color: #D6D6D6;
      box-shadow: 3px 0px 2px #D9D9D9;
    }
    .triangle-wrapper{
      position: relative;
      top: 49%;
      .triangle{
        display: inline-block;
        width: 0; 
        height: 0; 
        border-top: 6px solid transparent; 
        border-left: 8px solid #979393; 
        border-bottom: 6px solid transparent;
        position: absolute;
        top: 50%;
        left: 2px;
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
      }
    }
  }
.toggle-width{
  width: 30px;
  background-color: #E8E8E8;
  height: 100%;
}
.activeClass{
  color: #51A6FF;
  &:before{
    content: '';
    position: absolute;
    left: 10px;
    top: 12px;
    width: 6px;
    height: 6px;
    border-radius: 10px;
    background-color: #51A6FF
  }
}
</style>
