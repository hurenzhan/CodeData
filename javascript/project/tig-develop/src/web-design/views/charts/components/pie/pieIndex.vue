<template>
   <div class="pie" v-noData="{noDataLayer, containerHasTitle}" id="pieChart">
   <div :id="chartId" style="width:100%; height:100%"></div>
  </div>
</template>

<script>
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'
// 引入折线图
import 'echarts/lib/chart/pie'
// 引入提示框
import 'echarts/lib/component/tooltip'
// 引入图例
import 'echarts/lib/component/legend'
// 引入可滚动的图例
import 'echarts/lib/component/legendScroll'
// 引入标题
import 'echarts/lib/component/title'

import bus from "../../utils/eventBus";
import { sendLinkInfo, wait } from "../../utils/utils";
import search from "../../../../api/search";
import pieMethod from "./pie";
import noDataMixin from "../mixins/noData/noDataMixin";
import aliasMap from "../mixins/aliasChange/aliasMap";
import { containerInit } from "../../static/configData";
export default {
  name: "Pie",
  components: {},
  props: {
    index: {
      default: 0
    }
  },
  mixins: [search, pieMethod, noDataMixin, aliasMap],
  data() {
    return {
      chart: null
    };
  },
  async created() {},
  computed: {
    chartId() {
      return `chartPie-${this.index}`;
    },
    dimListLength() {
      return this.$store.state.charts.chartsOption[this.index].feature.dimList
        .length;
    },
    styleConfig() {
      return this.$store.state.charts.chartsOption[this.index].feature
        .styleConfig;
    },
    option() {
      return this.$store.state.charts.chartsOption[this.index];
    },
    chartsOption() {
      return this.$store.state.charts.chartsOption;
    },
    data() {
      return this.$store.state.charts.chartsOption[this.index].data;
    },
    feature() {
      return this.$store.state.charts.chartsOption[this.index].feature;
    },
    seriesData() {
      const seriesData = this.$store.state.charts.chartsOption[this.index]
        .feature.styleConfig.config.data.seriesData;
      return seriesData ? seriesData : [];
    },
    legendData() {
      const legendData = this.$store.state.charts.chartsOption[this.index]
        .feature.styleConfig.config.data.legendData;
      return legendData ? legendData : [];
    }
    // isDisabledLegend() {
    //  return this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config.isDisabledLegend
    // },
    // isDisabledRadius() {
    //  return this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config.isDisabledRadius
    // }
  },
  methods: {
    drawCharts(type, series, legendData, metricName, hightLight) {
      const chart = echarts.init(document.getElementById(this.chartId));
      this.chart = chart;
      const showrModel = this.styleConfig.config.showrModel;
      if (series !== undefined) {
        if (series.length === 1) {
          let tempData = series[0].data;
          tempData.sort((a, b) => {
            return b.value - a.value;
          });
        }
        if (series.length === 2) {
          let tempData = series[0].data;
          let tempData2 = series[1].data;
          tempData.sort((a, b) => {
            return b.value - a.value;
          });
          tempData2.sort((a, b) => {
            return b.value - a.value;
          });
        }
        this.styleConfig.config.series = series;
      }
      // 多指标饼图 不显示轴标题
      const metricList = this.feature.metricList;
      if (metricList.length > 1) {
         this.styleConfig.config.title.show = false
      }
      // if (showrModel === '1') {
      //   this.styleConfig.config.series.map((item, index) => {
      //     item.radius = ['50%', '40%']
      //   })
      // }
      if (type === "update") {
        this.chart.clear();
        if (this.styleConfig.config.series) {
          this.styleConfig.config.series.map((item, index) => {
            const formatter = params => {
              let splitParams = "";
              if (params.name.indexOf("###") !== -1) {
                let dimName = params.name.split("###")[1];
                splitParams =
                  dimName.length > 6 ? dimName.substr(0, 6) + "..." : dimName;
              } else {
                splitParams =
                  params.name.length > 6
                    ? params.name.substr(0, 6) + "..."
                    : params.name;
              }
              params.name = splitParams;
              const value = this.setLabel(
                this.styleConfig.config.labelStyle,
                params
              );
              return value;
            };
            item.label.formatter = formatter;
          });
        }
      }
      if (legendData !== undefined) {
        this.styleConfig.config.legend.data = legendData;
        const legendFormatter = params=> {
          if (params.indexOf('###') !== -1) {
            let dimName = params.split('###')[1]
            return dimName.length > 6
              ? dimName.substr(0, 6) + '...'
              : dimName
          } else {
            return params.length > 6
              ? params.substr(0, 6) + '...'
              : params
          }
        }
        this.styleConfig.config.legend.formatter = legendFormatter
      }
      if (metricName !== undefined) {
        // 指标别名应用
        const alias = this.getAliasByMetricName(metricName);
        this.styleConfig.config.title.text =
          alias === false ? metricName : alias;
      }

      if (hightLight !== undefined) {
        this.styleConfig.config.highLight = hightLight;
      }
      // this.changeLabel(this.styleConfig.config.labelStyle)
      // this.initStyleConfig()
      chart.setOption(this.styleConfig.config);
    },
    handelData(mockData, type) {
      const piePosition = this.getPieXPosition();
      let radius = "80%";
      let xPosition = "45%";
      let yPosition = "50%";
      if (piePosition.radius) {
        radius = piePosition.radius;
      }
      if (piePosition.xPercent !== "NaN%" && piePosition.yPercent) {
        xPosition = piePosition.xPercent;
        yPosition = piePosition.yPercent;
      }
      const retObj = {};
      const length = this.feature.dimList.length;
      const metricList = this.feature.metricList;
      let dimCodeS = "";
      if (length && length > 0) {
        dimCodeS = this.feature.dimList[0].dimCode;
      }
      let metricNameS = "";
      if (this.feature.metricList && this.feature.metricList.length > 0) {
        metricNameS = this.feature.metricList[0].metricName;
      }
      const labelStyle = this.styleConfig.config.labelStyle;
      let isShowLabel = true;
      // 标签样式为关闭的时候
      if (labelStyle === "4") {
        isShowLabel = false;
      }
      const isShowLabelLine = this.styleConfig.config.labelLine;
      const metricCodeS = this.feature.metricList[0].metricCode;
      const legendArray = [];
      const handleSeries = [
        {
          name: "",
          type: "pie",
          radius: radius,
          center: [xPosition, yPosition],
          hoverAnimation: true,
          legendHoverLink: false,
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 0.25
          },
          label: {
            show: isShowLabel,
            color: "#333",
            padding: [3, 4, 5, 6],
            lineHeight: 20,
            align: "left",
            verticalAlign: "middle",
            width: 100,
            rich: {
              a: {
                color: "#666666",
                // lineHeight: 0,
                align: "left",
                padding: [0, 10, 0, 0],
                fontSize: 12,
                height: 500
              },
              b: {
                color: "#666666",
                lineHeight: 20,
                align: "right",
                padding: [0, 0, 0, 0],
                fontSize: 12
              }
            },
            // formatter: params => {
            //    let splitParams = ''
            //    if (params.name.indexOf('_') !== -1) {
            //       let dimName = params.name.split('_')[1]
            //       splitParams = dimName.length > 15
            //         ? dimName.substr(0, 15) + '...'
            //         : dimName
            //     } else {
            //       splitParams = params.name.length > 15
            //         ? params.name.substr(0, 15) + '...'
            //         : params.name
            //     }
            //     params.name = splitParams
            //     let value = this.setLabel(this.styleConfig.config.labelStyle, params);
            //     value = value.split(',')
            //     const text1 = value[0].length > 7 ? value[0].substr(0, 7) + '...' : value[0]
            //     const text2 = value[1] ? value[1] : ""
            //     const text3 = value[2] ? ', ' + value[2] : ""
            //     return  '{a|' + text1 +  text2 + '}' + '\n' + '{b|' +  text3 + '}'
            // }
            formatter: params => {
              let splitParams = "";
              if (params.name.indexOf("###") !== -1) {
                let dimName = params.name.split("###")[1];
                splitParams =
                  dimName.length > 6 ? dimName.substr(0, 6) + "..." : dimName;
              } else {
                splitParams =
                  params.name.length > 6
                    ? params.name.substr(0, 6) + "..."
                    : params.name;
              }
              params.name = splitParams;
              const value = this.setLabel(
                this.styleConfig.config.labelStyle,
                params
              );
              return value;
            }
          },
          labelLine: {
            normal: {
              show: isShowLabelLine,
              lineStyle: {
                color: "#979797"
              },
              length: 0,
              length2: 30
            }
          },
          data: []
        }
      ];
      const seriesData = [];
      let totalNum = 0;
      if (mockData !== undefined) {
        if (type === "pave") {
          metricList.map((itemMetric, indexMetric) => {
            // 截取前10条数据
            if (indexMetric < 10) {
              totalNum = totalNum + Number(mockData[itemMetric.metricCode]);
              const alias = this.getAliasByMetricCode(itemMetric.metricCode);
              legendArray.push(alias === false ? itemMetric.metricName : alias);
              const obj = {};
              obj.name = alias === false ? itemMetric.metricName : alias;
              obj.value = mockData[itemMetric.metricCode];
              handleSeries[0].data.push(obj);
              seriesData.push(obj);
            }
          });
        } else {
          mockData.map((item, index) => {
            totalNum = totalNum + Number(item[metricCodeS]);
            legendArray.push(item[dimCodeS]);
            const obj = Object.assign({}, item);
            obj.name = item[dimCodeS];
            obj.value = item[metricCodeS];
            handleSeries[0].data.push(obj);
            seriesData.push(obj);
          });
        }
      }
      if (totalNum) {
        totalNum = totalNum.toFixed(4);
      }
      retObj.legendData = legendArray;
      retObj.series = handleSeries;
      // 更新数据前再给seriesData排一次序
      seriesData.sort((a, b) => {
        return b.value - a.value;
      });
      retObj.seriesData = seriesData;
      retObj.metricName = metricNameS;
      retObj.totalNum = totalNum;
      return retObj;
    },
    handelPaveData(data) {
      const metricList = this.feature.metricListFlat
        ? this.feature.metricListFlat
        : this.feature.metricList;
      const length = metricList.length;
      const indexPaveDataList = [];
      if (data && data.length > 0) {
        const paveData = data[0];
        if (paveData && length !== undefined) {
          for (let i = 0; i < length; i++) {
            const obj = {};
            const metricCode = metricList[i].metricCode;
            obj[metricList[i].metricCode] = paveData[metricCode];
            obj.metricName = metricList[i].metricName;
            indexPaveDataList.push(obj);
          }
        }
      }
      return indexPaveDataList;
    },
    init(type, data, handelDataType) {
      if (data && data.length && data.length > 0) {
        data.forEach(item => {
          if (Object.keys(item).length !== 0) {
            Object.keys(item).forEach(key => {
              if (item[key] === "") item[key] = " ";
            });
          }
        });
      }
      // if (data !== undefined) {
      const handelData = this.handelData(data, handelDataType);
      this.$store.commit("saveHandelData", {
        index: this.index,
        value: handelData
      });
      const legendData = handelData.legendData;
      const series = handelData.series;
      const metricName = handelData.metricName;
      const seriesData = handelData.seriesData;
      this.initLableStyle(seriesData);
      // }
      if (type === "update") {
        this.initTooltip();
        this.initLegend();
        this.redrawEchart(
          data,
          "update",
          series,
          legendData,
          metricName,
          seriesData
        );
      } else if (type === "nestPie") {
        this.drawNestPie();
      } else {
        this.drawCharts("normal", series, legendData, metricName);
        this.chart.on("click", this.sendMessage);
      }
    },
    updateEchart(setOption) {
      if (this.chart !== null) {
        if (setOption !== null) {
          this.chart.setOption(setOption, true);
        }
      }
    },
    sendMessage(params) {
      const showrModel = this.styleConfig.config.showrModel;
      if (showrModel === "2") {
        return;
      }
      const dimList = this.chartsOption[this.index].feature.dimList;
      let dimCode = "";
      if (dimList.length) {
        dimCode = this.chartsOption[this.index].feature.dimList[0].dimCode;
      }
      let dimValue = params.data.name;
      let dimName = params.data.name || ''
      if(params.data.name.indexOf('###')!==-1){
        dimValue = params.data.name.split('###')[0];
        dimName = params.data.name.split('###')[1]
      }
      const nearUpdateTime = this.chartsOption.nearUpdateTime;
      const linkInfo = {
        dimName,
        dimCode,
        dimValue,
        nearUpdateTime
      };
      sendLinkInfo(this.chartsOption, this.index, linkInfo);
    },
    async update(fun, index, dimCode, dimValue) {
      const linkInfo = {
        dimCode,
        dimValue
      };
      let data = await this.updateDataPre({ index, linkInfo });
      if (data !== undefined) {
        data = JSON.parse(JSON.stringify(data));
        data = data.splice(0, 10);
      }
      fun("update", data);
      this.toggleNoData(data.length);
    },
    setLabel(index, params) {
      let name  = params.name
      name = name.indexOf('###')!==-1 ? name.replace('###','_') : name
      switch (index) {
        case "0":
          return name + ",  " + params.percent + "%";
          break;
        case "1":
          return name;
          break;
        case "2":
          return name + "," + params.data.value;
          break;
        case "3":
          return (
            name + "," + params.data.value + "," + params.percent + "%"
          );
          break;
        case "4":
          return name + ",  " + params.percent + "%";
      }
    },
    initLableStyle(data) {
      const labelOption = this.styleConfig.config.labelOption;
      const labelStyle = this.styleConfig.config.labelStyle;
      labelOption[0].disabled = false;
      labelOption[3].disabled = false;
      for (let i = 0; i < data.length; i++) {
        if (Number(data[i].value < 0)) {
          labelOption[0].disabled = true;
          labelOption[3].disabled = true;
          if (labelStyle === "0") {
            this.styleConfig.config.labelStyle = "1";
          }
          return;
        }
      }
    },
    initStyleConfig() {
      const operate = this.styleConfig.config.operate;
      if (operate) {
        operate.map((item, index) => {
          const methods = item.methods;
          this[methods](false, item.params);
        });
      }
    },
    redrawEchart(data, type, series, legendData, metricName, seriesData) {
      const piePosition = this.getPieXPosition();
      if (this.chart) {
        this.chart.clear();
        this.chart.off("click", this.sendMessage);
      }
      const highLight = this.styleConfig.config.highLight;
      const newHighLight = [];
      if (highLight) {
        highLight.map((itemHighLight, indexHighLight) => {
          seriesData.map((item, index) => {
            if (itemHighLight === item.name) {
              newHighLight.push(itemHighLight);
            }
          });
        });
      }
      const showModel = this.styleConfig.config.showrModel;
      // const radius = this.styleConfig.config.radius
      // const outerRadius  = (Number(radius.split('%')[0]) - 10) + '%'
      if (showModel === "1") {
        if (series) {
          series.map((item, index) => {
            item.radius = [piePosition.innerRadius, piePosition.radius];
          });
        }
      }
      this.styleConfig.config.highLight = newHighLight;
      const highLightData = this.highLightMethod(newHighLight);
      this.styleConfig.highLightData = highLightData;
      this.drawCharts(type, series, legendData, metricName);
      this.chart.on("click", this.sendMessage);
      // const dimListLength = this.option.feature.dimList.length
      if (showModel === "1" && data) {
        this.initStyleConfig();
      }
    },
    formatter(params) {
      let name  = params.data.name
      name = name.indexOf('###')!==-1 ? name.replace('###','_') : name
      const str =
        '<div style="border-radius:2px; padding:5px"><span style="border-radius:50%;width:8px;height:8px;display:inline-block;background:' +
        params.color +
        '"></span><span style="width:10px;height:10px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;padding-left:5px;padding-top:6px">' +
        name +
        '<span style="padding-left:10px">' +
        params.data.value +
        "</span>" +
        "</span>" +
        '<div style="padding:5px;"><span style="width:100px;padding-left:5px;text-align:right;display:inline-block">占比</span>' +
        '<span style="padding-left:10px">' +
        params.percent +
        "%</span></div></div>";
      return str;
    },
    legendFormatter(params) {
      if (params.indexOf("###") !== -1) {
        let dimName = params.split("###")[1];
        return dimName.length > 6 ? dimName.substr(0, 6) + "..." : dimName;
      } else {
        return params.length > 6 ? params.substr(0, 6) + "..." : params;
      }
      // return name.length > 11 ? name.substr(0, 10) + "..." : name;
    },
    legendTootipFormatter(params) {
      // const str = '<div style="background:black;border-radius:4px;padding:5px;font-size:12px;color:#fff;opacity:0.5">' + params.name +'</div'
      // return str
      let name  = params.name
          name = name.indexOf('###')!==-1 ? name.replace('###','_') : name
      const str =
        '<div style="border-radius:4px;padding:0 5px;font-size:12px;color:rgba(0,0,0,0.65)">' +
        name +
        "</div";
      return str;
    },
    nestPie(data1, data2) {
      const piePosition = this.getPieXPosition();
      if (data1 !== undefined) {
        data1 = JSON.parse(JSON.stringify(data1));
        data1 = data1.splice(0, 10);
      }
      if (data2 !== undefined) {
        data2 = JSON.parse(JSON.stringify(data2));
        data2 = data2.splice(0, 10);
      }
      const dimId1 = this.feature.dimList[0].dimCode;
      const dimId2 = this.feature.dimList[1].dimCode;
      const metricCode = this.option.feature.metricList[0].metricCode;
      const metricName = this.option.feature.metricList[0].metricName;
      const legendData = [];
      this.styleConfig.config.showrModel = "2";
      const labelStyle = this.styleConfig.config.labelStyle;
      let isShowLabel = true;
      // 标签样式为关闭的样式
      if (labelStyle === "4") {
        isShowLabel = false;
      }
      const isShowLabelLine = this.styleConfig.config.labelLine;
      const handleSeries = [
        {
          name: "",
          type: "pie",
          radius: [0, piePosition.innerRadius - 30],
          center: [piePosition.xPercent, piePosition.yPercent],
          hoverAnimation: true,
          legendHoverLink: false,
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 0.25
          },
          label: {
            show: false,
            color: "#333"
          },
          labelLine: {
            normal: {
              show: false,
              lineStyle: {
                color: "#979797"
              },
              length: 0,
              length2: 30
            }
          },
          data: []
        },
        {
          name: "",
          type: "pie",
          radius: [piePosition.innerRadius, piePosition.radius],
          center: [piePosition.xPercent, piePosition.yPercent],
          hoverAnimation: true,
          legendHoverLink: false,
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 0.25
          },
          label: {
            show: isShowLabel,
            color: "#333",
            formatter: params => {
              let splitParams = "";
              if (params.name.indexOf("###") !== -1) {
                let dimName = params.name.split("###")[1];
                splitParams =
                  dimName.length > 6 ? dimName.substr(0, 6) + "..." : dimName;
              } else {
                splitParams =
                  params.name.length > 6
                    ? params.name.substr(0, 6) + "..."
                    : params.name;
              }
              params.name = splitParams;
              const value = this.setLabel(
                this.styleConfig.config.labelStyle,
                params
              );
              return value;
            }
          },
          labelLine: {
            normal: {
              show: isShowLabelLine,
              lineStyle: {
                color: "#979797"
              },
              length: 10,
              length2: 30
            }
          },
          data: []
        }
      ];
      if (data1 !== undefined) {
        data1.map((item, index) => {
          if (item[dimId1] === "") {
            item[dimId1] = " ";
          }
          handleSeries[0].data.push({
            name: item[dimId1],
            value: item[metricCode]
          });
          legendData.push(item[dimId1]);
        });
      }
      if (data2 !== undefined) {
        data2.map((item, index) => {
          if (item[dimId2] === "") {
            item[dimId2] = " ";
          }
          handleSeries[1].data.push({
            name: item[dimId2],
            value: item[metricCode]
          });
          legendData.push(item[dimId2]);
        });
      }
      this.initTooltip();
      this.initLegend();
      this.drawCharts("update", handleSeries, legendData, metricName);
      this.loadingToggle(this.index, false);
      // data不为空时，toggleNoData遮罩了原图
      this.toggleNoData(data1.length);
      this.chart.on("click", this.sendMessage);
    },
    initTooltip() {
      let isShow = this.styleConfig.config.tooltip.show;
      this.styleConfig.config.tooltip = {
        show: isShow,
        confine: true,
        trigger: "item",
        backgroundColor: "rgba(0,0,0,0.7)",
        textStyle: {
          color: "#fff",
          fontSize: 12
        },
        formatter: params => {
          let name  = params.data.name
          name = name.indexOf('###')!==-1 ? name.replace( '###' , '_') : name
          const str =
            '<div style="border-radius:2px; padding:5px;"><span style="border-radius:50%;width:8px;height:8px;display:inline-block;background:' +
            params.color +
            '"></span><span style="width:10px;height:10px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;padding-left:5px;padding-top:6px">' +
            name +
            '<span style="padding-left:10px">' +
            params.data.value +
            "</span>" +
            "</span>" +
            '<div style="padding-left:10px"><span style="display:inline-block">占比</span>' +
            '<span style="padding-left:10px">' +
            params.percent +
            "%</span></div></div>";
          return str;
        },
        extraCssText:
          "box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px"
      };
    },
    initLegend() {
      this.styleConfig.config.legend.formatter = this.legendFormatter;
      let isShow = this.styleConfig.config.legend.tooltip.show;
      this.styleConfig.config.legend.tooltip = {
        show: isShow,
        confine: true,
        textStyle: {
          color: "#fff"
        },
        formatter: function(params) {
          let name  = params.name
          name = name.indexOf('###')!==-1 ? name.replace('###','_') : name
          const str =
            '<div style="border-radius:2px;padding:0 5px;font-size:12px;">' +
            name +
            "</div";
          return str;
        },
        backgroundColor: "rgba(0,0,0,0.7)",
        extraCssText:
          "box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);borderRadius: 1.6px"
      };
    },
    drawNestPie(startTime, endTime) {
      let condiStartDate = this.option.nearUpdateTime[0];
      let condiEndDate = this.option.nearUpdateTime[1];
      if (startTime && endTime) {
        condiStartDate = startTime;
        condiEndDate = endTime;
      }
      const dimList = this.option.feature.dimList;
      let dimListArray = [];
      if (dimList) {
        dimListArray = dimList.map(item => {
          return {
            dimId: item.dimCode,
            dimName: item.dimName
          };
        });
      }
      const dimList1 = new Array();
      dimList1.push(dimListArray[0]);
      // const dimId1 = dimList1[0].dimId
      const dimList2 = [];
      dimList2.push(dimListArray[1]);
      // const dimId2 = dimList2[0].dimId;
      const _this = this;
      wait(0.2).then(() => {
        let data1 = this.updateDataPre({
          index: this.index,
          dimList: dimList1,
          loadingFalse: false,
          startTime: condiStartDate,
          endTime: condiEndDate
        });
        let data2 = this.updateDataPre({
          index: this.index,
          dimList: dimList2,
          loadingFalse: false,
          startTime: condiStartDate,
          endTime: condiEndDate
        });
        Promise.all([data1, data2]).then(data => {
          _this.nestPie(data[0], data[1]);
          _this.loadingToggle(_this.index, false);
        });
      });
    }
  },
  beforeDestroy() {
    bus.$off(`resizeOrMove_${this.index}`);
    bus.$off(`updateLink_${this.index}`);
    bus.$off(`updateQuery_${this.index}`);
    bus.$off(`updateData_${this.index}`);
  },
  mounted() {
    bus.$on("updateOptionPie", obj => {
      if (this.index === obj.index) {
        this.updateEchart(obj.config);
      }
    });
    bus.$on(`updateData_${this.option.i}`, obj => {
      const dimList = this.option.feature.dimList;
      const dimListLength = dimList.length;
      if (dimListLength && dimListLength === 1) {
        let data = obj.data;
        if (obj.data !== undefined) {
          data = JSON.parse(JSON.stringify(obj.data));
          data = data.splice(0, 10);
        }
        if (this.styleConfig.config.showrModel === "2") {
          this.styleConfig.config.showrModel = "0";
        }
        this.init("update", data);
      } else if (dimListLength === 2) {
        this.drawNestPie();
      } else if (dimListLength === 0) {
        let data = obj.data[0];
        //  const handelPaveData = this.handelPaveData(data)
        // 维度长度为0时，改变showrModel为0
        if (this.styleConfig.config.showrModel === "2") {
          this.styleConfig.config.showrModel = "0";
        }
        this.init("update", data, "pave");
      }
      this.loadingToggle(this.index, false);
      this.toggleNoData(this.option.data.length);
    });
    bus.$on(`updateLink_${this.option.i}`, obj => {
      const showrModel = this.styleConfig.config.showrModel;
      if (showrModel === "2") {
        return;
      }
      const dimCode = obj.linkInfo.dimCode;
      const dimValue = obj.linkInfo.dimValue;
      this.update(this.init, this.index, dimCode, dimValue);
    });
    bus.$on(`updateQuery_${this.option.i}`, obj => {
      const showrModel = this.styleConfig.config.showrModel;
      const dimList = this.option.feature.dimList;
      const dimListLength = dimList.length;
      if (showrModel === "2" && dimListLength && dimListLength === 2) {
        let startTime;
        let endTime;
        if (obj.dateData.length > 0) {
          startTime = obj.dateData[0].dateData[0];
          endTime = obj.dateData[0].dateData[1];
        }
        this.drawNestPie(startTime, endTime);
      } else if (dimListLength === 0) {
        (async () => {
          let data = await this.updateDataPre({
            index: this.index,
            queryInfo: obj
          });
          const length = data.length;
          if (length > 0) {
            data = data[0];
            this.init("update", data, "pave");
          }
          this.toggleNoData(length);
        })();
      } else {
        (async () => {
          let data = await this.updateDataPre({
            index: this.index,
            queryInfo: obj
          });
          if (data !== undefined) {
            data = JSON.parse(JSON.stringify(data));
            data = data.splice(0, 10);
          }
          this.init("update", data);
          this.toggleNoData(data.length);
        })();
      }
    });
    bus.$on(`resizeOrMove_${this.option.i}`, () => {
      const piePosition = this.getPieXPosition();
      const xPercent = piePosition.xPercent;
      const yPercent = piePosition.yPercent;
      const radius = piePosition.radius;
      const innerRadius = piePosition.innerRadius;
      const xPx = piePosition.xPx;
      const yPX = piePosition.yPX;
      const titleLeft = piePosition.titleLeft;
      this.$store.commit("setPieXPosition", {
        index: this.index,
        xPercent,
        yPercent,
        radius,
        xPx,
        yPX,
        titleLeft,
        innerRadius
      });
      // const width = getComputedStyle(document.getElementById("pieChart")).width.split("px")[0] - 10
      // const legendPosition = this.styleConfig.config.legendPosition
      // const legendShow = this.styleConfig.config.legend.show
      // let minWidthLegend = (2 * (radius + 150 + 16) + 108)
      // let minWidthLabel = 2 * (radius + 150 + 16)
      // if (!legendShow || legendPosition === 'top' || legendPosition === 'bottom') {
      //    minWidthLegend = 2 * (radius + 150 + 16)
      // }
      // if (width <= minWidthLabel) {
      //      // 关闭标签
      //      this.changeLabel("4")
      //      // 关闭图例
      //      this.styleConfig.config.legend.show = false
      //      const legendPosition = this.styleConfig.config.legendPosition
      //      this.changeLengend(legendPosition)
      //    } else if (width > minWidthLabel && width <= minWidthLegend) {
      //      const labelStyle = this.styleConfig.config.labelStyle
      //      this.changeLabel(labelStyle)
      //      // 关闭图例
      //      this.styleConfig.config.legend.show = false
      //      const legendPosition = this.styleConfig.config.legendPosition
      //      this.changeLengend(legendPosition)
      //    } else {
      //     const labelStyle = this.styleConfig.config.labelStyle
      //      this.changeLabel(labelStyle)
      //     this.styleConfig.config.legend.show = true
      //     this.styleConfig.config.labelLine = true
      //     const legendPosition = this.styleConfig.config.legendPosition
      //     this.changeLengend(legendPosition)
      //    }
      if (this.chart) {
        this.chart.resize();
      }
      const paveDisplay = this.styleConfig.config.pavedDisplay;
      const showrModel = this.styleConfig.config.showrModel;
      if (showrModel === "1" && paveDisplay) {
        this.changePavedDisplay(false, paveDisplay);
      }
    });
    const path = this.$route.path;
    const seriesLength = this.styleConfig.config.series.length;
    // series已有数据时不再初始化
    if (seriesLength === 0) {
      const dimListLength = this.option.feature.dimList.length;
      if (dimListLength && dimListLength === 2) {
        // let data = this.data;
        // if (this.data !== undefined) {
        //   data = JSON.parse(JSON.stringify(this.data));
        //   data = data.splice(0, 10);
        // }
        this.init("nestPie");
      } else if (dimListLength === 0) {
        let data = this.data[0];
        this.init("init", data, "pave");
      } else {
        let data = this.data;
        if (this.data !== undefined) {
          data = JSON.parse(JSON.stringify(this.data));
          data = data.splice(0, 10);
        }
        this.init("init", data);
      }
    }
    // 通知查询面板准备完毕
    this.$store.commit("chartsReady", {
      index: this.index
    });
  }
};
</script>
<style lang="less">
</style>
