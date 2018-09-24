<!--   自定义日历选择组件   /-->
<!--   可通过滑块拖动来选择时间  /-->
<template>
  <div class="date-pickers">
    <div class="time_input_container">
      <span class="my-input__icon"><i class="el-icon-date"></i></span>

      <el-popover
        placement="bottom"
        v-model="showDropStart">
        <div slot="reference">
          <input id="inputStart" ref="start_popup" v-model="startTime" class="my-range_input" placeholder="开始日期" readonly>
        </div>
        <div class="popup-time_pick">
          <date-pick
            v-if="showDropStart"
            ref="START_PICK"
            :value="initStartTime"
            :relativeValue="endTime"
            type="START"
            @close="closeDropStart"
            @submit="getValueForStart">
          </date-pick>
        </div>
      </el-popover>

      <span class="input-separator">-</span>

      <el-popover
        placement="bottom"
        v-model="showDropEnd">
        <div slot="reference">
          <input id="inputEnd" ref="end_popup" v-model="endTime" class="my-range_input" placeholder="结束日期" readonly>
        </div>
        <div class="popup-time_pick">
          <date-pick
            v-if="showDropEnd"
            ref="END_PICK"
            :value="initEndTime"
            :relativeValue="startTime"
            type="END"
            @close="closeDropEnd"
            @submit="getValueForEnd">
          </date-pick>
        </div>
      </el-popover>

      <span class="clear_input" @click="clearInput"><i class="my-clear__icon el-icon-circle-close"></i></span>
    </div>
  </div>
</template>

<script>
import datePick from './dateHourPick.vue'
export default {
  name: 'datePickers',
  props: {
    date: {},
    value: {}
  },
  data () {
    return {
      showDropStart: false,
      showDropEnd: false,
      startTime: '',
      endTime: ''
    }
  },
  computed: {
    initStartTime () {
      if (Array.isArray(this.value) && this.value.length) {
        return this.value[0] ? this.value[0] : ''
      } else {
        return ''
      }
    },
    initEndTime () {
      if (Array.isArray(this.value) && this.value.length) {
        return this.value[1] ? this.value[1] : ''
      } else {
        return ''
      }
    },
    outputTime () {
      let timeArr = []
      timeArr.push(this.startTime)
      timeArr.push(this.endTime)
      return timeArr    
    }
  },
  watch: {
    value () {
      if (Array.isArray(this.value) && this.value.length) {
        this.startTime = this.value[0] ? this.value[0] : ''
        this.endTime = this.value[1] ? this.value[1] : ''
      }
    }
  },
  components: {
    'date-pick': datePick
  },
  mounted () {
    if (Array.isArray(this.value) && this.value.length) {
      this.startTime = this.value[0] ? this.value[0] : ''
      this.endTime = this.value[1] ? this.value[1] : ''
    }
    document.addEventListener('click', this.checkArea, true)
  },
  beforeDestroy () {
    document.removeEventListener('click', this.checkArea, true)
  },
  methods: {
    getValueForStart (value) {
      this.startTime = value
      this.sendEvents()
    },
    getValueForEnd (value) {
      this.endTime = value
      this.sendEvents()
    },
    closeDropStart () {
      this.showDropStart = false
    },
    closeDropEnd () {
      this.showDropEnd = false
    },
    clearInput () {
      this.startTime = ''
      this.endTime = ''
      this.$emit('input', null)
      this.$emit('change', null)
    },
    sendEvents () {
      this.$emit('input', this.outputTime)
      this.$emit('change', this.outputTime)
    },
    // 解决控件在tab容器中表现不良的问题
    // tab容器 对click做了stop处理
    checkArea (e) {
      if (!this.$el.contains(e.target) && this.$refs['START_PICK'] && this.$refs['END_PICK']) {
        if (this.showDropStart || this.showDropEnd) {
          this.showDropStart = false
          this.showDropEnd = false
        }
      } else {
        if (this.$refs['start_popup'].contains(e.target)) {
          this.showDropEnd = false
        }
        if (this.$refs['end_popup'].contains(e.target)) {
          this.showDropStart = false
        }
      }
    }
  }
}
</script>

<style scoped>
  .time_input_container {
    display: inline-flex;
    padding: 3px 10px;
    height: 32px;
    line-height: 28px;
    border: 1px solid #dcdfe6;
    color: #606266;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    box-sizing: border-box;
    font-size: 0;
  }
  .focus {
    border-color: #409EFF;
  }
  .time_input_container .my-input__icon {
    line-height: 24px;
    font-size: 13px;
    margin-left: -5px;
    margin-right: 6px;
    color: #c0c4cc;
  }
  .clear_input {
    text-align: center;
    color: #fff;
    margin-left: 4px;
    margin-right: -6px;
  }
  .clear_input:hover {
    color: #c0c4cc;
  }
  .my-clear__icon {
    line-height: 24px;
    font-size: 14px;
  }
  .time_input_container span {
    display: inline-block;
    vertical-align: middle;
  }
  .my-range_input {
    font-size: 13px;
    outline: none;
    border: none;
    width: 85px;
    text-align: center;
    color: #606266;
    height: 24px;
    box-sizing: border-box;
  }
  .my-range_input:hover {
    cursor: pointer;
  }
  .input-separator {
    font-size: 13px;
    width: 12px;
    text-align: center;
    line-height: 24px;
    color: #303133;
  }
</style>