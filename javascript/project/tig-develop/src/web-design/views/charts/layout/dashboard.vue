<template>
  <div class="dashboard" :class="{preview: previewToggle || isVisual,visual: isVisual, over: isOver}">
    <top class="top"></top>
    <left class="left my-slide-bar"></left>
    <right v-if="!isVisual" class="right"></right>
    <metric-dialog v-if="!isVisual" v-show="!isEdit" :value="toggle"></metric-dialog>
    <save-dialog v-if="!isVisual" :value="saveToggle"></save-dialog>
    <warn-dialog v-if="!isVisual" :value="warnToggle"></warn-dialog>
  </div>
</template>

<script>
import left from "./left";
import right from "./right";
import top from "./top";
import metricDialog from "./metricDialog";
import saveDialog from "./saveDialog";
import warnDialog from "./warnDialog";
import api from "../../../api/charts";
import login from "@/web-design/api/login";
import eventBus from "../utils/eventBus";

export default {
  name: "Dashboard",
  data() {
    return {
      loginInterval: "" // 登录定时器
    };
  },
  components: { left, right, top, metricDialog, saveDialog, warnDialog },
  mounted() {
    // 判断是新建or再编辑or产看
    if (this.route.path === "/edit") {
      this.getReportInfo({ ...this.route.query });
    }
    if (this.route.path === "/visual") {
      this.getReportInfo({ ...this.route.query });
    }
    // 同步用户数据到vuex上
    this.$store.dispatch("initUserMenu");

    // 关闭track，避免外链
    window.G2.track(false);
    window.G6.track(false);

    /**
     * 监听窗口，如果窗口大于800，隐藏横向滚动条，小于就放开横向滚动条
     * 如果是预览或者查看状态下才监听
     */
    if (this.previewToggle || this.isVisual) {
      window.onresize = () => {
        let dashboard = document.querySelector(".dashboard");
        if (dashboard.offsetWidth < 800) {
          dashboard.classList.add("over");
        } else {
          if (Array.from(dashboard.classList).includes("over")) {
            dashboard.classList.remove("over");
          }
        }
      };
    }

    // 判断是不是编辑状态，如果是编辑状态就开启定时器，保持登录状态，15分钟发起一次请求
    if (this.route.path !== "/visual") {
      this.loginInterval = setInterval(() => {
        login.user();
      }, 1000 * 60 * 15);
    }
  },
  computed: {
    // 路由信息
    route() {
      return this.$route;
    },
    // 弹窗
    toggle() {
      return this.$store.state.charts.metricDialogToggle;
    },
    // 保存
    saveToggle() {
      return this.$store.state.charts.saveDialogToggle;
    },
    //告警toggle
    warnToggle() {
      return this.$store.state.charts.warnDialogToggle;
    },
    // 预览toggle
    previewToggle() {
      return this.$store.state.charts.previewToggle;
    },
    // 判断是不是产看状态
    isVisual() {
      return this.route.path === "/visual";
    },
    // 判断是不是编辑状态
    isEdit() {
      return this.route.path === "/edit";
    },
    // 根据预览状态判断加不加over类
    isOver() {
      if (this.previewToggle) {
        let dashboard = document.querySelector(".dashboard");
        if (dashboard.offsetWidth < 800) {
          return true;
        } else {
          if (Array.from(dashboard.classList).includes("over")) {
            return false;
          }
        }
      }
    }
  },
  watch: {
    // 锁定的报表不能再进入编辑,所以监听route的变化，要是进入的编辑重走下getReportInfo
    route() {
      if (this.isEdit) this.getReportInfo({ ...this.route.query });
    }
  },
  methods: {
    // 获取报表详情
    async getReportInfo(data) {
      const res = await api.getReportInfo(data);
      if (!res) return;
      const content = res.data.reportContent;
      // console.log(JSON.parse(content))
      // 1. 指标动态更新内容，主要是后增的单位支持

      // 2. 报表基础字段检查，没有则赋默认值 （0 false 都是有值）

      // 3. chartsOptions 每种图表每个功能点遍历，有功能则需要将默认值判断）

      // 锁定的报表不能再进入编辑
      if (res.data.isLock === 1 && this.isEdit) {
        this.$alert("锁定的报表不能再编辑", {
          confirmButtonText: "确定",
          callback: action => {
            this.$router.push("/");
          }
        });
        return;
      }
      if (res.statusCode === "0") {
        const content = JSON.parse(res.data.reportContent);
        // 给报表里的dimList数组元素添加isCustom属性
        content.dataSet.forEach(dataItem =>
          this.dimListIsCustom(dataItem.dimList)
        );
        const dataSetMetricList = content.dataSet;
        for (const item of dataSetMetricList) {
          if (!item.mulUnits) {
            item.mulUnits = [];
          }
        }
        // 别名是否存在
        if (!content.alias) {
          content.alias = {
            metrics: [],
            dims: []
          };
        }
        // 给选中容器里的dimList数组元素添加isCustom属性
        content.chartsOption&&content.chartsOption.forEach(dataItem =>
          this.dimListIsCustom(dataItem.feature.dimList)
        );
        // todo 用getInShowContainers过滤下
        const charts = content.chartsOption;
        if (charts) {
          for (const item of charts) {
            if (item.feature && item.feature.metricList) {
              for (const el of item.feature.metricList) {
                if (!el.timeGranularity) {
                  el.timeGranularity = "TG_00000003";
                }
                if (!el.mulUnits) {
                  el.mulUnits = [];
                }
                if (!el.unitSelected) {
                  el.unitSelected = "";
                }
                if (!el.feature) {
                  el.feature = {
                    value1: true,
                    value2: false,
                    value3: false,
                    value4: false,
                    value5: false,
                    value6: false,
                    value7: false,
                    value8: false,
                    value9: false
                  };
                }
              }
            }
            if (!item.feature.metricListFlat) {
              item.feature.metricListFlat = item.feature.metricList;
            }
            if (
              item.feature.styleConfig &&
              !item.feature.styleConfig.dimSelected
            ) {
              item.feature.styleConfig["dimSelected"] = [];
            }
            if (item.enableTab === undefined) {
              item.enableTab = false;
            }
            if (!item.selectedTab) {
              item.selectedTab = "";
            }
            if (!item.warnData) {
              item.warnData = [];
            }
            if (!item.selectedReport) {
              item.selectedReport = "";
            }
            if (item.showMoreDataFlag === undefined) {
              item.showMoreDataFlag = false;
            }
            if (!item.dimFilter) {
              item.dimFilter = [];
            }
            if (
              item.feature.styleConfig &&
              item.feature.styleConfig.tableHeader
            ) {
              item.feature.styleConfig.header = JSON.parse(
                JSON.stringify(item.feature.styleConfig.tableHeader)
              );
              delete item.feature.styleConfig.tableHeader;
            }
            if (item.sortByWhich === undefined) {
              item.sortByWhich = 1;
            }
            if (item.sortType === undefined) {
              item.sortType = 1;
            }
            // 对查询面板的处理 版本兼容
            if (item.id === 2) {
              if (
                item.feature.dropDownData &&
                item.feature.dropDownData.length > 0
              ) {
                item.feature.dropDownData.forEach(item => {
                  if (item.dimSelectedNameList === undefined) {
                    item.dimSelectedNameList = [];
                  } else {
                    item.dimSelectedNameList = [];
                    item.dimSelectedList = [];
                  }
                  if (item.controlType === undefined) {
                    item.controlType = 0;
                  }
                  if (item.type === undefined) {
                    item.type = false;
                  }
                });
              }
              if (
                item.feature.dataMetricData &&
                item.feature.dataMetricData.length > 0
              ) {
                item.feature.dataMetricData.forEach(item => {
                  item.title = "";
                });
              }
              // 查询面板小时粒度 版本兼容
              if (
                item.feature.periodData &&
                item.feature.periodData.length > 0
              ) {
                item.feature.periodData.forEach(item => {
                  if (!item.selected.some(list => list.value === 6)) {
                    item.selected.push({
                      disabled: false,
                      label: "时",
                      limitRange: '',
                      type: 0,
                      value: 6
                    })
                  }
                  item.selected.forEach(list => {
                    if (list.limitRange == undefined) {
                      list.limitRange = parseInt(list.value) === 1 ? 30 : ''
                    }
                  })
                })
              }
            }
            if (item.feature.chartId === 2) {
              if (item.feature.styleConfig.filterDimValueFlag === undefined) {
                item.feature.styleConfig.filterDimValueFlag = false;
              }
              if (item.feature.styleConfig.showNumb === undefined) {
                item.feature.styleConfig.showNumb = false;
              }
            }

            // 更改时间粒度,如果为天时，把小时粒度改为天
            if (
              item.timeQueryCycle === "TG_00000004" &&
              item.nearUpdateTime.length > 0
            ) {
              item.nearUpdateTime = item.nearUpdateTime.map(date => {
                if (date.split("-").length > 3) {
                  return date
                    .split("-")
                    .slice(0, -1)
                    .join("-");
                } else {
                  return date;
                }
              });
            }
            // else if(item.timeQueryCycle === "TG_00000008" && item.nearUpdateTime.length > 0){
            //   // 为兼容旧报表，当nearUpdateTime内元素是 ‘第*季度’模式时转换成正常日期格式
            //     if( !item.nearUpdateTime[0].match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
            //       item.nearUpdateTime[0] = this.transformQuarterToDay(item.nearUpdateTime[0])[0]
            //       item.nearUpdateTime[1] = this.transformQuarterToDay(item.nearUpdateTime[1])[1]
            //     }
            // }
            // 高度重复计算
            // todo:旧报表不能保存，不然高度会被覆盖
            /*
              const timeFlag = '2018-05-26 16:17:08'
              if (res.data.createTime && res.data.createTime < timeFlag) {
                if (charts.map(i => i.h).sort((a, b) => a < b ? 1 : -1)[0] < 37) {
                  item.h = Math.round(item.h * 41 / 11)
                }
              }
              */
          }
        }
        this.$store.commit("asyncDataInEdit", {
          reportContent: JSON.stringify(content),
          name: res.data.reportName,
          createTime: res.data.createTime
        });
        this.$nextTick(() => {
          this.$store.commit("asyncDataTwiceInEdit", JSON.stringify(content));
        });
      }
      this.afterGetReportInfo();
    },
    // 获取到报表信息后，发射事件给top.vue
    afterGetReportInfo() {
      eventBus.$emit("afterGetReportInfo");
    },

    // 给dimList数组元素添加isCustom属性，dataSet和chartOption里都修改
    dimListIsCustom(dimList) {
      dimList &&
        dimList.forEach(dimListItem => {
          let isCustom = 0;
          let customArr = ["DASP"];
          let code = dimListItem.dimCode.split("_")[0];
          if (customArr.some(item => item === code)) {
            isCustom = 1;
          } else {
            isCustom = 0;
          }
          dimListItem.isCustom = isCustom;
        });
    },
    // 季度字符串转化为月份
    // transformQuarterToDay (string) {
    //   let re = new RegExp(/^[0-9]+第[1-4]+季度$/g)
    //   if (!re.test(string)) {
    //     return []
    //   }
    //   let year = string.match(/^[0-9]+/g)[0]      // 从季度字符串中拿到年
    //   let quarter = parseInt(string.match(/[1-4]+/g)[0]) // 从季度字符串中拿到季度
    //   let startTime
    //   let endTime
    //   switch(quarter) {
    //     case 1 :
    //       startTime = `${year}-01-01`
    //       endTime = `${year}-03-31`
    //       break;
    //     case 2:
    //       startTime = `${year}-04-01`
    //       endTime = `${year}-06-30`
    //       break;
    //     case 3:
    //       startTime = `${year}-07-01`
    //       endTime = `${year}-09-30`
    //       break;
    //     case 4:
    //       startTime = `${year}-10-01`
    //       endTime = `${year}-12-31`
    //       break;        
    //   }
    //   return [startTime, endTime]
    // }
  },
  beforeDestroy() {
    this.$store.commit("resetState");
    clearInterval(this.loginInterval);
  },

  created() {
    //限制图表查看时F5刷新次数
    let isVis = this.route.path === "/visual" ? true : false;
    document.onkeydown = function(e) {
      if (e.keyCode === 116 && isVis) {
        if (new Date().getTime() - sessionStorage.getItem("f5_limit") > 8000) {
          sessionStorage.setItem("f5_limit", new Date().getTime());
        } else {
          if (window.event) {
            e.returnValue = false;
          } else {
            e.preventDefault();
          }
        }
      }
    };
    // 可视化图表编辑时刷新提示
    // if(!isVis){
    //   window.onbeforeunload = function () { return '退出' }
    // }
  }
};
</script>

<style lang="less">
@top-height: 50px;
@top-bg-start: #27cccb;
@top-bg-end: #07a7e3;
@right-width: 220px;
@left-min-width: 400px;
@bg-color: rgb(242, 242, 242);
.dashboard {
  display: flex;
  justify-content: space-between;
  min-width: @right-width + @left-min-width;
  background: @bg-color;
  height: 100%;
  overflow: hidden;
  .my-slide-bar::-webkit-scrollbar {
    height: 8px;
    width: 8px;
    background-color: #fff;
    box-shadow: none !important;
  }
  .top {
    position: fixed;
    top: 0;
    z-index: 10;
    height: @top-height;
    background-image: linear-gradient(
      90deg,
      @top-bg-start 8%,
      @top-bg-end 100%
    );
    width: 100%;
  }
  .left {
    width: calc(~"100%" - @right-width);
    min-width: @left-min-width;
    margin-top: @top-height;
    height: calc(~"100%" - @top-height);
    overflow: auto;
    transition: all 0.2s ease;
    .custom-tips {
      display: none;
    }
  }
  .right {
    width: @right-width;
    z-index: 999;
    height: calc(~"100vh" - @top-height);
    background: #fff;
    position: fixed;
    right: 0;
    top: @top-height;
    transition: all 0.2s ease;
    &.tab-right {
      min-height: calc(~"100vh" - @top-height);
      overflow: auto;
      padding-bottom: 10px;
    }
  }
  &.preview {
    background: #fff;
    .left {
      width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      > .add-panel {
        min-width: 780px;
      }
      .hide-border {
        min-width: 800px;
      }
    }
    &.over {
      .left {
        overflow: auto;
      }
    }
    .hide-border {
      margin: -10px;
    }
    .right {
      transform: translateX(@right-width);
    }
    .add-panel {
      display: none;
    }
    .actions-btn {
      display: none;
    }
    .drag-handle {
      background: transparent !important;
    }
    .tab-title,
    .drag-handle > span,
    .search-title {
      border-bottom: 1px solid #d9d9d9;
    }
    .grid-item {
      box-shadow: none !important;
    }

    .vue-resizable-handle {
      display: none;
    }
    // 标签提示
    &.visual .custom-tips {
      display: flex;
      position: absolute;
      top: 42px;
      right: -5px;
      z-index: 11111;
    }
    &.visual .custom-tips.noTitle {
      top: 3px;
    }
    // 标签的高度
    // .label-wrapper{
    //   // height: 100%;
    // }
  }
  &.name {
    .left {
      margin-top: 0;
      height: 100%;
    }
  }
  &.visual {
    .left {
      margin-top: 0;
      height: 100%;
    }
  }
}
.vue-grid-item.vue-draggable-dragging {
  z-index: 15;
}
.vue-grid-item.vue-grid-placeholder {
  z-index: 10;
}
</style>
