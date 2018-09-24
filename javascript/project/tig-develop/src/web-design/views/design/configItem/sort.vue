<template>
  <div style="padding-bottom: 160px;">
    <configHeader :name="name">
      <div @click="addSort" style="cursor: pointer;">
        <Icon type="ios-plus-empty" class="plus-icon"></Icon>
      </div>
    </configHeader>
    <div class="panel-wrap">
      <div class="panel" v-for="(item, index) in _sorter" :key="index">
        <div class="sort-title">
          <div class="icon-wrap" @click="handleCollapse(index)">
            <Icon
              class="collapse-icon"
              type="ios-arrow-down"></Icon>
            <span v-show="index === 0">主要</span>
            <span v-show="index !== 0">次要</span>
          </div>
          <span @click="removeSort(item, index)">
            <Icon type="close-round"></Icon>
          </span>
        </div>

        <div class="content" :class="{active: item.collapse}">
          <Select
            class="condition"
            size="small"
            placeholder="选择排序列"
            @on-change="getNotDisableItem"
            v-model="item.id">
            <Option
              v-for="j in columnList"
              :value="j.id"
              v-show="j.type !== 2"
              :key="j.id"
              :disabled="j.enableSort">{{ j.name ? j.name : j.cusName}}</Option>
          </Select>
          <Select class="condition" size="small" v-model="item.value">
            <Option
              v-for="i in filterCondition"
              :value="i.value"
              :key="i.value">{{ i.label }}</Option>
          </Select>
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
  name: 'design-config-sorter',
  computed: {
    columnList() {
      return this.$store.state.design.columnList
    },
    _sorter() {
      return this.$store.getters.getSorter
    }
  },
  data() {
    return {
      name: '排序',
      sorter: [
        {
          collapse: true,
          name: 'dasp_date',
          id: '', // id (dimId 或者 metricId)
          type: 0, // 0 维度， 1 指标
          value: 0 // 0是升序，1是降序
        }
      ],
      filterCondition: [
        {
          value: 0,
          label: '升序'
        },
        {
          value: 1,
          label: '降序'
        }
      ],
    }
  },
  mounted() {
    this.sorter = this._sorter
  },
  methods: {
    handleCollapse(index) {
      // this.$Message.info('hahah')
      this.sorter[index].collapse = !this.sorter[index].collapse
    },
    addSort() {
      this.sorter.push({ collapse: true, value: 0 })
      // TODOS: 排序更具name字段去重
    },
    removeSort(item, index) {
      this.columnList.forEach((v) => {
        if (v.id === item.id) {
          v.enableSort = false
        }
      })
      this.sorter.splice(index, 1)
    },
    getNotDisableItem() {
      this.columnList.forEach((v) => {
        v.enableSort = false
      })
      this.sorter.forEach((v) => {
        this.columnList.forEach((j) => {
          if (v.id === j.id) {
            j.enableSort = true
          }
        })
      })
    }
  },
  watch: {
    sorter: {
      handler(val) { // val 即是new sorter
        const columnList = this.columnList
        val.forEach((v) => {
          for (let j = 0; j < columnList.length; j += 1) {
            if (v.id === columnList[j].id) {
              v.name = columnList[j].name
              v.type = columnList[j].type
            }
          }
        })
        this.$store.commit('handleSorterChange', val)
      },
      deep: true
    },
    _sorter: {
      handler(val) {
        this.sorter = val
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
@tabMainColor: #00C5E1;
@distance-justice: 16px;
.tabs-wrap{
  .list{
    margin-top: 6px;
    border-radius: 3px;
    background-color: #fff;
    padding: 3px;
    padding-left: 12px;
    padding-top: @distance-justice;
    .item{
      margin-bottom: @distance-justice;
    }
  }
}
.panel-wrap{
  padding: 8px 14px;
  .panel{
    margin-bottom: 10px;
    .sort-title{
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
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      background-color: #fff;
      transition: height .1s linear;
      &.active{
        height: auto;
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
}
</style>

<style lang="less">
@tabMainColor: #00C5E1;
.tabs-wrap{
  padding: 10px;
  .ivu-tabs-bar{
    // padding: 0 10px;
  }
 /*  .ivu-tabs-nav .ivu-tabs-tab-active{
    color: @tabMainColor;
  }
  .ivu-tabs-ink-bar{
    background-color: @tabMainColor;
  } */
  .ivu-checkbox{
    margin-right: 6px;
  }
  /* .ivu-checkbox-checked .ivu-checkbox-inner {
    border-color: @tabMainColor;
    background-color: @tabMainColor;
  } */
}
</style>

