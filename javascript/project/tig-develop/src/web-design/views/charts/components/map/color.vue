<template>
  <div class="color-picker" ref="custom-color-picker">
    <div class="color-picker_trigger" @click.stop="OpenPicker">
      <span class="color-picker_outer">
        <span class="color-picker_inner" :style="{ backgroundColor: color }"></span>
      </span>
    </div>

    <div class="list-container" v-if="dropDown">
      <ul v-model="color">
        <li v-for="(value, index) in colors" :key="index" @click.stop="selected(value)" :class="{'activeLi': activeIndex === index}">
          <span class="option_outer" :style="{ borderColor: value}">
            <span class="option_inner" :style="{ backgroundColor: value }"></span>
          </span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
  import colorPicker from './color.vue'
  export default {
    name: 'color-picker',
    components: {

    },
    props: {
      value: {
        default: "#AC96FB"
      },
      colors: {
        default: [
          "#AC96FB",
          "#5EB1FF",
          "#8B9EF7",
          "#E78A5F",
          "#F2AF16",
          "#FFE070",
          "#98C959",
          "#CBDB37",
          "#597EF7",
          "#39D4D4",
          "#CBDB37"
        ]
      }
    },
    data() {
      return {
        dropDown: false
      }
    },
    computed: {
      color () {
        return this.value
      },
      activeIndex () {
        for (let i = 0; i < this.colors.length; i++) {
          if (this.colors[i] === this.value) {
            return i
          }
        }
        return 0
      }
    },
    watch: {
      styleConfig () {
        this.initData()
      }
    },
    methods: {
      // 初始化按钮选项
      initData () {

      },
      OpenPicker () {
        if (this.dropDown) {
          this.dropDown = false
        } else {
          this.dropDown = true
        }
      },
      ClosePicker () {
        this.dropDown = false
      },
      checkArea (e) {
        if (!this.$el.contains(e.target)) {
          this.dropDown = false
        }
      },
      selected (color, index) {
        this.$emit('input', color)
        this.$emit('change', color)
        this.ClosePicker()
      }
    },
    mounted () {
      // 事件捕获
      document.addEventListener('click', this.checkArea, true)
    },
    beforeDestroy() {
      document.removeEventListener('click', this.checkArea, true)
    }
  }
</script>
<style  lang="less">
  .color-picker{
    position: relative;
    width: 28px;
  }
  .color-picker .color-picker_trigger {
    border: 1px solid rgba(0,0,0,0.15);
    border-radius: 4px;
    height: 28px;
    width: 28px;
    box-sizing: border-box;
    padding: 3px;
  }
  .color-picker .color-picker_trigger:hover{
    cursor: pointer
  }
  .color-picker .color-picker_trigger span{
    display: block;
  }
  .color-picker .color-picker_outer{
    width: 20px;
    height: 20px;
    padding: 3px;
  }
  .color-picker .color-picker_inner{
    width: 100%;
    height: 100%;
  }

  .color-picker .list-container {
    overflow: scroll;
    position: absolute;
    top: -5px;
    transform: translateY(-100%);
    z-index: 5000;
    padding: 3px 0px;
    box-sizing: border-box;
    height: 250px;
    width: 28px;
    border: 1px solid #eeeeee;
    background: #FFFFFF;
    box-shadow: 0 -2px 8px 0 rgba(0,0,0,0.15);
    border-radius: 4px;
  }
  .color-picker .list-container::-webkit-scrollbar {
    display: none;
  }
  .color-picker .list-container ul {
    list-style: none;
  }
  .color-picker .list-container ul li {
    margin: auto;
    display: block;
    padding: 5px 3px;
  }
  .color-picker .list-container ul .activeLi{
    background-color: #eeeeee;
  }
  .color-picker .list-container ul li:hover{
    background-color: #eeeeee;
    cursor: pointer;
  }
  .color-picker .list-container ul li span{
    display: block;
  }
  .color-picker .list-container ul li .option_outer {
    height: 20px;
    width: 20px;
    margin: auto;
    padding: 2px;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid;
  }
  .color-picker .list-container ul li .option_inner {
    border-radius: 4px;
    height: 100%;
    width: 100%;
  }
</style>
