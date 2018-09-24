<template>
  <!-- 周期选择组件 -->
  <div class="right-Component">
    <div class="period-content">
      <el-collapse-item title="日期选择" ref="collapse-period">
        <!-- 按日、按周、按月类型下拉框 -->
        <div class="period-select">
          <p class="name">按日、周、月、季、年进行选择</p>
          
          <el-checkbox v-model="comparedRange">显示对比期</el-checkbox>

          <p class="name">选择启用的时间粒度</p>          
          <el-select size="mini" multiple v-model="availableKeys">
            <el-option
              v-for="list in period.selected"
              :key="list.value"
              :value="list.value"
              :label="list.label">
            </el-option>
          </el-select>

          <p class="name">选择控件类型</p>
          <period-type></period-type>

          <p class="name">设置默认值</p>
          <el-tabs type="border-card" :stretch="true" v-model="tabName">
            <el-tab-pane label="本期" name="current">
              <div class="select-container" v-for="item in availableCurrent">
                <span class="typeName">{{item.label}}</span>
                <!-- 实时 /-->
                <span class="select-value" v-if="item.key === 0">
                  <el-select size="mini" :disabled="item.key === 0" v-model="realValue">
                    <el-option
                      v-for="list in item.selectValue"
                      :key="list.type"
                      :value="list.type"
                      :label="list.name">
                    </el-option>
                  </el-select>
                </span>
                <!-- 时 /-->
                <span class="select-value" v-if="item.key === 6">
                  <el-select size="mini" v-model="hourValue">
                    <el-option
                      v-for="list in item.selectValue"
                      :key="list.type"
                      :value="list.type"
                      :label="list.name">
                    </el-option>
                  </el-select>
                </span>
                <!-- 日 /-->
                <span class="select-value" v-if="item.key === 1">
                  <el-select size="mini" v-model="dayValue">
                    <el-option
                      v-for="list in item.selectValue"
                      :key="list.type"
                      :value="list.type"
                      :label="list.name">
                    </el-option>
                  </el-select>
                </span>
                <!-- 周 /-->
                <span class="select-value" v-if="item.key === 2">
                  <el-select size="mini" v-model="weekValue">
                    <el-option
                      v-for="list in item.selectValue"
                      :key="list.type"
                      :value="list.type"
                      :label="list.name">
                    </el-option>
                  </el-select>
                </span>
                <!-- 月 /-->
                <span class="select-value" v-if="item.key === 3">
                  <el-select size="mini" v-model="monthValue">
                    <el-option
                      v-for="list in item.selectValue"
                      :key="list.type"
                      :value="list.type"
                      :label="list.name">
                    </el-option>
                  </el-select>
                </span>
                <!-- 季 /-->
                <span class="select-value" v-if="item.key === 4">
                  <el-select size="mini" v-model="quaterValue">
                    <el-option
                      v-for="list in item.selectValue"
                      :key="list.type"
                      :value="list.type"
                      :label="list.name">
                    </el-option>
                  </el-select>
                </span>
                <!-- 年 /-->
                <span class="select-value" v-if="item.key === 5">
                  <el-select size="mini" v-model="yearValue">
                    <el-option
                      v-for="list in item.selectValue"
                      :key="list.type"
                      :value="list.type"
                      :label="list.name">
                    </el-option>
                  </el-select>
                </span>
              </div>
            </el-tab-pane>
            <el-tab-pane label="对比期" name="compare">
              <div class="select-container" v-for="item in availableCompare">
                <span class="typeName">{{item.label}}</span>
                <!-- 实时 /-->
                <span class="select-value" v-if="item.key === 0">
                  <el-select size="mini" :disabled="item.key === 0" v-model="realValue">
                    <el-option
                      v-for="list in item.selectValue"
                      :key="list.type"
                      :value="list.type"
                      :label="list.name">
                    </el-option>
                  </el-select>
                </span>
                <!-- 时 /-->
                <span class="select-value" v-if="item.key === 6">
                  <el-select size="mini" v-model="hourValue">
                    <el-option
                      v-for="list in item.selectValue"
                      :key="list.type"
                      :value="list.type"
                      :label="list.name">
                    </el-option>
                  </el-select>
                </span>
                <!-- 日 /-->
                <span class="select-value" v-if="item.key === 1">
                  <el-select size="mini" v-model="dayValue">
                    <el-option
                      v-for="list in item.selectValue"
                      :key="list.type"
                      :value="list.type"
                      :label="list.name">
                    </el-option>
                  </el-select>
                </span>
                <!-- 周 /-->
                <span class="select-value" v-if="item.key === 2">
                  <el-select size="mini" v-model="weekValue">
                    <el-option
                      v-for="list in item.selectValue"
                      :key="list.type"
                      :value="list.type"
                      :label="list.name">
                    </el-option>
                  </el-select>
                </span>
                <!-- 月 /-->
                <span class="select-value" v-if="item.key === 3">
                  <el-select size="mini" v-model="monthValue">
                    <el-option
                      v-for="list in item.selectValue"
                      :key="list.type"
                      :value="list.type"
                      :label="list.name">
                    </el-option>
                  </el-select>
                </span>
                <!-- 季 /-->
                <span class="select-value" v-if="item.key === 4">
                  <el-select size="mini" v-model="quaterValue">
                    <el-option
                      v-for="list in item.selectValue"
                      :key="list.type"
                      :value="list.type"
                      :label="list.name">
                    </el-option>
                  </el-select>
                </span>
                <!-- 年 /-->
                <span class="select-value" v-if="item.key === 5">
                  <el-select size="mini" v-model="yearValue">
                    <el-option
                      v-for="list in item.selectValue"
                      :key="list.type"
                      :value="list.type"
                      :label="list.name">
                    </el-option>
                  </el-select>
                </span>
              </div>
            </el-tab-pane>
          </el-tabs>

          <p class="name">设置范围区间 (暂只支持日)</p>
          <div class="container_limit" v-if="limitRangeArr.length">
              <el-select class="selectOpt" size="mini" v-model.number="selectKey" placeholder="请选择">
                <el-option
                  v-for="list in limitRangeArr"
                  :key="list.value"
                  :value="list.value"
                  :label="list.label">
                </el-option>
              </el-select>
              <el-input-number
                class="input_box"
                v-model="limitValue"
                size="mini"
                controls-position="right"
                :disabled="forbidLimitInput"
                @change="setLimitRange"
                :min="1"
                :max="31">
              </el-input-number>
          </div>
        </div>
      </el-collapse-item>
    </div>
  </div>
</template>

<script>
import eventBus from '../../../utils/eventBus'
import {currentPeriod, comparePeriod} from '../searchUtils/common'
import periodType from './periodView/periodType'
export default {
  name: 'periodDate',
  data() {
    return {
      selectKey: 1,
      tabName: 'current'
    }
  },
  components: {
    periodType
  },
	computed: {
		// 获取vuex数据
    currentContainer () {
			return this.$store.state.charts.chartsOption.filter(item => item.selected)[0]
    },
    index () {
      return this.currentContainer.i
    },
    period () {
      return this.currentContainer.feature.periodData[0]
    },
    comparedRange: {
      get () {
        if (this.currentContainer.feature.periodData.length > 0) {
          return this.currentContainer.feature.periodData[0].compared
        } else {
          return false
        }
      },
      set (value) {
        this.$store.commit('setCompared', {
          index: this.index,
          value
        })
      }
    },
    typeValue: {
      get () {
        let period = this.currentContainer.feature.periodData[0]
        let type = 0
        period.selected.forEach(item => {
          if (this.selectKey === item.value) {
            type = item.type !== undefined ? item.type : 0
          }
        })
        return type
      },
      set (value) {
        let period = this.currentContainer.feature.periodData[0]
        this.$store.commit('changeSelectType', {
          index: this.index,
          value: value,
          key: this.selectKey
        })
      }
    },
    // 设置显示的控件类型
    availableKeys: {
      get () {
        let period = this.currentContainer.feature.periodData[0]
        let Arr = []
        period.selected.forEach(item => {
          if (item.disabled === undefined || !item.disabled) {
            Arr.push(item.value)
          }
        })
        return Arr
      },
      set (keyArr) {
        this.$store.commit('setDisabledPeriod', {
          index: this.index,
          keyArr
        })
        if (!keyArr.includes(this.selectKey)) {
          this.selectKey = keyArr[0]
        }
      }
    },
    // 可配置的时间类型
    availableCurrent () {
      return currentPeriod.filter(item => {
        return this.availableKeys.some(key => key === item.key)
      })
    },
    // 可配置的时间类型
    availableCompare () {
      return comparePeriod.filter(item => {
        return this.availableKeys.some(key => key === item.key)
      })
    },
    // 粒度: 实时
    realValue: {
      get () {
        let type = 0
        this.period.selected.forEach(item => {
          if (item.value === 0) {
            if (this.tabName === 'current') {
              type = item.type !== undefined ? item.type : 0
            }
            if (this.tabName === 'compare') {
              type = item.compareType !== undefined ? item.compareType : 0
            }
          }
        })
        return type
      },
      set (value) {
        this.$store.commit('changeSelectType', {
          index: this.index,
          value: value,
          key: 0,
          tabName: this.tabName
        })
      }      
    },
    // 粒度: 日
    dayValue: {
      get () {
        let type = 0
        this.period.selected.forEach(item => {
          if (item.value === 1) {
            if (this.tabName === 'current') {
              type = item.type !== undefined ? item.type : 0
            }
            if (this.tabName === 'compare') {
              type = item.compareType !== undefined ? item.compareType : 0
            }
          }
        })
        return type
      },
      set (value) {
        this.$store.commit('changeSelectType', {
          index: this.index,
          value: value,
          key: 1,
          tabName: this.tabName
        })
      }      
    },
    // 粒度: 周
    weekValue: {
      get () {
        let type = 0
        this.period.selected.forEach(item => {
          if (item.value === 2) {
            if (this.tabName === 'current') {
              type = item.type !== undefined ? item.type : 0
            }
            if (this.tabName === 'compare') {
              type = item.compareType !== undefined ? item.compareType : 0
            }
          }
        })
        return type
      },
      set (value) {
        this.$store.commit('changeSelectType', {
          index: this.index,
          value: value,
          key: 2,
          tabName: this.tabName
        })
      }      
    },
    // 粒度: 月
    monthValue: {
      get () {
        let type = 0
        this.period.selected.forEach(item => {
          if (item.value === 3) {
            if (this.tabName === 'current') {
              type = item.type !== undefined ? item.type : 0
            }
            if (this.tabName === 'compare') {
              type = item.compareType !== undefined ? item.compareType : 0
            }
          }
        })
        return type
      },
      set (value) {
        this.$store.commit('changeSelectType', {
          index: this.index,
          value: value,
          key: 3,
          tabName: this.tabName
        })
      }      
    },
    // 粒度: 季
    quaterValue: {
      get () {
        let type = 0
        this.period.selected.forEach(item => {
          if (item.value === 4) {
            if (this.tabName === 'current') {
              type = item.type !== undefined ? item.type : 0
            }
            if (this.tabName === 'compare') {
              type = item.compareType !== undefined ? item.compareType : 0
            }
          }
        })
        return type
      },
      set (value) {
        this.$store.commit('changeSelectType', {
          index: this.index,
          value: value,
          key: 4,
          tabName: this.tabName
        })
      }      
    },
    // 粒度: 年
    yearValue: {
      get () {
        let type = 0
        this.period.selected.forEach(item => {
          if (item.value === 5) {
            if (this.tabName === 'current') {
              type = item.type !== undefined ? item.type : 0
            }
            if (this.tabName === 'compare') {
              type = item.compareType !== undefined ? item.compareType : 0
            }
          }
        })
        return type
      },
      set (value) {
        this.$store.commit('changeSelectType', {
          index: this.index,
          value: value,
          key: 5,
          tabName: this.tabName
        })
      }      
    },
    // 粒度: 时
    hourValue: {
      get () {
        let type = 0
        this.period.selected.forEach(item => {
          if (item.value === 6) {
            if (this.tabName === 'current') {
              type = item.type !== undefined ? item.type : 0
            }
            if (this.tabName === 'compare') {
              type = item.compareType !== undefined ? item.compareType : 0
            }
          }
        })
        return type
      },
      set (value) {
        this.$store.commit('changeSelectType', {
          index: this.index,
          value: value,
          key: 6,
          tabName: this.tabName
        })
      }      
    },
    // 时间控件范围输入是否禁用
    forbidLimitInput () {
      return this.selectKey !== 1 ? true : false
    },
    // 可设置时间范围的select选项
    limitRangeArr () {
      // return this.period.selected.filter(item => item.isRange)
      return this.period.selected
    },
    // 设置限制范围
    limitValue: {
      get () {
        let limitRange = ''
        this.period.selected.forEach(item => {
          if (item.value === this.selectKey) {
            limitRange = item.limitRange !== undefined ? item.limitRange : ''
          }
        })
        return limitRange
      },
      set () {}
    }
  },
  mounted(){
    const periodConfig = this.currentContainer.feature.periodCategory
    this.initPeriodStyle(periodConfig)
    // 默认展开当前面板
    this.$nextTick(() => {
      this.$refs['collapse-period'].handleHeaderClick()
    })
    // 设置 配置范围 默认选项 (优先显示 天)
    if (this.limitRangeArr.length) {
      this.selectKey =  this.availableKeys.includes(1) ? 1 : this.availableKeys[0]
    }
  },
  methods: {
    // 初始化修改右侧面板数据
    initPeriodStyle(value)  {

    },
    sendCheckState(value) {
      this.$store.commit('changCheckstate', {
        index: this.currentContainer.i,
        comparedRange: value
      })
    },
    switchType (key) {
      currentPeriod.forEach( (item) => {
        if (item.key === key) {
          this.selectValue = item.selectValue
        }
      })
      //eventBus.$emit('switchTypeToPeriod')
    },
    // 设置限制范围
    setLimitRange (value) {
      // let re = /^[1-9]\d*$/g
      // if (!re.test(value)) {
      //   value = 30
      //   this.$refs['limitInput']._data.currentValue = 30
      // }
      this.$store.commit('setLimitRange', {
        index: this.index,
        limitRange: value,
        key: this.selectKey
      })
    }
  }
}
</script>

<style lang="less">
.right-Component {
  .period-content {
    .period-select {
      .name {
        font-size: 12px;
        color: #999999;
        margin-bottom: 8px;
        margin-top: 8px;
      }
      .period-select-op {
        margin-top: 8px;
        margin-bottom: 8px;
      }
      .select-container {
        margin-bottom: 4px;
        .typeName {
          display: inline-block;
          font-size: 14px;
          line-height: 28px;
          width: 50px;
          box-sizing: border-box;
          padding-left: 10px;
        }
      }
      .select-type {
        width: 70px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 8px;
        font-size: 12px;
      }
      .select-value {
        width: 90px;
        display: inline-block;
        vertical-align: middle;
        font-size: 12px;
      }
    }
    .el-input--mini .el-input__inner {
      font-size: 13px;
    }
  }
  .el-collapse-item {
    .el-collapse-item__header {
      border: 1px solid rgba(0,0,0,0.15);
      background-color: #F1F3F5;
      color: #666666;
      border-radius: 4px;
      padding-left: 10px;
      height: 32px;
      line-height: 32px;
      .el-collapse-item__arrow {
        line-height: 32px;
      }
    }
    .el-collapse-item__wrap {
      width: 100%;
      border-bottom: none;
      .el-collapse-item__content {
        padding-bottom: 0px;
      }
    }
  }
  .el-tabs__item {
    height: 32px;
    line-height: 32px;
  }
  .el-input-group__prepend {
    width: 75px;
  }
  .container_limit {
    font-size: 0;
  }
  .container_limit .el-input__inner {
    text-align: center;
  }
  .container_limit .selectOpt {
    display: inline-block;
    width: 65px;
  }
  .container_limit .selectOpt .el-input__inner {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  .container_limit .input_box {
    display: inline-block;
    width: 85px;
  }
  .container_limit .input_box .el-input__inner {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
  .el-tabs--border-card {
    box-shadow: none;
  }
}
</style>


