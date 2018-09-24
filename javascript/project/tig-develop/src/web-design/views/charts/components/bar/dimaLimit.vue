
<template>
       <div class="dim-style">
         <div class="row">
         <span style="padding-left:25px;margin-top:8px">选择维度</span>
        <div class="row-bar">
         <!--  <span style="padding-left:25px">选择维度</span> -->
           <el-select  placeholder="请选择维度"  v-model="selectedDim" @change="changeDimInner" class="barDim">
            <el-option
              v-for="item in crossDimList"
              :key="item.dimCode"
              :label="item.dimName"
              :value="item.dimCode">
            </el-option>
          </el-select>
          </div>
          </div>
          <div class="row" style="margin-top:8px">
             <span style="padding-left:25px;margin-top:8px">选择维值</span>
          <div class="row-bar" >
            <el-select
          v-model="selectDimValue"
          multiple
          filterable
          remote
          placeholder="请输入维值"
          :remote-method="remoteMethod"
          :loading="loading"  @change="changeDimValue"  class="barDim"  size="small" collapse-tags>
          <el-option
            v-for="item in dimValueList"
            :key="item.dimValue"
            :label="item.dimValueNm"
            :value="item.dimValueNm">
          </el-option>
        </el-select>
      </div>
      </div>
    </div>
</template>

<script>
   import api from '../../../../api/design'
   import {getCrossDimList} from '../../utils/utils'
  import bus from '../../utils/eventBus'
  import dimaLimitUtil from './dimaLimitUtil'
  export default {
    name: 'dim-style',
    components: {
    },
    mixins: [dimaLimitUtil],
    props: {
      index: {
        default: 0
      },
      indexPave: {
        default: false
      },
      clear: {
        default: false
      },
      loading: {
        default: false
      },
      dimValueList: {
        default: []
      }
    },
    data() {
      return {
          // loading: false,
          // dimValueList: []
        }
    },
    watch: {
    },
    computed: {
      option () {
        return this.$store.state.charts.chartsOption[this.index]
      },
        // 交叉维度
      crossDimList () {
        return getCrossDimList(this.$store.state.charts.dataSet, this.option.feature.metricList)
      },
      selectedDim: {
       get() {
          return this.option.feature.styleConfig.config.selectedDim ? this.option.feature.styleConfig.config.selectedDim : ''
        },
        set(value) {
          this.$store.commit('saveDimLimit', {
            index: this.index,
            name: 'selectedDim',
            value,
          })
        }
      },
      selectDimValue: {
        get() {
          return this.option.feature.styleConfig.config.selectDimValue ? this.option.feature.styleConfig.config.selectDimValue : []
        },
        set(value) {
          this.$store.commit('saveDimLimit', {
            index: this.index,
            name: 'selectDimValue',
            value
          })
        }
      }
    },
    methods: {
      async remoteMethod(query) {
        this.$emit('on-change-remote', {
          value: query,
          index: this.index,
        });
      },
      changeDimValue(val) {
        const selectDimValueNmList = []
        const selectDimValueList = []
        if (val) {
          val.map((item, index) => {
            selectDimValueList.push(item.split('_')[0])
            selectDimValueNmList.push(item.split('_')[1])
         })
        }
        this.$emit('on-change-dimValue', {
          value: selectDimValueList,
          index: this.index,
          selectDimValueNmList,
        });
      },
      changeDimInner(val) {
       this.$emit('on-change-dim', {
          value: val,
          index: this.index,
          indexPave: this.indexPave,
          selectDimValue: this.selectDimValue
        });
      }
    }
}
</script>
<style lang="less">
 .dim-style{
  .row-bar{
     clear: both;
     overflow: hidden;
    >span{
      float:left;margin-top:12px;font-size:14px;
    }
  }
  .barDim{
     .el-tag{
            margin: 2px 0px 2px 20px;
          }
    /*  margin-left: 30px;*/
      .el-select__tags-text{
        max-width: 40px;
      display: inline-block;
      vertical-align: top;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      }
      .is-small{
         width : 20px;
         max-width:20px !important ;
      }
          margin-top: 8px;
          margin-left:10px;
          float:left;
          .el-input{
            .el-input__inner{
            width: 160px;
            margin-left:15px;
            min-height: 32px !important;
            height: 32px;
          }
          }
          
        }
        .el-select__tags {
    max-width: none !important;
  }
  .el-select__tags>span {
    width: auto;
  }
  .el-select__input {
    display: inline-block;
  }

 }
</style>
