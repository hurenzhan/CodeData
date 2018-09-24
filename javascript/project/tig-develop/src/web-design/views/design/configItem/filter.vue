<template>
  <div style="padding-bottom: 180px;">
    <configHeader :name="name">
      <div 
        @click="switchSence" 
        style="width: 20px;text-align:right; cursor: pointer;">
        <!-- <Icon 
          v-show="displaySence" 
          type="ios-plus-empty" 
          class="plus-icon">
        </Icon>
        <Icon v-show="!displaySence" type="ios-arrow-back" class="plus-icon"></Icon> -->
      </div>
    </configHeader>

    <div>
      <div class="tabs-wrap">
        <Tabs :value="activeKey">
          <TabPane label="维度" name="dim">
            <Input placeholder="请输入维度关键词" v-model="keyWordForDim"/>
            <div class="dim-list list">
              <div class="dim-item item" v-for="(item, index) in getDim" :key="index"  v-show="item.name &&item.name.includes(keyWordForDim)">
                 <Checkbox
                  v-show="item.id !== 'dasp_date'"
                  :value="filterExist(item)"
                  @on-change="syncFilter(item, $event)"><span class="text" :title="item.name">{{item.name}}</span></Checkbox>
              </div>
            </div>
            <div class="panel-wrap">
              <div 
                class="panel" 
                v-for="(item, index) in filterListFromVuex"
                v-if="item.type === 0"
                :key="index">
                <div class="filter-title">
                  <div class="icon-wrap" @click="handleCollapse(index)">
                    <Icon
                      class="collapse-icon"
                      type="ios-arrow-down"></Icon>
                    <span>{{ item.name }}</span>
                  </div>
                  <div class="remove" @click="removeFilter(item)" style="cursor: pointer;">
                    <Icon type="close-round"></Icon>
                  </div>
                </div>

                <div class="content" :class="{active: item.collapse}">
                  <el-select
                    class="condition"
                    size="small"
                    v-if="item.type === 0"
                    :value="item.filterCondition"
                    @change="handleSingleOrMultiple(index, $event)">
                    <el-option
                      v-for="i in filterConditionList"
                      v-show="i.value !== 4 && i.value !== 5"
                      :value="i.value"
                      :label="i.label"
                      :key="i.value">
                    </el-option>
                  </el-select>
                    <!-- 多选 -->
                    <el-select
                      class="condition"
                      size="small"
                      multiple
                      filterable
                      allow-create
                      remote
                      :remote-method="query => remoteQueryDim(item.id, query)"
                      @change="changeFilterValue(index, $event)"
                      :value="item.filterValue"
                      v-if="item.type === 0"
                      v-show="item.filterCondition === 6 || item.filterCondition === 7"
                      placeholder="选择多个筛选条件">
                      <el-option
                        v-for="i in item.queryDimValue"
                        :value="i.dimValueNm"
                        :label="i.dimValueNm"
                        :key="i.dimValue">
                      </el-option>
                    </el-select>
                    <!-- 单选 -->
                    <el-select
                      class="condition"
                      size="small"
                      filterable
                      allow-create
                      remote
                      :remote-method="query => remoteQueryDim(item.id, query)"
                      :multiple = "false"
                      v-if="item.type === 0"
                      v-show="item.filterCondition !== 6 && item.filterCondition !== 7"
                      placeholder="选择单个筛选条件"
                      :value="Array.isArray(item.filterValue) ? '' : item.filterValue"
                      @change="changeFilterValue(index, $event)">
                      <el-option 
                        v-for="i in item.queryDimValue" 
                        :value="i.dimValue" 
                        :key="i.dimValue" 
                        :label="i.dimValueNm">
                      </el-option>
                    </el-select>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane label="度量" name="metric">
            <Input placeholder="请输入度量关键词" v-model="keyWordForMetric"/>
            <div class="metric-list list">
              <div class="dim-item item" v-for="(item, index) in merticInColumnList" :key="index" v-show="item.name.includes(keyWordForMetric)">
                 <Checkbox
                  :value="filterExist(item)"
                  @on-change="syncFilter(item,$event, 'metric')"><span class="text" :title="item.name">{{item.name}}</span></Checkbox>
              </div>
            </div>
            <div class="panel-wrap">
              <div 
                class="panel" 
                v-for="(item, index) in filterListFromVuex"
                v-if="item.type === 1"
                :key="index">
                <div class="filter-title">
                  <div class="icon-wrap" @click="handleCollapse(index)">
                    <Icon
                      class="collapse-icon"
                      type="ios-arrow-down"></Icon>
                    <span>{{ item.name }}</span>
                  </div>
                  <div class="remove" @click="removeFilter(item)" style="cursor: pointer;">
                    <Icon type="close-round"></Icon>
                  </div>
                </div>

                <div class="content" :class="{active: item.collapse}">
                  <el-select
                    class="condition"
                    size="small"
                    v-if="item.type === 1"
                    :value="item.filterCondition"
                    @change="handleSingleOrMultiple(index, $event)">
                      <el-option
                      :value="i.value"
                      v-for="i in filterConditionList.slice(0, 2)"
                      :label="i.label"
                      :key="i.value">
                    </el-option>
                  </el-select>
                  <!-- 指标作为过滤条件 -->
                  <el-input
                    size="small"
                    :value="item.filterValue"
                    @change="changeFilterValue(index, $event)"
                    placeholder="筛选条件"
                    v-if="item.type === 1"></el-input>
                </div>
              </div>
            </div>
          </TabPane> 
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapGetters } from 'vuex'
import _differenceBy from 'lodash.differenceby'
import api from '@/web-design/api/design'
import _debounce from 'lodash.debounce'
import ConfigHeader from './ConfigHeader'

/* eslint-disable */
  export default {
    components: {
      ConfigHeader
    },
  name: 'design-config-filter',
  computed: {
    merticInColumnList() {
      let reportType = this.$route.query.reportType
      if (parseInt(reportType) === 1) {
        return this.$store.state.design.columnList.filter(v => v.type === 1)
      } else {
        const crossMetric = []
        const crossMetricInit = this.$store.state.design.crossMetric
        if (crossMetricInit.id !== '') {
          crossMetric.push(crossMetricInit)
        }
        return crossMetric
      }  
    },
    activeKey() {
      return this.$store.state.design.activeKey
    },
    ...mapGetters([
      'getDim',
      'getMetric'
    ]),
    filterListFromVuex() {
      // 过滤筛选条件只有维度
      const dim = this.$store.state.design.filterList
      return dim
    }
  },
  watch: {
    filterListFromVuex: {
      handler(val, oldVal) {
        // this.filterList = this.filterListFromVuex
        const differenceGuy = _differenceBy(val, oldVal, 'id')
        // 处理维值查询ajax请求
        // 在过滤条件是维度的情况下再进行维值查询
        // 每次只能添加一个？
        if (differenceGuy.length === 1 && differenceGuy[0].type === 0) {
          api.queryDimValue(differenceGuy[0].id).then((data) => {
            if (!data) return false
            const config = {}
            config.id = differenceGuy[0].id
            config.queryDimValue = data.data
            this.$store.commit('saveDimValue', config)
            return true
          })
        }
      },
      deep: true
    }
  },
  data() {
    return {
      name: '筛选',
      displaySence: true,
      keyWordForDim: '',
      keyWordForMetric: '',
      filterConditionList: [ // 指标6，7改为4，5
        {
          value: 0,
          label: '大于'
        },
        {
          value: 1,
          label: '小于'
        },
        {
          value: 2,
          label: '大于等于'
        },
        {
          value: 3,
          label: '小于等于',
        },
        {
          value: 4,
          label: '等于'
        },
        {
          value: 5,
          label: '不等于',
        },
        {
          value: 6,
          label: '等于' // in
        },
        {
          value: 7,
          label: '不等于' // not in
        }
      ]
    }
  },
  created() {
  },
  methods: {
    remoteMethod(id, query) {
      const self = this
     // _debounce(function () {
        self.queryDimValue(id, query)
     // }, 400)
      return true
    },
    remoteQueryDim: _debounce(function (id, query) {
      this.remoteMethod(id, query)
    }, 150),
    async queryDimValue(id, query) {
      const data = await api.queryDimValue(id, query)
      if (!data) return false
      const config = {}
      config.id = id
      config.queryDimValue = data.data
      this.$store.commit('saveDimValue', config)
      return true
    },
    changeFilterValue(index, data) {
      this.$store.commit('changeFilterValue', { index, data })
    },
    filterExist(item) {
      const filterList = this.filterListFromVuex.map(v => v.id)
      if (filterList.includes(item.id)) return true
      return false
    },
    handleCollapse(index) {
      this.$store.commit('changeFilterListCollapse', index)
    },
    switchSence() {
      this.displaySence = !this.displaySence
    },
    // 点击筛选面板的checkbox 同步全局的已被选择的筛选条件
    syncFilter(item, result, metric) {
      const payload = {}
      payload.item = item
      payload.type = result ? 1 : 0 // false --> 0 删除， true --> 增加
      // const id = item.id
      this.$store.commit('syncSelected', payload)
      if(!metric) {
      this.queryDimValue(item.id, '')
      }
    },
    handleSingleOrMultiple(index, data) {
      // 0大于, 1小于, 2大于等于, 3小于等于，6 等于，7不等于，6,7可以多选
      this.$store.commit('handleSingerOrMultipleSwitch', { index, value: data })
    },
    removeFilter(item) {
      const payload = {}
      payload.item = item
      payload.type = 0
      this.$store.commit('syncSelected', payload)
    }
  }
}
</script>
<style lang="less" scoped>
@distance-justice: 16px;
@tabMainColor: #00C5E1;
.plus-icon{
  cursor: pointer;
}
// 截断文本显示省略号mixin
.ellipsis{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tabs-wrap{
  width: 200px;
  .list{
    margin-top: 6px;
    border-radius: 3px;
    background-color: #fff;
    padding: 3px;
    padding-left: 12px;
    padding-top: @distance-justice;
    .item{
      margin-bottom: @distance-justice;
      .text{
        display: inline-block;
        width: 80px;
        .ellipsis
      }
    }
  }
}

.panel-wrap{
  padding: 8px 14px;
  .panel{
    margin-bottom: 10px;
    .filter-title{
      padding: 3px 8px;
      border-radius: 3px;
      margin-bottom: 3px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #fff;
      .collapse-icon{
        display: inline-block;
        cursor: pointer;
        margin-right: 6px;
      }
    }
    .content{
      height: 0;
      overflow: hidden;
      padding: 0;
      display: block;
      border-radius: 3px;
      background-color: #fff;
      transition: height .1s linear;
      &.active{
        height: 110px;
        overflow: auto;
        padding: 10px 6px;
        transition: height .1s linear;
      }
      .ivu-select-selection{
        background-color: #F5F5F5;
      }
      .ivu-input{
        background-color: #F5F5F5;
      }
      .condition{
        margin: 5px 0;
      }
    }
  }
  .el-select--small{
    /* max-height: 50px;
    overflow-y: auto; */
  }
}
</style>

<style lang="less">
@tabMainColor: #00C5E1;
.tabs-wrap{
  padding: 10px;
  .ivu-tabs-bar{
    width: 100%;
    .ivu-tabs-tab{
      width: 50%;
    }
  }
  .ivu-checkbox-wrapper{
    display: flex;
    align-items: center;
  }
  .el-tag--small{
    width: 100px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
}
</style>

