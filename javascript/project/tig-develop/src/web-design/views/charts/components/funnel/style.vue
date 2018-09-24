/*
 * @Author: Jacob
 * @Date: 2018-04-27 16:08:37
 * @Description: 漏斗图的样式面板
 * @Last Modified by: Jacob
 * @Last Modified time: 2018-07-25 20:53:25
 */
<template>
  <div class="config-funnelstyle">
    <div class="column">
      <div class="style-title"><span class="point"></span>设计</div>
      <div class="config-line">
        <div class="config-line-item">
          <div class="row">
              <el-checkbox v-model="isNumber">显示数值</el-checkbox>
          </div>
          <!-- <div class="row">
              <el-checkbox v-model="isCompareTime" :disabled="config.showCompareTime.disableCompareTime">对比期</el-checkbox>
          </div> -->
          <div class="row">
              <el-checkbox v-model="isConvert">转化率</el-checkbox>
          </div>
          <div class="row" style="margin-bottom: 10px;">
              <el-checkbox v-model="isFloor">层数设定</el-checkbox>
              <InputNumber v-show="isFloor" :max="8" :min="2" v-model="floors"></InputNumber>
          </div>
          <div v-show="isFloor" class="config-floor">
            <div class="row"  v-for="(item, index) in config.showFloor.nodeList" :key="index" style="display: flex;">
              <span class="floorIndex">0{{ index + 1}}</span>
              <el-cascader
                :options="item.options"
                size="small"
                v-model="item.selectedOptions"
                @change="value => handleItemChange(value, index)"
                change-on-select
              ></el-cascader>
            </div>
            <el-button type="primary" size="mini" :loading="loading" @click="configFloor">{{ buttonLabel }}</el-button>
            <div style="color: rgb(153, 153, 153);font-family: PingFangSC-Regular;">* 注：每层配置需不一样，否则只展示一次</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import bus from '../../utils/eventBus'
  import searchMixin from '../../../../api/search'
  import api from '../../../../api/charts'
  import { getCrossDimList } from '../../utils/utils'

  export default {
    name: 'funnelStyle',
    mixins: [searchMixin],
    props: {
      index: {
        default: 0
      }
    },
    data () {
      return {
        loading: false, // 按钮的loading状态
        buttonLabel: '配置层数' // 按钮的文字
      }
    },
    computed: {
      feature () {
        return this.$store.state.charts.chartsOption[this.index].feature
      },
      styleConfig () {
        return this.feature.styleConfig
      },
      config () {
        return this.styleConfig.config
      },
      dataSet () {
        return this.$store.state.charts.dataSet
      },
      floors: {
        set(value) {
          // 改变层数的时候如果删除了层数，动态改变每一层的数据
          let originData = JSON.parse(JSON.stringify(this.config.originData))
          if (originData.length > value) {
            originData.splice(value, originData.length - value)
            this.$store.commit('changeFloorFunnel', { index: this.index, value, originData })
          } else {
            this.$store.commit('changeFloorFunnel', { index: this.index, value })
          }
          // this.$store.commit('changeFloorFunnel', { index: this.index, value })
        },
        get() {
          return this.config.showFloor.floors
        }
      },
      // 是否显示数值
      isNumber: {
        set(value) {
          this.$store.commit('showNumberFunnel', { index: this.index, value})
        },
        get() {
          return this.config.showNumber.show
        }
      },
      // 是否显示转化率
      isConvert: {
        set(value) {
          this.$store.commit('showConvertFunnel', { index: this.index, value})
        },
        get() {
          return this.config.showConvert.show
        }
      },
      // 是否显示对比期
      isCompareTime: {
        set(value) {
          this.$store.commit('showCompareTimeFunnel', { index: this.index, value, showCompareTime: true})
        },
        get() {
          return this.config.showCompareTime.show
        }
      },
      // 是否显示层数
      isFloor: {
        set(value) {
          this.$store.commit('showFloorFunnel', { index: this.index, value})
          if (value) {
            // 必须要设置一个空的children，不然不触发handleItemChange方法
            let options = this.feature.metricList.map(({ metricCode, metricName }) => ({
              value: metricCode,
              label: metricName,
              children: []
            }))
            // 把最初第一层的指标先放进去
            this.$store.commit('saveOptions', {
              index: this.index,
              options
            })
          }
        },
        get() {
          return this.config.showFloor.show
        }
      }
    },
    methods: {
      // 当点击某一个指标或维度时去请求当前点击对象的下一层，必须要点击的当前层有children属性才能触发该方法
      handleItemChange( val, index ) {
        setTimeout(_ => {
          // 根据存入的层数来改变那一层的可选项内容
          let options = JSON.parse(JSON.stringify(this.config.showFloor.nodeList[index].options))
          // 获取维度
          let dimList = getCrossDimList(this.dataSet, [{'metricCode': val[0]}])
          options.forEach(({ value, label }, i, arr) => {
            if (value === val[0]) {
              // 如果是点击的第一层，通过val.length来判断
              if (val.length === 1) {
                // 获取维度，塞到对应的指标下面去
                arr[i].children = dimList.map(({ dimCode, dimName }) => ({
                  value: dimCode,
                  label: dimName,
                  children: [] //必须要设置一个空的children，不然获取不到
                }))
              } else if (val.length === 2) {
                arr[i].children.forEach(({ value, label }, i, arr) => {
                  if (value === val[1]){
                    // 请求接口，offset是分页，limit是限制50个，获取到维值塞到对应维度的children下
                    api.dimListValue({ dimId: val[1], offset:0, limit:50 }).then(res => {
                      if (res) {
                        arr[i].children = res.data.map(({ dimValue, dimValueNm }) => ({
                          value: dimValue,
                          label: dimValueNm.indexOf('###') !== -1 ? dimValueNm.replace('###','_') : dimValueNm
                        }))
                      }
                    })
                  }
                })
              }
            }
          })
          this.$store.commit('saveOptions', {
            index: this.index,
            floorIndex: index,
            options
          })
        }, 100)
      },
      //请求数据
      async getData({ metricsList, type, dimList, dimValueList, rateType, queryInfo, autoSum }) {
        // 如果显示对比期勾上了，这时候查询数据要查对比数据
        // queryInfo = {
        //   dimListData: {},
        //   metricsListData: [],
        // }
        // 是否是对比数据
        if (this.config.showCompareTime.show) {
          rateType = 4
          metricsList[0].rateType = 4
          // 带维值查询
          if(dimValueList) {
            dimValueList[0].rateType = 4
          }
          // queryInfo.dateData = this.config.queryDate
        } else {
          rateType = 0
          // if (this.config.queryDate.length !== 0) {
          //   queryInfo[dateData] = this.config.queryDate
          // }
        }

        let originData = await this.updateDataPre({
          index: this.index,
          metricsList,
          autoSum,
          type,
          dimList,
          rateType,
          queryInfo,
          dimValueList
        })
        // 如果查出来数据为空，给数据加上默认值0
        if (!originData || originData.length === 0) {
          if (dimValueList && dimValueList.length !== 0) {
            originData.push({[dimValueList[0].dimValueId]: 0})
          } else {
            originData.push({[metricsList[0].metricsCode]: 0})
          }
        }
        // 如果是维值，就加上dimValueList字段，在渲染数据时需要判断这个字段
        if (dimValueList) {
          originData[0].dimValueList = dimValueList[0]
          originData[0].metricList = metricsList[0] // 维值加上指标以示区分
        }

        return originData
        // 判断是否查到了数据
        // if (!originData || originData.length === 0 ) {
        //   this.$message.warning('没查到数据')
        // } else {
        //   // 判断这层数据是维值还是指标,如果是维值就在这条数据里加上维值的信息
        //   // if (dimValueList) {
        //   //   originData[0].dimValueList = dimValueList[0]
        //   // }
        //   // let shareData = JSON.parse(JSON.stringify(this.config.originData)) // 之前选好的数据
        //   // shareData.splice(floorIndex, 1, originData[0]) // 如果重复选一个框，先把之前的删除
        //   // originData = shareData
        //   this.$store.commit('saveOriginData' , { index: this.index, originData })
        // }
      },
      async configFloor () {
        let apiArr = [] // 存放所有的promise
        // 打开图表loading状态
        this.loadingToggle(this.index, true)
        this.buttonLabel = '正在配置中...'
        this.loading = true // 打开按钮loading状态
        // 判断每一层的配置是否有一样的，如果是一样的，就返回
        let arr = [] // 把每一层的数据都存放起来
        this.config.showFloor.nodeList.forEach(v => {
          if (v.selectedOptions.length === 1) {
            arr.push(v.selectedOptions[0])
          } else if(v.selectedOptions.length === 2) {
            arr.push(v.selectedOptions[0])
          } else if(v.selectedOptions.length === 3) {
            arr.push(v.selectedOptions[0] + v.selectedOptions[2])
          }
        })

        const hasSame = arr.sort().some((every, index, all) => {
          if (every === all[index + 1 ]) {
            return true
          }
        })
        if (hasSame){
          this.$message.warning('请不要配置相同的层数')
          this.loading = false // 关闭按钮loading状态
          this.buttonLabel = '配置层数'
          this.loadingToggle(this.index, false)
          return
        }
        this.config.showFloor.nodeList.forEach((item,index) => {
          // 判断是长度，确定是指标还是维度还是维值
          if (item.selectedOptions.length === 1) {
            let metricsLabel = '' // 记录中文的label
            // 根据下拉框中的内容与选择的指标ID对比，获取指标名称
            this.config.showFloor.nodeList[index].options.forEach(({ label, value}) => {
              if (value === item.selectedOptions[0]) {
                metricsLabel = label
              }
            })
            // 请求的指标参数
            const metricsList = [{
              metricsCode: item.selectedOptions[0],
              decimals: 2,
              label: metricsLabel,
              rateType: 0,
              thousands: false
            }]
            apiArr.push(this.getData({metricsList})) // 全部放到里面，promise.all要用到
          } else if (item.selectedOptions.length === 2) {
            let dimNameLabel = ''
            let metricsLabel = ''
            this.config.showFloor.nodeList[index].options.forEach(({ label, value, children}) => {
              if (value === item.selectedOptions[0]) {
                metricsLabel = label
                children.forEach(({label, value, children }) => {
                  if (value === item.selectedOptions[1]) {
                    dimNameLabel = label
                  }
                })
              }
            })
            // 传参的指标
            const metricsList = [{
              metricsCode: item.selectedOptions[0],
              decimals: 2,
              rateType: 0,
              label: metricsLabel,
              thousands: false
            }]
            // 根据维度查询
            const autoSum = true
            const type = 1
            // 传参的维度
            const dimList = [{
              "dimId": item.selectedOptions[1],
              "dimName": dimNameLabel
            }]
            // 把按维值请求的数据放到数组里
            apiArr.push(this.getData({ metricsList, type, autoSum, dimList }))
          } else if (item.selectedOptions.length === 3) {
            let dimValueLabel = ''
            let metricsLabel = ''
            // 层层遍历，获取维值的中文名称
            // 把每一层的可选项分开单独处理
            this.config.showFloor.nodeList[index].options.forEach(({ label, value, children}) => {
              if (value === item.selectedOptions[0]) {
                metricsLabel = label
                children.forEach(({label, value, children }) => {
                  if (value === item.selectedOptions[1]) {
                    children.forEach(({label, value }) => {
                      if (value === item.selectedOptions[2]) {
                        dimValueLabel = label
                      }
                    })
                  }
                })
              }
            })
            // 传参的指标
            const metricsList = [{
              metricsCode: item.selectedOptions[0],
              decimals: 2,
              rateType: 0,
              label: metricsLabel,
              thousands: false
            }]
            const type = 2
            // 传参的维值
            const dimValueList = [{
              "dimId": item.selectedOptions[1],
              "dimValue": dimValueLabel,
              "dimValueId": item.selectedOptions[2],
              "decimals":2,// 小数位
              "thousands":false,//千分位
              "type":"0"//0数值,1百分比,空字符串表示数据原值返回
            }]
            // 把按维值请求的数据放到数组里
            apiArr.push(this.getData({ metricsList, type, metricsList, dimValueList }))
          }
        })
        // 通过promise.all把之前请求数据的结果放到一起
        let originData = await Promise.all(apiArr)
        this.loadingToggle(this.index, false) // 关闭图表loading状态
        this.loading = false // 关闭按钮loading状态
        this.buttonLabel = '配置层数'
        bus.$emit(`changeNoData_${this.index}`, { data:  originData }) // 触发改变nodata的事件
        if (!originData || originData.length === 0 ) {
          // this.$message.warning('没查到数据')
        } else {
          // 把得到数据进行处理
          originData = originData.map(item => item[0])
          this.$store.commit('saveOriginData' , { index: this.index, originData })
        }
      }
    }
  }
</script>
<style  lang="less">
  .el-cascader-menu__item{
    padding: 8px 30px 8px 20px;
  }
  .config-funnelstyle{
     font-size: 14px;
     height: calc(100vh - 267px);
     overflow: auto;
    .style-title {
     color: #666666;
     line-height: 20px;
     margin-top: 16px;
    }
    .column {
      border-top: 1px solid #E8EAEB;
      padding: 0px 0px 10px 0px;
      .config-line{
	    .config-line-item {
	     	 padding-top:10px;
	     	 padding-left: 24px;
         padding-right: 10px;
         padding-bottom: 20px;
	     	 clear:both;
         .config-floor{
           button {
             width: 180px;
             margin: 10px 10px 10px 0px;
           }
         }
         .row{
            width: 100%;
            box-sizing: border-box;
            margin-bottom: 5px;
            .ivu-input-number{
              margin-left: 10px;
            }
            .floorIndex{
              background-color: #ddd;
              border-radius: 50%;
              text-align: center;
              margin-right: 10px;
              width: 20px;
              height: 20px;
              line-height: 1.7;
              font-size: 12px;
              margin-top: 5px;
              color: #999;
            }
            .el-cascader{
              flex: 1;
              margin-bottom: 5px;
            }
          }
        }
      }
      .point{
        display: inline-block;
        height: 6px;
        width: 6px;
        box-sizing: border-box;
        border-radius: 100%;
        background: #d8d8d8;
        vertical-align: top;
        margin: 6px 8px 6px 10px;
      }
    }
  }
</style>
