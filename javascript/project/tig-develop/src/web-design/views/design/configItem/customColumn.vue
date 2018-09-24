<template>
  <div class="cus-col-wrap">
    <configHeader :name="name">
      <div @click="addCustomCol($event)">
        <Icon type="ios-plus-empty" class="plus-icon" style="cursor: pointer;"></Icon>
      </div>
    </configHeader>
    <div class="panel-wrap">
      <div class="panel" v-for="(item, index) in customColumn" :key="item.name">
        <div class="colum-title">
          <div class="icon-wrap" @click="handleCollapse(index)">
            <Icon
              class="collapse-icon"
              type="ios-arrow-down"></Icon>
            <span>自定义列</span>
          </div>
          <span @click="removeCol(item)">
            <Icon type="close-round" style="cursor: pointer;"></Icon>
          </span>
        </div>

        <div class="content" :class="{active: item.collapse}">
          <div class="padding-box">
            <div class="name-wrap">
              <span class="desc">列名称</span>
              <Input
                size="small"
                class="colName"
                :maxlength="20"
                v-model="item.cusName"
                placeholder="请输入自定义名称"/>
            </div>
            <div>
              <div>列设置</div>
              <RadioGroup
                :value="item.colSetting"
                vertical
                @on-change="handleSettingChange(item, index, $event)">
                <Radio :label="0"><span>计算方式</span></Radio>
                <Radio :label="1"><span>同环比</span></Radio>
                <Radio :label="2"><span>对比</span></Radio>
              </RadioGroup>
              <Input
                v-show="item.colSetting === 0"
                size="small"
                v-model="item.formula"
                placeholder="(A+B)/C*100"/>
                <p style="font-size: 10px; color: #ccc; text-align: justify; padding: 10px 6px 0 2px;" v-show="item.colSetting === 0">tips: 计算公式仅能关联指标列，请正确选择代表表头位置的字母,关联维度列会让您无法查询到自定义列数据</p>
              <!--同环比-->
              <Select
                v-show="item.colSetting === 1"
                v-model="item.target"
                size="small"
                @on-change="setItemId(index, $event)"
                placeholder="请选择要关联的指标">
                <Option v-for="j in columnList" :value="j.id" :key="j.id"> {{ j.name }}</Option>
              </Select>
              <Select
                v-show="item.colSetting === 1"
                v-model="item.ratio"
                size="small"
                placeholder="请选择关联的条件"
                style="margin-top: 10px;">
                <Option v-for="k in list" :value="k.value" :key="k.value"> {{ k.name }} </Option>
              </Select>
              <!--对比-->
              <div class="contrast" v-show="item.colSetting === 2">
                <Select
                v-model="item.target"
                size="small"
                @on-change="setItemId(index, $event)"
                placeholder="请选择要关联的指标">
                <Option v-for="j in columnList" :value="j.id" :key="j.id"> {{ j.name }}</Option>
                </Select>
                <Select
                v-model="item.ratio"
                size="small"
                placeholder="请选择关联的条件"
                style="margin-top: 10px;">
                  <Option v-for="k in contrastList" :value="k.value" :key="k.value"> {{ k.name }} </Option>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ConfigHeader from './ConfigHeader'

/* eslint-disable */
  export default {
    components: {
      ConfigHeader
    },
    name: 'design-config-customColumn',
    watch: {
      customColumn: {
        handler(val) {
          this.$store.commit('handleCustomColumnChange', val)
          // 将自定义列推到customList上
          // TIG-321 Fix columnList的顺序会因为修改自定义列的名称而改变
          // solution 只有自定义i长度改变时才触发此mutation
          this.$store.commit('addCustomToColumnList', val)
        },
        deep: true
      },
      _customColumn: {
        handler(val) {
          this.customColumn = val
          // 处理自定义列与列数据同步的问题
          /* if (val) {
            this.$store.commit('syncCustomWithColumnList', val)
          } */
        },
        deep: true
      }
    },
    computed: {
      _customColumn() {
        return this.$store.getters.getCustomColumn
      },
      columnList() {
        return this.$store.getters.getMetric
      }
    },
    data() {
      return {
        formulaShow: true,
        name: '自定义列设置',
        colSetting: '计算方式',
        customList: [],
        list: [
          {
            name: '同期值',
            value: 1
          },
          {
            name: '同比率',
            value: 2
          },
          {
            name: '环比值',
            value: 3
          },
          {
            name: '环比率',
            value: 4
          }
        ],
        contrastList: [
          {
            name: '对比值',
            value: 5
          },
          {
            name: '对比率',
            value: 6
          }
        ],
        // 自定义列数据type --> 2代表自定义列
        customColumn: [
          /* {
           name: '自定义列名称', // 自定义列名称
           collapse: true, // 控制收缩
           type: 2, // type --> 2 指明列类型 --> 自定义列
           align: 'center', // 默认居中
           id: '', // 根据时间戳生成唯一id --> 选择同环比的自定义列id格式为  ‘_1 _2’ + 选择度量的id
           colSetting: 0, // 列设置 0 计算方式 1 同环比 3 对比
           formula: '', // 自定义列计算公式
           target: '' // 自定义列选择同环比是选择的具体指标
           ratio: 0 // 同比0 环比1 对比2
           } */
        ],

      }
    },
    mounted() {
      // 初始化
      // this.customColumn = this.$store.getters.getCustomColumn
      // 交叉表是没有自定义列的
      const reportType = this.$route.query.reportType
      if (parseFloat(reportType) === 2) {
        this.customColumn = []
      } else {
        this.customColumn = this.$store.state.design.columnList.filter(v => v.type === 2)
      }
    },
    methods: {
      addCustomCol() {
        // 使用时间戳作为新增自定义列的唯一id
        const id = new Date().getTime()
        this.customColumn.push({
          cusName: '新增',
          timestamp: id,
          title: '新增',
          collapse: true,
          type: 2,
          align: 'center',
          alignDisplay: {
            horizontal: 6,
            vertical: 2
          },
          formatter: {
            type: 0, // 数值类型：0 -->数值， 1 -->百分比
            decimals: 2, // 小数点位数
            thousands: false
          },
          id: `${id}`,
          colSetting: 0,
          formula: '',
          target: '',
          ratio: null
        })
      },
      handleCollapse(index) {
        this.customColumn[index].collapse = !this.customColumn[index].collapse
      },
      handleSettingChange(item, index, data) {
        // 在每次切换的时候重置
        this.customColumn[index].target = this.columnList[0].id
        // 所有自定义列排斥规则,同比和环比不能同时存在
        // 所以在每次触发该方法时,获取所有自定义列的列属性 colSetting
        // 在选择同环比时,检查此时除当前操作项之外的所有项是否有对比选项
        let flag = false
        if (data === 1) {
          this.customColumn.forEach((v, i) => {
            if (index !== i && v.colSetting === 2) {
              flag = true
            }
          })
        }
        // 在选择对比时,检查此时除当前操作项之外的所有项是否有同环比选项
        if (data === 2) {
          this.customColumn.forEach((v, i) => {
            if (index !== i && v.colSetting === 1) {
              flag = true
            }
          })
        }
        if (flag) {
          this.$Message.error('自定义列中不能同时选择同环比和对比选项')
          return false
        }
        // 当切换计算公式和同环比时，改变当前自定义列的id
        const timestamp = new Date().getTime().toString()
        if (data === 0) {
          this.customColumn[index].id = timestamp
        } else if (data === 1 || data === 2) {
          if (item.target) {
            this.customColumn[index].id = `${item.target}-${timestamp}`
          } else {
            this.customColumn[index].id = `${this.columnList[0].id}-${timestamp}`
          }
        }
        // 切换同环比的时候，重置ratio
        if (data === 1) {
          this.customColumn[index].ratio = 1
        }
        if (data === 2) {
          this.customColumn[index].ratio = 5
        }
        // on-change选择同环比时，遍历columnList，如果有时间维度，就去掉
        if (data === 1) {
          this.$store.commit('removeTimeFromColumnList')
        }

        const id = item.id
        this.customColumn.forEach((v) => {
          if (v.id === id) {
            v.colSetting = data
          }
        })
        return true
      },
      removeCol(item) {
       // 删除当前行
        this.$store.commit('deleteCustomSyncWithCol', item)

        this.customColumn.forEach((v, i, arr) => {
          if (item.id === v.id) {
            arr.splice(i, 1)
          }
        })
      },
      // 选择关联指标时，将当前自定义列id置为固定形式
      setItemId(index, data) {
        const timestamp = new Date().getTime().toString()
        this.customColumn[index].id = `${data}-${timestamp}`
      }
    }
  }
</script>

<style scoped lang="less">
  @distance-justice: 16px;
  @tabMainColor: #00C5E1;
  .panel-wrap {
    padding: 8px 4px;
    .panel {
      margin-bottom: 10px;
      .colum-title {
        padding: 3px 8px;
        border-radius: 3px;
        margin-bottom: 3px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #fff;
        .collapse-icon {
          display: inline-block;
          cursor: pointer;
          margin-right: 6px;
        }
      }
      .icon-wrap {
        cursor: pointer;
      }
      .content {
        padding: 0;
        display: block;
        height: 0;
        overflow: hidden;
        border-radius: 3px;
        background-color: #fff;
        transition: height .1s linear;
        .padding-box {
          padding: 10px 12px 20px 14px;
          text-align: left;
        }
        &.active {
          height: auto;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 0;
          transition: all .1s linear;
        }
        .name-wrap {
          width: 100%;
          padding: 10px 0 16px;
          .desc {
            display: block;
            padding-bottom: 10px;
          }
        }
        .radio-group {
          margin: 10px;
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
</style>
<style lang="less">
  .cus-col-wrap {
    padding-bottom: 180px;
    .ivu-input {
      width: 140px;
    }
  }
</style>

