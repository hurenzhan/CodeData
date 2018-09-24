<template>
  <div>
    <configHeader :name="name"></configHeader>
    <div class="drill-wrap">
      <div class="dill-title">选择维度</div>
      <Select
        :value="drill.selectedDrillItem.id"
        size="small" style="margin-bottom: 18px;"
        :clearable="true"
        @on-change="getDrillRouter"
      >
        <Option v-for="item in dimList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <div class="dill-title">下钻路径</div>
      <Select
        :value="drill.dirllRoad.routeCode"
        size="small"
        @on-change="setDrillRouter">
        <Option v-for="item in list" :value="item.routeCode" :key="item.routeCode">{{ item.routeNm }}</Option>
      </Select>
    </div>
  </div>
</template>

<script>
  import api from '@/web-design/api/design'
import ConfigHeader from './ConfigHeader'

/* eslint-disable */
  export default {
    components: {
      ConfigHeader
    },
    name: 'design-config-drill',
    computed: {
      dimList() {
        return this.$store.getters.getColumnList.filter(item => item.type === 0)
      },
      metricsCodes() {
        return this.$store.state.design.metric
      },
      _drill() {
        return this.$store.getters.getDrill
      },
      _metric() {
        return this.$store.state.design.metric
      },
      _reportFunction() {
        return this.$store.state.design.reportFunction
      }
    },
    data() {
      return {
        name: '上卷下钻',
        drill: {
          selectedDrillItem: {
            name: '',
            id: '',
          },
          dirllRoad: {
            routeCode: '',
            routeNm: '',
            dimRoute: ''
          }
        },
        list: []
      }
    },
    watch: {
      drill: {
        handler(val) {
          this.$store.commit('handleDrillChange', val)
          this.$store.commit('renderColumns')
        },
        deep: true
      },
      _drill: {
        handler(val) {
          this.drill = val
        },
        deep: true
      }
    },
    mounted() {
      this.drill = this._drill
    },
    methods: {
      async getDrillRouter(id) {
        if (this.drill.selectedDrillItem.id && !id) {
          Object.keys(this.drill.selectedDrillItem).forEach((v) => {
            this.drill.selectedDrillItem[v] = ''
          })
          Object.keys(this.drill.dirllRoad).forEach((v) => {
            this.drill.dirllRoad[v] = ''
          })
          this.list = []
          return false
        }
        // 维值切分和下卷下钻互斥
        const reportFunction = this._reportFunction
        if (reportFunction === 1 && id) {
          this.$Message.info('维值切分和上卷下钻是互斥选项')
          this.$store.commit('handleReportFunction', 0)
        }
        // 清空操作
        if (!id) {
          Object.keys(this.drill.dirllRoad).forEach((v) => {
            this.drill.dirllRoad[v] = ''
          })
          this.list = []
          return false
        }
        // 二维表是从 columnList 中取 metricsCodes
        // 二维表额外考虑自定义列id的状况
        /* let metricsCodes = this.metricsCodes.map(v => v.id).join(',') */
        const metricsCodes = this.metricsCodes.map((v) => {
          if (v.id.includes('-')) {
            return v.id.split('-')[0]
          }
          return v.id
        }).join(',')
        const data = await api.uprolldrilldown(id, metricsCodes)
        if (data && data.data) {
          this.list = data.data
        }
        // 获取上卷下钻的维度name和id
        this.dimList.forEach((v) => {
          if (v.id === id) {
            const config = {
              name: v.name,
              id: v.id
            }
            this.drill.selectedDrillItem = config
          }
        })
        // 每次切换时，清空上卷下钻路径
        return true
      },
      setDrillRouter(code) {
        const reportFunction = this._reportFunction
        if (reportFunction === 1 && code) {
          this.$Message.info('维值切分和上卷下钻是互斥选项')
          this.$store.commit('handleReportFunction', 0)
        }
        if (this.list) {
          // 获取上卷下钻的路径code和name
          this.list.forEach((v) => {
            if (v.routeCode === code) {
              const config = {
                routeCode: v.routeCode,
                routeNm: v.routeNm,
                dimRoute: v.route
              }
              this.drill.dirllRoad = config
            }
          })
        }
      },
    }
  }
</script>

<style scoped lang="less">
  .drill-wrap{
    padding: 20px 14px;
    .dill-title{
      padding-bottom: 10px;
    }
  }
</style>
