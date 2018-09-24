<template>
  <el-collapse v-model="activeName" accordion  @change="handleCollapseChange">
    <el-collapse-item name="1" class="data-picker my-collapse">
      <template slot="title">
        <span class="data-set-title"><span class="el-icon-caret-top triangle"></span><span style="margin-left:8px">数据集</span></span>
   <!--      <i class="el-icon-edit" style="float:right;margin-top: 15px;
      margin-right: 18px;" @click.stop="$store.commit('toggleMetricDialog', true)"></i> -->
     <img src="/static/charts/images/edit.svg" alt=""  style="cursor:pointer; float:right;margin-top: 15px;
      margin-right: 18px; width:12px;height:12px "  @click.stop="$store.commit('toggleMetricDialog', true)">

      </template>
      <div class="data-limit-height my-slide-bar" @click="cancelPopover">
        <el-collapse v-model="activeCollapse" accordion>
          <el-collapse-item name="1">
            <template slot="title">
              <div class="p-index">
                <dot></dot>
                <span class="second-title">数据指标</span>
              </div>
            </template>
            <div class="my-slide-bar limit-height">
              <div class="metrics-selected-wrapper">
                <div  v-for="(item, metricIndex) in selectedOption.feature.metricList" :key="item.metricCode" class="div-data-item">   
                  <img :src="getMetricIcon(item.sdFlag)" alt="" :style="getMetricStyle(item.sdFlag)">
                  <p :data-id="item.metricCode" :title="item.metricName" class="data-item select">
                  <span @click="toggleSelect(item.metricCode, metricIndex)">{{item.metricName}}</span>
                  <metric-property v-if="supportMetricFeature" :ref="'metricProperty_'+metricIndex" :index="index" :metricIndex="metricIndex"></metric-property>
                </p>
                </div> 
              </div>
              <div>
                <div v-for="(item, index) in dataSetRest" :key="index" class="div-data-item">
                  <img :src="getMetricIcon(item.sdFlag)" alt="" :style="getMetricStyle(item.sdFlag)">
                  <p class="data-item" :title="item.metricName" @click="toggleSelect(item.metricCode)">
                    {{item.metricName}}
                  </p>
                </div>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <div class="dim p-index">
                <dot></dot>
                <span class="second-title">数据维度</span>
              </div>
            </template>
            <div style="margin-top: 6px;">
              <el-input size="mini" v-model="dimFilter" suffix-icon="el-icon-search" class="search" placeholder="搜索维度"></el-input>
            </div>
            <div class="my-slide-bar limit-height2">
              <div class="dims-selected-wrapper data-index">
                <div class="div-data-item" v-for="(item, index) in selectedOption.feature.dimList" :key="item.dimCode">
                   <img :src="getDimIcon(item.isCustom)" alt="" :style="getDimStyle(item.isCustom)" v-if="item.dimName.includes(dimFilter)">
                   <p v-if="item.dimName.includes(dimFilter)" :data-id="item.dimCode" class="data-item select " @click="cancelDim(index, item.dimCode)">
                  {{item.dimName}}
                  </p>
                </div>
              </div>
              <div class="data-index">
                <div class="div-data-item"  v-for="(item, index) in crossDimListRest" :key="index">
                   <img :src="getDimIcon(item.isCustom)" alt="" :style="getDimStyle(item.isCustom)" v-if="item.dimName.includes(dimFilter)">
                    <p v-if="item.dimName.includes(dimFilter)" class="data-item" @click="addDim(item)">
                  {{item.dimName}}
                </p>
                </div>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title">
              <div class="p-index">
                <dot></dot>
                <span class="second-title">过滤器</span>
              </div>
            </template>
            <div class="my-slide-bar limit-height3">
              <percolator :index="index"></percolator>
            </div>
          </el-collapse-item>
          <el-collapse-item name="4">
            <template slot="title">
              <div class="p-index">
                <dot></dot>
                <span class="second-title">时间范围</span>
              </div>
            </template>
            <div class="data-picker-time">
              <tig-date-picker v-model="date" :type.sync="dateType" :minDateTypeCode="minDateTypeCode" @change="timeTypeChange"></tig-date-picker>
            </div>
          </el-collapse-item>
          <el-collapse-item name="5">
            <template slot="title">
              <div class="p-index">
                <dot></dot>
                <span class="second-title">排序</span>
              </div>
            </template>
            <div class="data-picker-sort">
              <el-switch
                v-model="sortByWhich"
                active-text="按指标"
                inactive-text="按维度">
              </el-switch>
              <el-radio-group v-model="sortTypeValue">
                <el-radio :label="1">降序</el-radio>
                <el-radio :label="0">升序</el-radio>
                <el-radio :label="2">无</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>
          <el-collapse-item name="6">
            <template slot="title">
              <div class="p-index">
                <dot></dot>
                <span class="second-title">预览行数</span>
              </div>
            </template>
            <div class="data-picker-limit">
              <el-input-number size="mini" v-model="limitNum" controls-position="right" :min="1" :max="50000"></el-input-number>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-button :type="updateBtnActive?'warning':''" size="mini" @click="update()" style="width: 200px;margin: 10px 1px 10px 10px;">更新</el-button>
      </div>
    </el-collapse-item>
    <el-collapse-item name="2" class="data-picker-advanced my-collapse">
      <template slot="title">
        <span class="data-set-title"><span class="el-icon-caret-top triangle"></span><span style="margin-left:8px">高级</span></span>
      </template>
      <!-- 右侧控制 高级-图表关联 -->
      <advanced></advanced>
      <!-- 右侧控制 高级-Tab绑定 -->
      <tabControl></tabControl>
      <!-- 右侧控制 高级-告警 -->
      <warning></warning>
      <data-config></data-config>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import Sortable from "sortablejs";
import {
  getCrossDimList,
  dateTypeMap,
  getInShowContainers,
  quarterToDay
} from "../../../../utils/utils";
import bus from "../../../../utils/eventBus";
import search from "../../../../../../api/search";
import tigDatePicker from "./tigDatePicker";
import advanced from "./advanced.vue";
import tabControl from "./tabControl.vue";
import warning from "./warning.vue";
import dataConfig from "./configMoreData";
import dot from "./dot";
import chartTypeMixin from "../../../mixins/chartTypeMixin";
import debounce from "lodash.debounce";
import moment from "moment";
import sortTypeMixin from "./dataPickerMixins/sortType";
import metricProperty from "./dataPickerMixins/metricProperty";
import { everyMetricHasFeature } from "../../../../utils/validationBySave";
import percolator from "./dataPickerMixins/dataFilters/index";
import { constantWrapper } from "../../../../static/configData";

export default {
  name: "DataPicker",
  data() {
    return {
      activeName: "1",
      date: [], // 选中的时间范围
      dateType: "date", // 日历的类型,天，月，年 date,month,year
      limitNum: constantWrapper.LIMIT_NUM, // 预览行数,
      dimFilter: "", // 维度过滤
      activeCollapse: "1"
    };
  },
  components: {
    tigDatePicker,
    advanced,
    dot,
    tabControl,
    warning,
    dataConfig,
    metricProperty,
    percolator
  },
  computed: {
    // 选中容器的index
    index() {
      return this.selectedOption.i;
    },
    // 选中的容器
    selectedOption() {
      return (
        this.$store.state.charts.chartsOption &&
        this.$store.state.charts.chartsOption.filter(
          item => !item.drop && item.selected
        )[0]
      );
    },
    // 剩余指标
    dataSetRest() {
      return this.$store.state.charts.dataSet.filter(
        item =>
          !this.selectedOption.feature.metricList.some(
            each => each.metricCode === item.metricCode
          )
      );
    },
    // 交叉维度
    crossDimList() {
      return getCrossDimList(
        this.$store.state.charts.dataSet,
        (this.selectedOption &&
          this.selectedOption.feature &&
          this.selectedOption.feature.metricList) ||
          []
      );
    },
    // 剩余维度
    crossDimListRest() {
      return (
        (this.crossDimList &&
          this.crossDimList.filter(
            item =>
              !this.selectedOption.feature.dimList.some(
                each => each.dimCode === item.dimCode
              )
          )) ||
        []
      );
    },
    // 选中指标的最大时间粒度，作为本容器的最小时间粒度
    minDateTypeCode() {
      return (
        this.selectedOption.feature.metricList
          .map(item => {
            return this.$store.state.charts.dataSet.filter(
              one => one.metricCode === item.metricCode
            )[0].timeGranularity;
          })
          .sort((a, b) => {
            if (a[a.length - 1] < b[b.length - 1]) return 1;
          })[0] || "TG_00000003"
      );
    }
  },
  mixins: [search, chartTypeMixin, sortTypeMixin],
  watch: {
    index() {
      this.init();
    },
    // watch crossDimList的变化，检验交叉维度是否还继续包含关联容器(主动者)的维度
    // 继续包含时，不作操作
    // 不再包含时，关联容器(主动者)删除联动关系
    crossDimList: {
      handler: function(newVal, oldVal) {
        const newValStr = newVal.map(i => i.dimCode).join();
        const oldValStr = oldVal.map(i => i.dimCode).join();
        if (newValStr !== oldValStr) {
          // 场景一：图表联动
          this.$store.commit("relationChangeByMetric", {
            index: this.index,
            newValStr
          });
          // 场景二：数据关系的维度过滤器
          this.$store.commit("deleteDimFilterByCrossDimChange", {
            index: this.index,
            newCrossDimList: newValStr
          });
        }
      },
      deep: true
    }
  },
  created() {
    // 设置指标维度的显示高度
    this.$nextTick(() => {
      this.dataLimitHeight();
    });
    window.addEventListener("resize", debounce(this.dataLimitHeight, 200));
  },
  mounted() {
    // 将元素设置可拖拽
    this.metricsSortable();
    this.dimsSortable();
    this.init();
  },
  methods: {
    // 一些数值的初始化
    init() {
      this.limitNum = this.selectedOption.limitNum || this.limitNum;
      this.dateType = dateTypeMap(this.selectedOption.timeQueryCycle);
      this.date = this.selectedOption.nearUpdateTime;
      !this.date.length && this.timeDefault();
      if (this.dateType === "week") {
        this.date = [
          new Date(moment(this.date[0]).format()),
          new Date(
            moment(this.date[1])
              .subtract(6, "days")
              .format()
          )
        ];
      }
      // 日期格式的转换成季度的字符串
      if (this.dateType === 'quarter') {
        let startTime = this.date[0]
        let endTime = this.date[1]
        // 这里为了兼容旧报表，加了一个判断日期格式是否正确，若本身就是季度的字符串则不必转换
        // if(startTime && startTime.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
           this.date = [this.getQuarterString(startTime), this.getQuarterString(endTime)]
        // }
      }
    },
    // 为数据指标添加图标
    getMetricIcon(sdFlag) {
      let url = "";
      switch (sdFlag) {
        case "0":
          url = "/static/charts/images/collectMetric.svg";
          break;
        case "1":
          url = "/static/charts/images/detailMetric.svg";
          break;
      }
      return url;
    },
    // 为区分指标图标添加样式
    getMetricStyle(sdFlag) {
      let width = "12.8px";
      let left = "6px";
      let height = "";
      let top = "";
      switch (sdFlag) {
        case "0":
          height = "11.5px";
          top = "6.75px";
          break;
        case "1":
          height = "12.8px";
          top = "5.6px";
          break;
      }
      return {
        width: width,
        height: height,
        left: left,
        top: top
      };
    },
    // 为数据维度添加图标
    getDimIcon(isCustom) {
      let url = "";
      switch (isCustom) {
        case 0:
          url = "/static/charts/images/unifyDim.svg";
          break;
        case 1:
          url = "/static/charts/images/customDim.svg";
          break;
      }
      return url;
    },
    // 为区分维度图标添加样式
    getDimStyle(isCustom) {
      let width = "";
      let height = "";
      let top = "";
      let left = "";
      switch (isCustom) {
        case 0:
          width = "12.5px";
          height = "14px";
          top = "4.6px";
          left = "5px";
          break;
        case 1:
          width = "14pxpx";
          height = "13px";
          top = "5px";
          left = "4px";
          break;
      }
      return {
        width: width,
        height: height,
        left: left,
        top: top
      };
    },
    // 为选中的容器挑选或取消指标
    // cancelIndex 取消时的index
    toggleSelect(metricCode, cancelIndex) {
      const index = this.selectedOption.i;
      this.$store.commit("toggleSelect", {
        index,
        metricCode,
        cancelIndex
      });
      // ‘更新’按钮的高亮状态toggle
      this.updateBtnActiveToggle(true);
      // 指标变换时需要对时间粒度判断
      const a = this.minDateTypeCode.slice(-1);
      const b = dateTypeMap(this.dateType).slice(-1);
      if (a - b > 0) {
        this.dateType = dateTypeMap(this.minDateTypeCode);
        this.date = [];
      }
      this.$store.commit("syncTimeQueryCycle", {
        index,
        value: dateTypeMap(this.dateType)
      });
      // 如果没选时间，置为默认时间,分别为前一天，前一月，前一年
      this.timeDefault();
      // 指标改变，将metricList复制一份，扁平化，将所有指标的属性伪装成指标
      this.$store.commit("metricListFlat", { index });
    },
    // 为容器选择维度
    addDim({ dimCode, dimName, dimType, isCustom }) {
      this.$store.commit("addDim", {
        index: this.selectedOption.i,
        dimCode,
        dimName,
        dimType,
        isCustom
      });
      // ‘更新’按钮的高亮状态toggle
      this.updateBtnActiveToggle(true);
    },
    // 为容器取消选择维度
    cancelDim(dimIndex, dimCode) {
      this.$store.commit("cancelDim", {
        index: this.selectedOption.i,
        dimIndex
      });
      // 删除图表联动关系
      this.$store.commit("relationChangeByDim", {
        index: this.selectedOption.i,
        dimCode
      });
      // ‘更新’按钮的高亮状态toggle
      this.updateBtnActiveToggle(true);
    },
    // 已选的指标的排序
    metricsSortable() {
      const _this = this;
      const metricsWrapper = document.querySelector(
        ".metrics-selected-wrapper"
      );
      if (!metricsWrapper) return;
      Sortable.create(metricsWrapper, {
        onUpdate() {
          const items = document.querySelectorAll(
            ".metrics-selected-wrapper .data-item"
          );
          const sortList = Array.from(items, item => item.dataset.id);
          _this.$store.commit("sortMetricsOrDim", {
            index: _this.selectedOption.i,
            sortList,
            type: 1
          });
        }
      });
    },
    // 已选的维度的排序
    dimsSortable() {
      const _this = this;
      const dimsWrapper = document.querySelector(".dims-selected-wrapper");
      if (!dimsWrapper) return;
      Sortable.create(dimsWrapper, {
        onUpdate() {
          const items = document.querySelectorAll(
            ".dims-selected-wrapper .data-item"
          );
          const sortList = Array.from(items, item => item.dataset.id);
          _this.$store.commit("sortMetricsOrDim", {
            index: _this.selectedOption.i,
            sortList,
            type: 2
          });
        }
      });
    },
    // 点击更新按钮
    update: debounce(function() {
      this.updateInner();
    }, 300),
    async updateInner() {
      // 查询数据前，验证下时间
      if (!this.dateValidation()) {
        this.$message({
          message: "查询时间非法",
          type: "warning"
        });
        return;
      }
      // 查询数据前，是否选了指标
      if (!this.selectedOption.feature.metricList.length) {
        this.$message({
          message: "缺少指标",
          type: "info"
        });
        return;
      }
      // 查询前，是否所有指标都至少选择了一个属性
      if (!everyMetricHasFeature(this.selectedOption.feature.metricList)) {
        this.$message({
          message: "选中的指标至少有一个属性被勾选",
          type: "info"
        });
        return;
      }
      // 当前选中的指标和数据是否适合当前图表样式，不适合的话，切换成表格
      this.dataSetChangeHandle();
      let rateType = 0; // 默认是同期值
      let compareType = 0;
      let loadingFalse = true; // 请求完数据，是否需要关闭loading,默认关闭
      const chartId = this.selectedOption.feature.chartId;
      // 饼图,柱状图，折线图不需要自动关闭loading
      const chartIdArr = [0, 1, 4, 5];
      if (chartIdArr.includes(chartId)) {
        loadingFalse = false;
      }
      const index = this.selectedOption.i;
      let time = [this.date[0], this.date[1]];
      // 如果是周的粒度，将时间处理下
      if (dateTypeMap(this.dateType) === "TG_00000007") {
        const formatStr = "YYYY-MM-DD";
        time = [
          moment(time[0]).format(formatStr),
          moment(time[1])
            .add(6, "days")
            .format(formatStr)
        ];
      }
      // 如果是季的粒度，将时间处理成日期范围
      if (dateTypeMap(this.dateType) === "TG_00000008") {
        let startTime = this.transformQuarterToDay(time[0])[0]
        let endTime = this.transformQuarterToDay(time[1])[1]
        time = [startTime, endTime]
      }
      this.$store.commit("syncUpdateTime", {
        index,
        time
      });
      this.$store.commit("syncLimitNum", {
        index,
        limitNum: this.limitNum
      });
      this.$store.commit("syncTimeQueryCycle", {
        index,
        value: dateTypeMap(this.dateType)
      });
      const data = await this.updateDataPre({
        index,
        rateType,
        compareType,
        loadingFalse
      });
      this.$store.commit("syncData", {
        index,
        data
      });
      this.$nextTick(() => {
        bus.$emit(`updateData_${index}`, {
          index,
          data: data,
          error: !data // 查询是否失败
        });
      });
      // ‘更新’按钮的高亮状态toggle
      this.updateBtnActiveToggle(false);
    },
    // 验证时间
    dateValidation() {
      const startTime = this.date[0];
      const endTime = this.date[1];
      if (!startTime || !endTime) return false;
      if (startTime > endTime) return false;
      return true;
    },
    // 时间粒度的change
    timeTypeChange() {
      this.timeDefault();
      // 时间粒度change后，需要高亮‘更新’按钮
      this.updateBtnActiveToggle(true);
    },
    // 默认时间的添加
    timeDefault() {
      if (this.date.length !== 2) {
        let time = "";
        if (this.dateType === "datetime-hour") {
          time = moment()
            .subtract(1, "days")
            .format("YYYY-MM-DD");
          time += "-00";
        }
        if (this.dateType === "date") {
          time = moment()
            .subtract(1, "days")
            .format("YYYY-MM-DD");
        }
        if (this.dateType === "week") {
          time = new Date(
            moment()
              .day("monday")
              .subtract(7, "days")
              .format()
          );
        }
        if (this.dateType === "month") {
          time = moment()
            .subtract(1, "months")
            .format("YYYY-MM");
        }
        if (this.dateType === "quarter") {
          const lastQuarter = moment().subtract(1, "quarters"); // 上季度
          time = `${lastQuarter.year()} 第 ${lastQuarter.quarter()} 季度`;
        }
        if (this.dateType === "year") {
          time = moment()
            .subtract(1, "years")
            .format("YYYY");
        }
        this.date = [time, time];
      }
    },
    // 计算指标维度需要显示的高度
    dataLimitHeight() {
      const div = document.querySelector(".data-limit-height");
      let height = 348;
      if (div) {
        height = window.innerHeight - div.getBoundingClientRect().top - 58;
        div.style.height = `${height}px`;
      }
    },
    handleCollapseChange(e) {
      this.cancelPopover();
      if (e === "1") {
        this.$nextTick(() => {
          this.dataLimitHeight();
        });
      }
    },
    // 点击空白区域，将指标的popover关闭
    cancelPopover() {
      const theFirstMetricProperty =
        this.$refs["metricProperty_0"] && this.$refs["metricProperty_0"][0];
      if (theFirstMetricProperty) {
        theFirstMetricProperty.handleShow(true);
      }
    },
    // 季度时间转换成季度字符
    getQuarterString (string) {
      let date = new Date(string)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let quarter = 1
      if (month >= 1 && month <= 3) {
        quarter = 1
      } else if ( month >= 4 && month <= 6) {
        quarter = 2
      } else if (month >= 7 && month <= 9) {
        quarter = 3
      } else if (month >= 10 && month <= 12) {
        quarter = 4
      }
      return `${year} 第 ${quarter} 季度`
    },
    // 季度字符串转化为月份
    transformQuarterToDay (string) {
      let re = new RegExp(/^[0-9]+ 第 [1-4]+ 季度$/g)
      if (!re.test(string)) {
        return []
      }
      let year = string.match(/^[0-9]+/g)[0]      // 从季度字符串中拿到年
      let quarter = parseInt(string.match(/ [1-4]+ /g)[0]) // 从季度字符串中拿到季度
      let startTime
      let endTime
      switch(quarter) {
        case 1 :
          startTime = `${year}-01-01`
          endTime = `${year}-03-31`
          break;
        case 2:
          startTime = `${year}-04-01`
          endTime = `${year}-06-30`
          break;
        case 3:
          startTime = `${year}-07-01`
          endTime = `${year}-09-30`
          break;
        case 4:
          startTime = `${year}-10-01`
          endTime = `${year}-12-31`
          break;        
      }
      return [startTime, endTime]
    }
  }
};
</script>

<style lang="less">
@base-bg-color: rgb(241, 243, 245);
@select-bg-color: rgb(229, 241, 255);
@select-color: rgb(81, 168, 255);
@border-color: #dbdddf;
@data-item-height: 24px;

.limit-height {
  max-height: calc(100vh - 490px);
  overflow: auto;
  margin-right: 5px;
  padding-right: 5px;
  margin-top: 5px;
  // margin-left: 22px;
}
.limit-height2 {
  max-height: calc(100vh - 523px);
  // padding-left: 22px;
  overflow: auto;
  margin-right: 5px;
}
.limit-height3 {
  max-height: calc(100vh - 490px);
  padding-left: 22px;
  overflow: auto;
  margin-right: 5px;
  padding-right: 8px;
}
.percolator{
  .el-tabs__nav{
    width: 100%;
    border-left: none!important;
    border-right: none!important;
    > .el-tabs__item{
      width: 50%;
      color: #666;
      background: #fff;
    }
  }
}
.data-index {
  .div-data-item {
    p:first-of-type {
      margin-top: 5px;
    }
  }
}
.div-data-item {
  padding-left: 22px;
  position: relative;
  >img {
    position: absolute;
    cursor:move;
  }
}
.data-item {
  width: 180px;
  height: @data-item-height;
  line-height: @data-item-height;
  background: @base-bg-color;
  padding-left: 8px;
  margin-bottom: 6px;
  border-radius: 3px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &.select {
    > span:first-child {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 80%;
    }
    display: flex;
    justify-content: space-between;
    background: @select-bg-color;
    color: @select-color;
    border: 1px solid @select-color;
  }
}
.focus-item {
  .el-icon-arrow-right:before {
    content: "";
  }
}
.data-picker {
  border-bottom: 1px solid #ebeef5;

  /*  .el-icon-edit{
      float: right;

    }*/
  .el-collapse-item__header {
    height: 40px;
    border: none;
    line-height: 40px;
  }
  .el-collapse-item__wrap .el-collapse-item__header {
    &:extend(.el-collapse-item__header);
    padding-left: 10px;
    font-weight: normal;
    &:hover {
      background-color: #e5f1ff;
      span {
        color: #51a8ff;
      }
    }
    .second-title {
      color: #666;
    }
    p {
      height: 40px;
      line-height: 40px;
    }
  }
  .el-button--warning {
    background-color: #51a6ff;
    border-color: #51a6ff;
  }
  .el-button {
    font-size: 14px;
    font-weight: normal;
  }
  .search {
    .el-input__inner {
      height: 32px !important;
      width: 180px !important;
      margin-left: 22px;
    }
    .el-input__suffix {
      right: 15px;
    }
  }
  .el-icon-arrow-right:before {
    content: "";
  }
  .el-icon-search:before {
    content: "\E619";
    margin-right: 10px;
  }
  .el-collapse-item__content {
    color: #666;
    .el-radio__label {
      padding-left: 6px;
      font-weight: normal;
    }
    .el-button-group {
      display: flex;
      margin-bottom: 10px;
    }
    > div.data-limit-height {
      overflow-x: hidden;
      overflow-y: auto;
      height: auto !important;
      > p.p-index {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #666;
        padding-top: 11px;
        padding-bottom: 5px;
        &.dim {
          position: relative;
          > span {
            display: flex;
            justify-content: space-between;
            span {
              white-space: nowrap;
            }
            div.el-input {
              margin: 0 5px;
              height: @data-item-height;
              line-height: @data-item-height;
            }
          }
        }
        &.dim:before {
          content: "";
          position: absolute;
          height: 1px;
          width: 92%;
          background: @border-color;
          top: 6px;
          left: 14px;
        }
      }
    }
  }
  .el-collapse-item__wrap {
    border: none;
    > div {
      padding-bottom: 10px;
      // border-top: 1px solid @border-color;
    }
  }
}
.data-set-title {
  padding-left: 6px;
  font-size: 14px;
  color: #333;
  font-weight: bold;
  .triangle {
    background: #ffffff;
    color: #d3d6d8;
    font-size: 14px;
  }
}
.data-picker-limit {
  .el-input-number--mini {
    width: 180px;
    height: 32px;
    line-height: 32px;
    .el-input-number__decrease {
      bottom: 4px;
    }
    .el-input-number__increase {
      top: 2px;
    }
  }
}
.data-picker-time,
.data-picker-limit,
.data-picker-sort {
  margin-left: 22px;
  .input-pre {
    .el-input__inner {
      margin-left: 10px;
      padding-right: 40px;
    }

    .el-input-number__increase {
      left: 69px;
    }
    .el-input-number__decrease {
      left: 69px;
    }
  }
  margin-top: 5px;
  padding-right: 14px;
  > p {
    .el-input-number--mini {
      width: 88px;
      margin-left: 30px;
    }
    font-size: 14px;
    color: #666;
    position: relative;
    padding-top: 8px;
    padding-bottom: 5px;
    display: flex;
    align-items: center;
    &:before {
      content: "";
      position: absolute;
      height: 1px;
      width: 99%;
      background: @border-color;
      top: 5px;
      left: 14px;
    }
  }
}
.data-picker-sort {
  > div {
    display: flex;
    justify-content: flex-start;
    .el-switch__core {
      height: 16px;
      &:after,
      span {
        height: 14px;
        top: 0;
      }
    }
    .el-switch__label {
      font-weight: normal;
    }
    .el-switch__label--left {
      margin-right: 14px;
    }
    .el-switch__label--right {
      margin-left: 14px;
    }
    > .el-radio + .el-radio {
      margin-left: 20px;
    }
    &.el-switch {
      margin-bottom: 16px;
      // margin-left:16px;
    }
  }
}
.data-picker-advanced {
  > div {
    border-bottom: 1px solid #ebeef5;
    > .el-collapse-item__header {
      border-bottom: none;
    }
  }
}
</style>
