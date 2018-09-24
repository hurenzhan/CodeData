<template>
  <div class="blur-wrapper my-slide-bar">
    <div class="blur-item table-name">
      <p class="blur-item-name">工作表名称</p>
      <el-input size="mini" :maxlength="30" v-model="name" placeholder="工作表名称"></el-input>
    </div>
    <div class="blur-item">
      <p class="blur-item-name border-bottom">
        数据集
        <img src="/static/charts/images/edit.svg" alt=""  style="cursor:pointer; float:right;margin-top: 15px;
      margin-right: 8px; width:12px;height:12px "  @click.stop="$store.commit('toggleMetricDialog', true)">
      </p>
      <div class="metric-show">
        <p class="metric-show-name"><dot></dot><span>数据指标</span></p>
        <metric-change-name ref="metricAlias"></metric-change-name>
      </div>
      <div class="metric-show">
        <p class="metric-show-name"><dot></dot><span>数据维度</span></p>
        <dim-change-name ref="dimAlias"></dim-change-name>
      </div>
    </div>
  </div>
</template>

<script>
  import dot from './focus/chartFocus/dot'
  import metricChangeName from './blur/metricChangeName'
  import dimChangeName from './blur/dimChangeName'
  export default {
    name: 'Blur',
    data () {
      return {
      }
    },
    components: {dot, metricChangeName, dimChangeName},
    computed: {
      name: {
        get () {
          return this.$store.state.charts.name
        },
        set (value) {
          this.$store.commit('changeName', value)
        }
      },
      metricCodeString () {
        return this.$store.state.charts.dataSet.map(i => i.metricCode).sort().join('')
      }
    },
    watch: {
      // 指标改变时，调用指标和维度别名组件里的初始化
      metricCodeString () {
        this.$refs.metricAlias.metricsInit()
        this.$refs.dimAlias.dimsInit()
      }
    },
    methods: {
    }
  }
</script>

<style lang="less">
  @base-color: #333;
  @gray: #666;
  @base-size: 14px;
  @border-color: #ebeef5;
  .blur-wrapper{
    // padding: 0px 14px 12px 16px;
    overflow: auto;
    .blur-item{
      &.table-name{
        padding: 0px 14px 12px 16px;
      }
      &:last-child{
        .blur-item-name{
          padding: 0px 14px 12px 16px;
        }
      }
      .blur-item-name{
        color: @base-color;
        font-size: @base-size;
        font-weight: bolder;
        position: relative;
        height: 40px;
        line-height: 40px;
        &.border-bottom:after{
          content: '';
          position: absolute;
          height: 1px;
          width: 100%;
          background: @border-color;
          bottom: 0px;
          left: 0;
        }
        >i{
          cursor: pointer;
          color: #999;
        }
      }
      .metric-show{
        .metric-show-name{
          display: flex;
          align-items: center;
          color: @gray;
          padding: 12px 0 12px 16px;
          font-size: 14px;
        }
        >.el-input{
          margin: 2px 14px 5px 20px;
          width: 180px;
        }
        .item-wrapper{
          margin: 14px 20px;
          margin-top: 0;
          .metric-show-item {
            margin-top: 5px;
            p{
              transition: all 0.2s ease;
              &:first-child{
                white-space: nowrap;
                color: rgba(0,0,0,0.45);
                background: #f1f3f5;
                border: 1px solid #f1f3f5;
                height: 24px;
                width: 180px;
                font-size: 14px;
                border-radius: 4px;
                line-height: 24px;
                padding-left: 8px;
                text-overflow: ellipsis;
                overflow: hidden;
                cursor: pointer;
                user-select: none;
              }
              &:last-child{
                display: flex;
                justify-content: center;
                align-items: center;
                height: 0;
                overflow: hidden;
                margin-top: 0;
                span{
                  white-space: nowrap;
                  padding-right: 5px;
                }
              }
            }
            &.open{
              p:first-child{
                background: #e5f1ff;
                color: #51a8ff;
                border: 1px solid #51a8ff;
              }
              p:last-child{
                height: 30px;
                margin-top: 5px;
              }
            }
            &.danger {
              .el-input input{
                border-color: red;
              }
            }
            &.hasAlias {
              p:first-child {
                border-left: 2px solid #51a8ff;
              }
            }
          }
        }
      }
    }
  }
</style>
