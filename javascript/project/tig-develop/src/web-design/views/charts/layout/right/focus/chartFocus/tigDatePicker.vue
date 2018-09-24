<template>
  <div class="tig-date-picker">
    <el-button-group class="tig-date-picker-title">
      <el-button
        v-for="(item, index) in types"
        :key="index"
        size="mini"
        :type="item.value===type?'primary':''"
        @click="typeChange(item.value)"
        :disabled="btnDisabled(index, item.value)"
      >
        {{item.name}}
      </el-button>
    </el-button-group>
    <!--周-->
    <div class="date-pickers" v-if="type==='week'">
      <el-date-picker
        popper-class="tig-popper-item"
        class="date-picker-item"
        format="yyyy 第W周"
        v-for="(item,index) in 2"
        :key="type + index"
        size="mini"
        :clearable="false"
        v-model="value[index]"
        :type="type.split('-')[0]"
        :placeholder="index===0?'开始时间':'结束时间'"
        :picker-options="index === 0 ? pickerOptions0 : pickerOptions1"
      >
      </el-date-picker>
      <i class="range-separator">-</i>
    </div>
    <!--季度-->
    <div class="date-pickers" v-else-if="type==='quarter'">
      <quarter-picker
        class="date-picker-item"
        v-for="(item,index) in 2"
        :key="type + index"
        size="mini"
        v-model="value[index]"
      >
      </quarter-picker>
      <i class="range-separator">-</i>
    </div>
    <!--非周-->
    <div class="date-pickers" v-else>
      <el-date-picker
        popper-class="tig-popper-item"
        class="date-picker-item"
        :value-format="valueFormat"
        v-for="(item,index) in 2"
        :key="type + index"
        size="mini"
        :clearable="false"
        v-model="value[index]"
        :type="type.split('-')[0]"
        :placeholder="index===0?'开始时间':'结束时间'"
        :picker-options="index === 0 ? pickerOptions0 : pickerOptions1"
      >
      </el-date-picker>
      <i class="range-separator">-</i>
    </div>
  </div>
</template>

<script>
  import {dateTypeMap, dateTypes} from '../../../../utils/utils'
  import quarterPicker from '../../../../components/search/otherView/quaterDate'

  export default {
    name: 'TigDataPicker',
    props: {
      value: {},
      type: {
        type: String,
        default: 'date' // year,month,date
      },
      minDateTypeCode: {}, // 最小时间粒度
    },
    components: {quarterPicker},
    data () {
      return {
        types: dateTypes, // 时间控件类型
      }
    },
    computed: {
      valueFormat () {
        let tmpFormat = 'yyyy-MM-dd'
        if (this.type === 'datetime-hour') tmpFormat = 'yyyy-MM-dd-HH'
        if (this.type === 'week') tmpFormat = ''
        if (this.type === 'month') tmpFormat = 'yyyy-MM'
        if (this.type === 'year') tmpFormat = 'yyyy'
        return tmpFormat
      },
      pickerOptions0 () {
        // oneDayTime现在需要置为0，因为不需要禁止今天
        // const oneDayTime = 86400000
        const oneDayTime = 0
        const disabledDate = (time) => {
          return time.getTime() > Date.now() - oneDayTime || time.getTime() > new Date(this.value[1]).getTime()
        }
        return {disabledDate}
      },
      pickerOptions1 () {
        const oneDayTime = 86400000
        const disabledDate = (time) => {
          return time.getTime() > Date.now() || time.getTime() < new Date(this.value[0]).getTime() - oneDayTime
        }
        return {disabledDate}
      }
    },
    methods: {
      // 日历类型change
      typeChange (value) {
        if (value === this.type) return
        this.$emit('update:type', value)
        this.$emit('input', [])
        this.$emit('change')
      },
      // 时间粒度的按钮是否需要置灰
      btnDisabled (index, value) {
        return dateTypes.map(item => item.dateTypeCode).indexOf(this.minDateTypeCode) > index
      }
    }
  }
</script>

<style lang="less">
  .tig-date-picker {
    position: relative;
    >.tig-date-picker-title{
      // position: absolute;
      // top: -9px;
      // right: 0;
      // transform: translateY(-100%);
      >button{
        padding: 5px 7px;
      }
    }
    .date-pickers {
      display: flex;
      justify-content: space-between;
      .date-picker-item {
        width: 48%;
        >input{
          padding-right: 0;
          padding-left: 20px;
          font-size: 12px;
        }
        >span{
          left: 0;
          top: -1px;
        }
      }
      .range-separator{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
      >.wrapper_quater .quater_pick{
        position: fixed;
        top: 362px;
        left: 80%;
      }
    }
  }
  .tig-popper-item{
    .el-time-panel{
      left: unset;
      right: 0;
      .el-time-panel__content.has-seconds{
        &:before, &:after{
          margin-top: -9px!important;
        }
        .el-scrollbar__wrap{
          margin-right: -18px!important;
        }
      }
    }
  }
</style>
