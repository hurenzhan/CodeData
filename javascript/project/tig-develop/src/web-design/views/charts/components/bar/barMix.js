import bus from '../../utils/eventBus'
import api from '../../../../api/design'
export default {
  methods: {
      changeLengend(val) {
        this.$store.commit('setBarLegendPosition', {
          index: this.index,
          type: val,
          statue: true
        })
      },
      changeLegendShow() {
        const val = this.styleConfig.config.legendPosition
         this.$store.commit('setBarLegendPosition', {
          index: this.index,
          type: val,
          statue: true
        })
      },
      changeCrosswise(state) {
        const val = this.styleConfig.config.crosswise
        this.$store.commit('changeXYBar', {
          index: this.index,
          type: val
        })
        this.$store.commit('saveBarOperate', {
          index: this.index,
          type: val,
          state: state,
          params: val,
          methods: 'changeCrosswise'
        })
      },
      changeAxisTitle(state) {
        const val = this.styleConfig.config.axisTitle
        this.$store.commit('showAxisBarTitile', {
          index: this.index,
          type: val
        })
        this.$store.commit('saveBarOperate', {
          index: this.index,
          type: 'add',
          params: val,
          state: state,
          methods: 'changeAxisTitle'
        })
      },
      // 是否显示双Y轴
      changeDoubleY(state) {
        const val = this.styleConfig.config.doubleY
        this.$store.commit('showBarDoubleY', {
          index: this.index,
          type: val
        })
        this.$store.commit('saveBarOperate', {
          index: this.index,
          type: 'add',
          params: val,
          state: state,
          methods: 'changeDoubleY'
        })
      },
      changeGuideShow(state) {
        const val = this.styleConfig.config.isGuideShow
        this.$store.commit('changeGuideShow', {
          index: this.index,
          type: val
        })
          this.$store.commit('saveBarOperate', {
            index: this.index,
            type: val,
            params: val,
            state: state,
            methods: 'changeGuideShow'
         })
      },
      changeStack(state) {
        const val = this.styleConfig.config.stack
        this.$store.commit('changeStack', {
            index: this.index,
            type: val
        })
        // if (val) {
        //  this.$store.commit('changeStack', {
        //     index: this.index,
        //     type: val
        //   })
        // } else {
        //  this.$store.commit('editMidBarSeries', {
        //     index: this.index,
        //     series: true,
        //     name: 'stack',
        //     value: '',
        //   })
        // }
        this.$store.commit('saveBarOperate', {
          index: this.index,
          type: val,
          params: val,
          state: state,
          methods: 'changeStack'
        })
      },
      changeLine(state) {
        const val = this.styleConfig.config.line
        this.$store.commit('changeLine', {
          index: this.index,
          type: val
        })
        this.$store.commit('saveBarOperate', {
          index: this.index,
          type: 'add',
          state: state,
          params: val,
          methods: 'changeLine'
        })
      },
      changeMeasureLine(state) {
        const val = this.styleConfig.config.isMeasureLineShow
        this.$store.commit('changeMeasureLine', {
          index: this.index,
          type: val
        })
        this.$store.commit('saveBarOperate', {
          index: this.index,
          type: 'add',
          params: val,
          state:state,
          methods: 'changeMeasureLine'
        })
      },
      changeMeasureType(state) {
        const val = this.styleConfig.config.measureLineType
        if (val === '0') {
          const dimValue = this.styleConfig.config.dimValue
          if (dimValue !== '') {
            this.$store.commit('setFixedMeasure', {
              index: this.index,
              dimValue
            })
          } else {
            this.$store.commit('clearFixedValue', {
              index: this.index
            })
          }
        } else {
          this.$store.commit('setAvageMeasure', {
            index: this.index
          })
        }
        this.$store.commit('saveBarOperate', {
          index: this.index,
          type: 'add',
          state: state,
          params: val,
          methods: 'changeMeasureType'
        })
      },
      changeDimValue(val) {
        const dimValue = this.styleConfig.config.dimValue
        if (dimValue !== '') {
          this.$store.commit('setFixedMeasure', {
            index: this.index,
            dimValue: dimValue
          })
        } else {
          this.$store.commit('clearFixedValue', {
            index: this.index
          })
        }
        this.$store.commit('saveBarOperate', {
          index: this.index,
          type: 'add',
          params: val,
          methods: 'changeDimValue'
        })
      },
      showX(state, params) {
        if (params === undefined) {
          params = this.styleConfig.config.xAxis[0].show
        }
        this.$store.commit('editMidOptionBarXAxis', {
          index: this.index,
          name: 'show',
          value: params,
        })
        this.$store.commit('saveBarOperate', {
          index: this.index,
          type: 'add',
          params: params,
          state: state,
          methods: 'showX'
        })
      },
      showY(state, params) {
        if (params === undefined) {
          params = this.styleConfig.config.yAxis[0].show
        }
        this.$store.commit('editMidOptionBarYAxis', {
          index: this.index,
          name: 'show',
          value: params,
        })
        this.$store.commit('saveBarOperate', {
          index: this.index,
          type: 'add',
          params: params,
          state: state,
          methods: 'showY'
        })
      },
      changeShowNumber(state) {
        const val = this.styleConfig.config.showNumber
        this.$store.commit('changeShowNumber', {
          index: this.index,
          type: val
        })
        this.$store.commit('saveBarOperate', {
          index: this.index,
          type: 'add',
          state: state,
          params: val,
          methods: 'changeShowNumber'
        })
      },
      changeTimeAxis() {
        const val = this.styleConfig.config.timeAxis
        const index = this.option.i
        if(val) {
          this.$store.commit('editCurrentPage', {
            index: this.index,
            value: 0,
          })
        }
        bus.$emit(`updateTimeAxis_${this.option.i}`, {
          index: index,
          value: val
        })
      },
      changeLineChart(state) {
        // const array = this.styleConfig.config.selectMetricList
        this.$store.commit('changeLineChart', {
          index: this.index,
        })
      },
      changeShowLine(state) {
        const val = this.styleConfig.config.isShowLineChart
        this.$store.commit('changeShowLineChar', {
          index: this.index,
          type: val
        })
        if (val) {
           this.$store.commit('saveBarOperate', {
            index: this.index,
            type: 'add',
            state: state,
            params: val,
            methods: 'changeShowLine'
           })
        }
      },
      changeIndexPave(state) {
        const val = this.styleConfig.config.indexPave
        if (!val) {
          this.$store.commit('cancelIndexPave', {
            index: this.index
          })
        } else{
          const axisTitle = this.styleConfig.config.axisTitle
          if (axisTitle) {
             this.styleConfig.config.axisTitle = false
             this.$store.commit('showAxisBarTitile', {
              index: this.index,
              type: false
            })
          }
        }
        const index = this.option.i
        bus.$emit(`updateIndexPave_${this.option.i}`, {
          index: index,
          value: val
        })
      },
      async changeDim(obj) {
       const indexPave = obj.indexPave
       const index = obj.index
       const val = obj.value
       const selectDimValue = obj.selectDimValue
       if (selectDimValue.length) {
          bus.$emit(`updateIndexPave_${this.option.i}`, {
            index: index,
            value: indexPave
          })
       }
       // this.selectDimValue = []
       this.$store.commit('saveDimLimit', {
            index: this.index,
            name: 'selectDimValue',
            value: []
       })
       const data = await api.queryDimInfoByKey({
        key: '',
        dimCode: val
       })
       if (data.data !== undefined && data.data.length) {
         this.dimValueList = data.data
         this.dimValueList.forEach(item => {
           for (let key in item) {
             if (item.hasOwnProperty(key) && key === 'dimValueNm') {
               item[key] = item[key].replace('###', '_')
             }
           }
         })
       }
      },
      async changeRemoteMethod(obj) {
         const dimCode = this.option.feature.styleConfig.config.selectedDim
         this.$store.commit('saveSearchKey', {
          index: this.index,
          value: obj.value
        })
        if (obj.value !== '' && dimCode !== '') {
          this.loading = true
          const data = await api.queryDimInfoByKey({
           key: obj.value,
           dimCode: dimCode
          })
          this.loading = false
         if (data.data !== undefined && data.data.length) {
          this.dimValueList = data.data
          this.dimValueList.forEach(item => {
           for (let key in item) {
             if (item.hasOwnProperty(key) && key === 'dimValueNm') {
               item[key] = item[key].replace('###', '_')
             }
           }
          })
         }
      }
      },
      changeDimValueTotal(obj) {
        const val = obj.value
        const index = obj.index
        const selectDimValue = this.styleConfig.config.selectDimValue
        const newArr = []
         this.dimValueList.map((item, index) => {
          newArr.push(item.dimValueNm)
         })

        let arrayFilter = []
       if (selectDimValue && selectDimValue.length)  {
         arrayFilter = selectDimValue.filter((item, index) => {
          return !newArr.includes(item)
        });
       }
        const optionDataList = []
        const reg = /(.+)_(.+)/
        arrayFilter.map((item, index) => {
          const arr = item.match(reg)
          optionDataList.push({
            dimValue: arr[1],
            dimValueNm: item
          })
         })
        this.dimValueList = this.dimValueList.concat(optionDataList)
        let dimCode = this.styleConfig.config.selectedDim
        // const dimList = this.$store.state.charts.chartsOption[this.index].feature.dimList
        // let dimCode = ''
        // if (dimList && dimList.length) {
        //   dimCode = dimList[0].dimCode
        // }
        this.$store.commit('saveDimValueNumList', {
          index: this.index,
          value: obj.selectDimValueNmList
        })
        bus.$emit(`updateDimValueTotal_${this.option.i}`, {
          index: index,
          value: val,
          dimCode,
          dimValueNmList: obj.selectDimValueNmList
        })
      },
      async getDimValueList() {
       let val = this.styleConfig.config.selectedDim
       if (val === undefined) {
        val = ''
       }
       // const key = this.styleConfig.config.searchKey
       if (val !== '') {
         const data = await api.queryDimInfoByKey({
          key: '',
          dimCode: val
         })

         if (data.data !== undefined && data.data.length) {
           this.dimValueList = data.data
           this.dimValueList.forEach(item => {
             for (let key in item) {
               if (item.hasOwnProperty(key) && key === 'dimValueNm') {
                 item[key] = item[key].replace('###', '_')
               }
             }
           })
         }
         const selectDimValue = this.styleConfig.config.selectDimValue
         const newArr = []
         this.dimValueList.map((item, index) => {
          newArr.push(item.dimValueNm)
         })
         let arrayFilter = []
         if (selectDimValue && selectDimValue.length)  {
           arrayFilter = selectDimValue.filter((item, index) => {
            return !newArr.includes(item)
          });
         }
         const optionDataList = []
         const reg = /(.+)_(.+)/
         arrayFilter.map((item, index) => {
          const arr = item.match(reg)
          optionDataList.push({
            dimValue: arr[1],
            dimValueNm: item
          })
         })
         this.dimValueList = this.dimValueList.concat(optionDataList)
       }
      },
      changeX(state) {
        const val = this.styleConfig.config.XAxisTitle
        const axisTitle = this.styleConfig.config.axisTitle
        if (axisTitle) {
           this.$store.commit('setCustomXAxisTitle', {
              index: this.index,
              value: val
           })
        }
        this.$store.commit('saveBarOperate', {
          index: this.index,
          type: 'add',
          params: val,
          state: state,
          methods: 'changeX'
        })
      },
      changeY(state) {
        const val = this.styleConfig.config.YAxisTitle
        const axisTitle = this.styleConfig.config.axisTitle
        if (axisTitle) {
           this.$store.commit('setCustomYAxisTitle', {
              index: this.index,
              value: val
           })
        }
        this.$store.commit('saveBarOperate', {
          index: this.index,
          type: 'add',
          params: val,
          state: state,
          methods: 'changeY'
        })
      }
  }
}
