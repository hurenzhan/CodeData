<template>
  <div>
    <configHeader :name='name'></configHeader>
    <div class='freeze-wrap'>
      <div class=''>
        <div>冻结表格头</div>
        <RadioGroup class='radio-group' v-model='freeze.freezeBoolean' @on-change="change">
          <Radio :label='1'><span>是</span></Radio>
          <Radio :label='0'><span>否</span></Radio>
        </RadioGroup>
      </div>
      <div class='cols'>
        <div>冻结前N列</div>
        <el-input-number size="mini" controls-position="right" :min="0"   v-model="freeze.rowNumber" @blur="changeFreezeColumn" ref="freezeRow"></el-input-number>
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
  name: 'design-config-stable',
  data() {
    return {
      name: '冻结',
      freeze: {
        // 冻结表格头（是否冻结，冻结前N列）
        freezeBoolean: 0,
        rowNumber: 0
      }
    }
  },
  computed: {
    _freeze() {
      return this.$store.getters.getFreeze
    },
    handsonMerge() {
      return this.$store.state.design.handsonMerge
    },
    columnList() {
      return this.$store.state.design.columnList
    }
  },
  watch: {
    _freeze: {
      handler(val) {
        this.freeze = val
      },
      deep: true
    }
  },
  mounted() {
    this.freeze = this._freeze
  },
  methods: {
    /* eslint-disable */
    changeFreezeColumn(e) {
      const data = Number(e.target.value)
      // 判断输入的冻结列数值是否和合并单元格冲突
      const flag = this.handsonMerge.some((v) => {
        const sum = v.col + v.colspan
        return data < sum && data > v.col
      })
      // 判断输入的是不是正整数
      if(!Number.isInteger(data)) {
        this.freeze.rowNumber = 0
        this.$Message.error('请输入符合条件的整数')
      }
      if (flag) {
        this.freeze.rowNumber = 0
        this.$Message.error(`由于合并单元格的限制，您不能固定自定义表格前${data}行`)
      }
      // 判断输入的是不是正整数
      if(data > this.columnList.length) {
        this.freeze.rowNumber = this.columnList.length
        this.$Message.error('超过了最大可设置数')
      }
      this.$store.commit('handleFreezeChange', this.freeze)
      this.$store.commit('renderColumns')
    },
    change() {
      this.$store.commit('renderColumns')
    }
  }
}
</script>

<style scoped lang='less'>
.freeze-wrap {
  padding: 20px 14px;
  .radio-group {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding: 0 10px;
  }
}
.freeze-cols {
  width: 60%;
  margin-top: 16px;
}
.cols {
  margin-top: 28px;
}
</style>
<style lang='less'>
.freeze-wrap {
  & > span {
    display: none;
  }
  .el-input-number__decrease{
    display: none !important
  }
  .el-input-number__increase{
    display: none !important
  }
  .el-input input.el-input__inner{
    padding: 0 30px;
  }
}
</style>
