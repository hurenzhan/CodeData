<template>
  <section class="dim-filter-item" :class="{hidden: filterItemInfo.hidden === 1}">
    <div class="dim-filter-item-title" @click="toggleHidden">
      <span>
        <i class="el-icon-arrow-up"></i>
        <span>{{filterItemInfo.dimName}}</span>
      </span>
      <i class="el-icon-close" @click.stop="deleteDimFilter"></i>
    </div>
    <div class="dim-filter-item-content">
      <div>
        <el-radio v-model="inOrNot" label="6">包含</el-radio>
        <el-radio v-model="inOrNot" label="7">不包含</el-radio>
      </div>
      <div v-if="command==='select' || inOrNot === '6'">
        <el-select v-if="!customizedDim" :class="{'minSelect':inOrNot === '7'}" size="mini" filterable remote :remote-method="remoteSearch" multiple collapse-tags v-model="dimValuesSelected">
          <el-option
            v-for="item in dimValues"
            :key="item.dimValue"
            :label="item.dimValueNm.indexOf('###')!==-1 ? item.dimValueNm.replace('###','_') : item.dimValueNm"
            :value="item.dimValue"
          >
          </el-option>
        </el-select>
        <!-- 自定义维度 /-->
        <dim-input-item v-else :index="index" class="dropdown" :filterItemInfo="filterItemInfo" :filterItemIndex="filterItemIndex"></dim-input-item>
      </div>
      <dim-enter-item v-else :index="index" class="dropdown" :filterItemInfo="filterItemInfo" :filterItemIndex="filterItemIndex"></dim-enter-item>
      <el-dropdown @command="handleCommand" v-show="inOrNot==='7'">
        <el-button size="mini" icon="el-icon-more"></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="select">选择</el-dropdown-item>
          <el-dropdown-item command="enter">输入</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </section>
</template>

<script>
  import api from '../../../../../../../../api/design'
  import dimInputItem from './dimInputItem'
  import dimEnterItem from './dimEnterItem'
  export default {
    name: 'DimFilterItem', // 维度过滤器的item展示
    props: {
      index: {}, // 容器的index
      filterItemIndex: {}, // 当前维度过滤器的index
      filterItemInfo: {}
    },
    data () {
      return {
        dimValues: [] // 维值
      }
    },
    components: {
      dimInputItem,
      dimEnterItem
    },
    computed: {
      command() {
        return this.filterItemInfo.command 
      },
      // 包含(6)OR不包含(7)
      inOrNot: {
        get () {
          return this.filterItemInfo.operator
        },
        set (value) {
          const {index, filterItemIndex} = this
          this.$store.commit('inOrNotChange', {
            index,
            filterItemIndex,
            value
          })
        }
      },
      // 选中的维值(用于绑定在el-select上)
      dimValuesSelected: {
        get () {
          return this.filterItemInfo.dimValuesSelected
        },
        set (value) {
          const {index, filterItemIndex} = this
          this.$store.commit('dimValuesSelectedChange', {
            index,
            filterItemIndex,
            value
          })
        }
      },
      // 是否自定义维度
      customizedDim () {
        return this.filterItemInfo.dimCode && this.filterItemInfo.dimCode.indexOf('DASP') !== -1 ? true : false
      }
    },
    mounted () {
      // 自定义维度 不支持查询维值列表
      !this.customizedDim && this.queryDimValues()
    },
    methods: {
      // 展开or隐藏
      toggleHidden () {
        const {index, filterItemIndex} = this
        this.$store.commit('toggleHidden', {
          index,
          filterItemIndex
        })
      },
      // 获取维值
      async queryDimValues (key) {
        const res = await api.queryDimInfoByKey(
          {
            key,
            dimCode: this.filterItemInfo.dimCode
          }
        )
        // 要不要在这赋值?
        if (res && res.data) {
          this.dimValues = res.data
        }
      },
      // 远程搜索维值
      remoteSearch (query) {
        this.queryDimValues(query)
      },
      // 点击叉号，删除某个维度过滤器
      deleteDimFilter () {
        const {index, filterItemIndex} = this
        this.$store.commit('deleteDimFilter', {
          index,
          filterItemIndex
        })
      },
      handleCommand(value) {
        const {index, filterItemIndex} = this
        this.$store.commit('setCommand', {
          index,
          filterItemIndex,
          value
        })
      }
    }
  }
</script>

<style lang="less">
  @title-height: 24px;
  @content-height: 65px;
  @transition: all 0.2s ease;
  .dim-filter-item{
    transition: @transition;
    border: 1px solid #eee;
    border-radius: 4px;
    margin-top: 5px;
    &.hidden{
      .dim-filter-item-title{
        .el-icon-arrow-up{
          transform: rotateZ(180deg);
        }
      }
      .dim-filter-item-content{
        transition: @transition;
        height: 0;
        overflow: hidden;
        padding: 0;
      }
    }
    .dim-filter-item-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f5f5f5;
      cursor: pointer;
      height: @title-height;
      user-select: none;
      padding: 0 5px;
      .el-icon-arrow-up{
        transition: @transition;
      }
    }
    .dim-filter-item-content{
      transition: @transition;
      height: @content-height;
      padding: 5px;
      .el-select{
        max-width: 161px !important; 
        .el-select__tags{
          white-space: nowrap;
          .el-select__tags-text{
            max-width: 60px;
            display: inline-block;
            overflow: hidden;
            vertical-align: bottom;
          }
        }
      }
      .minSelect {
          float: left;
          .el-input--mini .el-input__inner{
            width: 128px;
            border-top-right-radius:0px;
            border-bottom-right-radius:0px;
            border-right: 0
          }
        }
      .el-button{
        height: 32px;
        border-top-left-radius:0px;
        border-bottom-left-radius:0px;
        border-left: 0;
      }
    }
  }
</style>
