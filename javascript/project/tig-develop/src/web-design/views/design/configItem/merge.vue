<template>
  <div>
    <configHeader :name="name"></configHeader>
    <div class="combin-wrap">
      <div class="row">
        <div>合并列</div>
        <el-select
          class="combin-col"
          v-model="subtotal.mergeColumn"
          size="small"
          multiple
          @change="frontColumnList">
          <el-option v-for="item in list" :value="item.id" :key="item.id" :label="item.name"></el-option>
        </el-select>
      </div>
      <div class="row">
        <div>合计</div>
        <el-select class="combin-col"  v-model="subtotal.total" size="small" multiple>
          <el-option v-for="item in nextList" :value="item.id" :key="item.id" :label="item.name"></el-option>
        </el-select>
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
    name: 'design-config-merge',
    data() {
      return {
        name: '分类汇总',
        subtotal: { // 分类汇总
          mergeColumn: [], // 合并列
          total: [] // 合计
        }
      }
    },
    methods: {
      frontColumnList() {
        // 合计来自合并列，选择值要保持同步，不能下面选了值，上面取消，下面也要跟着取消
        this.subtotal.total.forEach((v, i, arr) => {
          if (!this.subtotal.mergeColumn.includes(v)) {
            arr.splice(i, 1)
          }
        })
        // 将合并列放到列的最前面
        // this.$store.commit('handleMergeCellInColumnList', data)
      }
    },
    computed: {
      list() {
        const columnList = this.$store.getters.getColumnList.filter(v => v.type === 0)
        return columnList
      },
      _subtotal() {
        // console.log(this.$store.getters.getSubtotal)
        return this.$store.getters.getSubtotal
      },
      // 根据合并列已选项获取合并备选项
      nextList() {
        const enableList = []
        this.subtotal.mergeColumn.forEach((v) => {
          this.list.forEach((j) => {
            if (v === j.id) {
              enableList.push({
                id: j.id,
                name: j.name
              })
            }
          })
        })
        return enableList
      }
    },
    watch: {
      subtotal: {
        handler(val) {
          // console.log(this.$store)
          this.$store.commit('handleSubtotalChange', val)
        },
        deep: true
      },
      _subtotal: {
        handler(val) {
          this.subtotal = val
        },
        deep: true
      }
    },
    mounted() {
      this.subtotal = this._subtotal
    }
  }
</script>

<style scoped lang="less">
.combin-wrap{
  padding: 20px 14px;
  .combin-col{
    margin-top: 10px;
  }
  .row{
    margin-top: 10px;
  }
}
</style>
