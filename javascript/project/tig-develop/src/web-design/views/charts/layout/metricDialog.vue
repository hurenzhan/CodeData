<template>
  <el-dialog
    @click.native.stop
    class="metric-dialog"
    :visible="value"
    :width="width"
    top="9vh"
    :show-close="false">
    <div slot="title" class="metric-dialog-title">
      <span class="metric-dialog-title-name">
        <span>新建工作表</span>
        <span>*请给工作表命名，并选择数据指标</span>
      </span>
      <span v-if="!reEdit">
        <el-button size="mini" @click="$router.push('/tableCharts')" style="font-size: 14px;font-weight: normal;">返回</el-button>
        <el-button type="primary" size="mini" @click="create" style="margin-left:5px; font-size: 14px;font-weight: normal;">创建</el-button>
      </span>
      <span v-else>
        <el-button size="mini" style="font-weight: normal; font-size: 14px;" @click="$store.commit('toggleMetricDialog', false)">取消</el-button>
        <el-button type="primary" size="mini" style="font-size: 14px; font-weight: normal; padding:0px;margin-left: 5px" @click="create" >保存修改</el-button>
      </span>
    </div>
    <div class="metric-dialog-content">
      <p class="metric-dialog-content-name">
        <span>工作表名称</span>
        <el-input size="mini" class="table-name-input" :maxlength="30" placeholder="请输入" v-model="name"></el-input>
      </p>
      <div class="metric-wrapper">
        <div class="actions">
          <span class="dataSet">数据集</span>
          <div>
             <el-select size="mini" clearable placeholder="指标类型" v-model="typeSelected" @change="typeChange" class="backgroundSelect" >
              <el-option
                v-for="item in sdFlagType"
                :key="item.id"
                :label="item.label"
                :value="item.sdFlag"> 
                <span style="position:relative;padding-left:7px">
                  <img :src="getIcon(item.sdFlag)"  :style="getMetricStyle(item.sdFlag)" alt="">
                  {{ item.label }}</span>
              </el-option>
            </el-select>
            <el-select size="mini" clearable placeholder="业务域" v-model="domainSelected" @change="domainChange" class="backgroundSelect" >
              <el-option
                v-for="item in domainList"
                :key="item.valueId"
                :label="item.name"
                :value="item.valueId">
              </el-option>
            </el-select>
            <el-select size="mini" clearable placeholder="主题" v-model="subjectSelected" @change="subjectChange" class="backgroundSelect">
              <el-option
                v-for="item in subjectList"
                :key="item.subCode"
                :label="item.subName"
                :value="item.subCode">
              </el-option>
            </el-select>
            <el-input style="width: 160px;" size="mini" placeholder="ID/指标名称" suffix-icon="el-icon-search" v-model="keyword" @change="keywordChange" @keyup.enter.native="keywordNotChange"></el-input>
          </div>
        </div>
        <div class="result-show " :class="{hidden: !metricsSelected.length}">
          <el-collapse>
            <el-collapse-item class="metric-dialog-collapse">
              <template slot="title">
                <div class="selected-items-left">
                  <i class="el-icon-info"></i>
                  已选择
                  <span>{{metricsSelected.length}}</span>
                  项
                </div>
                <div class="selected-items-right">
                  详情
                  <span class="el-icon-caret-top triangle"></span>
                </div>
              </template>
               <div class="my-slide-bar">
                  <span v-for="item in metricsSelected" :key="item.metricCode">
                    {{item.metricName}}
                    <i class="el-icon-close" v-if="selectableCallback(item)" @click="deleteOneMetric(item.metricCode)"></i>
                  </span>
                </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <el-table
          header-row-class-name="metric-header"
          ref="metricsTable"
          @select="handleSelect"
          @select-all="handleSelectAll"
          :data="metrics"
          :class="{'active-table': metricsSelected.length}">
          <el-table-column type="selection" width="55" :selectable="selectableCallback"></el-table-column>
          <el-table-column
            label="ID/指标名称"
            width="300">
            <template slot-scope="scope">
              <div class="metric-code">{{ scope.row.metricCode }}</div>
              <div class="metric-name" :title="scope.row.metricName">{{ scope.row.metricName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="业务域">
            <template slot-scope="scope">
              <div>{{ scope.row.businessDomainName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="主题">
            <template slot-scope="scope">
              <div>{{ scope.row.subjectName }}</div>
            </template>
          </el-table-column>
        </el-table>
        <p class="metric-dialog-pagination">
          <span class="total">总共{{this.total}}条</span>
          <el-button @click="prePage" icon="el-icon-arrow-left" :disabled="disablePre"></el-button>
          <!-- <span class="arrow arrow-left" @click="prePage"></span> -->
          <input v-model.lazy="currentPage" class="currentPage" @keyup.enter="currentPageEnterHandle($event)" />
          <span class="metric-dialog-pagination-separator">/</span>
          <span class="totalPages">{{this.totalPages}}</span>
          <!-- <span class="arrow arrow-right" style="margin-right: 0px" @click="nextPage"></span> -->
          <el-button @click="nextPage" :disabled="disableNext"><i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </p>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import api from "../../../api/charts";
import searchMixin from "./mixins/metricDialogMixin";
import { getMetricsUsed, isName } from "../utils/utils";

export default {
  name: "MetricDialog",
  mixins: [searchMixin],
  props: ["value"],
  data() {
    return {
      reEdit: false, // 重选指标
      width: "740px", // 弹窗宽度
      metrics: [], // 指标列表
      metricsSelected: [], // 选中的指标
      total: "", // 总数
      offset: 0, // 数量位移
      limit: 6, // 每页个数
      disablePre: false, // 禁用前翻按钮
      disableNext: false, // 禁用后翻按钮
      valueNoChange:true  //判断指标名称输入框值是否改变
    };
  },
  computed: {
    // 总页数
    totalPages() {
      return Math.ceil(this.total / this.limit);
    },
    // 当前页码
    currentPage: {
      get() {
        return this.offset / this.limit + 1;
      },
      set(val) {
        val = Number(val);
        if (Number.isInteger(val) && val >= 1 && val <= this.totalPages) {
          this.offset = this.limit * (val - 1);
          this.getMetrics(this.offset);
        } else {
          // 输入的页码不正确时，在这里写逻辑，现在简单的跳转到第一页
          this.goFirstPage();
        }
      }
    }
  },
  watch: {
    value(value) {
      if (value) {
        this.metricsSelected = this.$store.state.charts.dataSet.slice(); // 页面加载后，将vuex的dataSet复制给metricsSelected
        this.getMetrics();
        // 切换reEdit
        this.reEdit = !!this.$store.state.charts.dataSet.length;
      }
    }
  },
  mounted() {
    this.getMetrics();
  },
  methods: {
    // 点击创建按钮
    create() {
      if (!this.metricsSelected.length) {
        this.$message("请选择指标");
        return;
      }
      if (!isName(this.name)) {
        this.$message("名称不符合");
        return;
      }
      this.$store.commit("syncDataSet", this.metricsSelected);
      this.$store.commit("toggleMetricDialog", false);
      // 新建报表时，默认添加一个图表的容器
      !this.reEdit && this.$store.commit("addContainer", { id: 0 });
    },
    // 获取指标查询方法,并过滤不必要字段
    async getMetrics(
      offset = this.offset,
      limit = this.limit,
      businessDomain = this.domainSelected,
      subject = this.subjectSelected,
      searchKey = this.keyword,
      sdFlag = this.typeSelected
    ) {
      let res = await api.getMetrics({
        limit,
        offset,
        businessDomain,
        subject,
        searchKey,
        sdFlag
      });
      this.total = res ? res.total : 0;
      if (res !== undefined && res.total === 0) {
        this.metrics = [];
        return;
      }
      this.metrics =
        res &&
        res.data.map(
          ({
            metricName,
            metricsCode,
            permissionDimention,
            timeGranularityName,
            timeGranularity,
            businessDomainName,
            subjectName,
            sdFlag,
            mulUnits
          }) => {
            return {
              metricName,
              metricCode: metricsCode,
              timeGranularity,
              timeGranularityName,
              businessDomainName,
              subjectName,
              sdFlag,
              mulUnits,
              dimList: permissionDimention
                .map(({ dimCode, dimName, dimType }) => ({
                  dimCode,
                  dimName,
                  dimType
                }))
                .filter(item => item.dimCode && item.dimName)
            };
          }
        );
      this.$nextTick(() => {
        this.pageChange();
      });
    },
    // 手动删除一条选中的指标
    deleteOneMetric(metricCode) {
      // step1: 删掉vuex上的数据
      const existFlag = this.metricInMetricsSelected(
        metricCode,
        this.metricsSelected
      );
      this.metricsSelected.splice(existFlag, 1);
      // step2: 取消checkbox的选中
      const item = this.metrics[
        this.metricInMetricsSelected(metricCode, this.metrics)
      ];
      this.$refs.metricsTable.toggleRowSelection(item, false);
    },
    // 单选(用户点击)
    handleSelect(selection, row) {
      const existFlag = this.metricInMetricsSelected(
        row.metricCode,
        this.metricsSelected
      );
      if (existFlag === false) {
        this.metricsSelected.push(row);
      } else {
        this.metricsSelected.splice(existFlag, 1);
      }
    },
    // 全选(用户点击)
    handleSelectAll(selection) {
      if (selection.length === this.metrics.length) {
        // 当前页全选
        this.metrics.forEach(item => {
          if (
            this.metricInMetricsSelected(
              item.metricCode,
              this.metricsSelected
            ) === false
          ) {
            this.metricsSelected.push(item);
          }
        });
      } else {
        // 取消当前页全选
        this.metrics.forEach(item => {
          const tmpIndex = this.metricInMetricsSelected(
            item.metricCode,
            this.metricsSelected
          );
          if (tmpIndex !== false && this.selectableCallback(item)) {
            this.metricsSelected.splice(tmpIndex, 1);
          }
        });
      }
    },
    // 上一页
    async prePage() {
      if (this.currentPage === 1) return;
      this.offset -= this.limit;
      this.disablePre = true;
      await this.getMetrics();
      this.disablePre = false;
    },
    // 下一页
    async nextPage() {
      if (this.currentPage === this.totalPages) return;
      this.offset += this.limit;
      this.disableNext = true;
      await this.getMetrics();
      this.disableNext = false;
    },
    // 翻页后，需要重新勾选已经选中的指标
    pageChange() {
      this.metrics = this.metrics || []
      this.metrics.forEach((item, index) => {
        if (
          this.metricInMetricsSelected(
            item.metricCode,
            this.metricsSelected
          ) !== false
        ) {
          this.$refs.metricsTable.toggleRowSelection(item, true);
        }
      });
    },
    //用于改变查询条件后 清掉原offset
    goFirstPage() {
      // 先1后0的原因： 避免vue对offset进行懒加载处理
      setTimeout(() => {
        this.offset = 1;
        this.offset = 0;
        this.getMetrics(this.offset);
      }, 80);
    },
    // 当前页输入框的enter
    currentPageEnterHandle({ target }) {
      target.blur();
    },
    // 以下是工具函数
    /**
     * 指标的CheckBox是否可点击，取决于这个指标有没有被使用
     */
    selectableCallback(row, index) {
      return !getMetricsUsed(this.$store.state.charts.chartsOption).includes(
        row.metricCode
      );
    },
    /**
     * 判断一个指标在不在选中的指标集合里
     * @param {String} metricCode
     * @param {Array} metricsSelected
     * @return {} 不在:false  在:index
     */
    metricInMetricsSelected(metricCode, metricsSelected) {
      let result = false;
      for (let i = 0; i < metricsSelected.length; i++) {
        if (metricsSelected[i].metricCode === metricCode) {
          result = i;
          break;
        }
      }
      return result;
    },
    // 给不同指标添加不同图标
      getIcon(sdFlag) {
      let url = ''
      switch (sdFlag) {
        case '0': url = '/static/charts/images/collectMetric.svg'; break
        case '1': url = '/static/charts/images/detailMetric.svg'; break
      }
      return url
    },
    // 为区分指标图标添加样式
    getMetricStyle(sdFlag) {
      let width = "12.8px";
      let left = "-10px";
      let height = "";
      let top = "";
      let position = 'absolute'
      let verticalAlign = "middle";
      switch (sdFlag) {
        case "0":
          height = "11.5px";
          top = "2.75px";
          break;
        case "1":
          height = "12.8px";
          top = "1.6px";
          break;
      }
      return {
        width: width,
        height: height,
        left: left,
        top: top,
        position: position
        // "vertical-align": verticalAlign
      };
    }
  }
};
</script>

<style lang="less">
@defaultHeight: 32px;
.metric-dialog {
  > .el-dialog {
    transition: all 0.2s ease;
    .el-dialog__header {
      border-bottom: 1px solid #e6e6e6;
      padding-top: 8px;
      padding-bottom: 8px;
      padding-right: 24px;
      padding-left: 20px;
      height: 50px;
    }
    .el-dialog__body {
      padding-top: 10px;
      padding-left: 20px;
      padding-right: 24px;
    }
  }
  .metric-header th {
    background: #fafafa;
    padding: 7px 0;
    height: 40px;
  }
  .el-table {
    margin-top: -1px;
    top: -20px;
    &.active-table {
      margin-top: 32px;
    }
  }
}
.metric-dialog-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .metric-dialog-title-name {
    > span:first-child {
      color: #333;
      font-size: 16px;
      font-weight: bold;
    }
    > span:last-child {
      font-size: 12px;
      color: #ccc;
    }
  }
  > span {
    > button {
      height: 32px;
      width: 74px;
      border-radius: 4px;
    }
  }
}
.metric-dialog-content {
  .metric-dialog-content-name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
    .table-name-input {
      input {
        padding: 0 8px;
        color: #333;
        font-size: 14px;
      }
    }
    > span {
      white-space: nowrap;
      margin-right: 10px;
      font-size: 14px;
      color: #333;
    }
    > div.el-input {
      > input {
        height: @defaultHeight;
      }
    }
  }
}
.metric-wrapper {
  > .actions {
    margin-top: 24px;
    display: flex;
    position: relative;
    justify-content: space-between;
    // .backgroundSelect{
    //   // .el-input__inner{
    //   //   /*background: #FAFAFA;
    //   //   color: #333;*/
    //   // }
    // }
    > span.dataSet {
      position: absolute;
      top: 15px;
      color: #333;
    }
    > span {
      font-weight: bold;
    }
    > div {
      display: flex;
      margin-left: 70px;
      > div {
        width: 146px;
        margin-left: 8px;
        &.el-input {
          > input {
            height: @defaultHeight;
          }
        }
        > div.el-input {
          > input {
            height: @defaultHeight;
          }
        }
      }
    }
  }
  .result-show {
    transition: all 0.2s ease;
    min-height: 32px;
    opacity: 1;
    transform: scaleY(1);
    position: relative;
    width: 700px;
    z-index: 11;
    .el-collapse {
      border: none;
    }
    .metricsSelectedc {
      height: 100px;
    }
    .metric-dialog-collapse.is-active .triangle {
      transform: rotate(180deg);
    }
    .metric-dialog-collapse {
      position: relative;
    }
    .el-collapse-item__header {
      padding: 0 10px;
      font-weight: normal;
      font-size: 14px;
      .el-icon-arrow-right:before {
        content: "";
      }
      .selected-items-left {
        display: inline-block;
        i {
          color: #1890ff;
          margin-right: 5px;
        }
        span {
          color: #1890ff;
        }
      }
      .selected-items-right {
        float: right;
        color: #51a6ff;
        font-size: 12px;
        .triangle::before {
          font-size: 14px;
        }
      }
      border-radius: 4px;
      border: 1px solid #bae7ff;
      padding-left: 10px;
      margin-top: 12px;
      height: 32px;
      line-height: 32px;
      background: #e6f7ff;
    }
    .el-collapse-item__wrap {
      background: #ffffff;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.16);
      border-radius: 0 0 4px 4px;
      width: 100%;
      padding: 0px 4px 0 16px;
      position: absolute;
    }
    .el-collapse-item__content {
      padding-bottom: 0px;
      .my-slide-bar {
        max-height: 330px;
        overflow: auto;
        padding: 8px 0 16px 0;
        > span {
          color: rgba(0, 0, 0, 0.65);
          background: #e6f7ff;
          margin-right: 8px;
          border-radius: 2px;
          display: inline-block;
          margin-top: 8px;
          padding: 0 8px;
          border: 1px solid #bae7ff;
          font-size: 12px;
          line-height: 18px;
          vertical-align: middle;
          height: 22px;
          padding-top: 1px;
          > i.el-icon-close {
            cursor: pointer;
          }
        }
      }
    }
    &.hidden {
      min-height: 0;
      height: 0;
      opacity: 0;
      transform: scaleY(0);
    }
  }
  .metric-dialog-pagination {
    display: flex;
    justify-content: flex-end;
    position: relative;
    top: 12px;
    > button {
      border: none;
      outline-color: transparent;
      // font-size: 14px;
      padding: 5px 20px;
      background-color: transparent;
      &:hover {
        background-color: transparent;
      }
      &:focus {
        box-shadow: none;
      }
      span {
        font-size: 14px;
      }
    }
    span {
      font-size: 12px;
      padding-top: 2px;
    }
    input.currentPage {
      color: #333;
      border: 1px solid #e6e6e6;
      border-radius: 3px;
      font-size: 12px;
    }
    span.totalPages {
      color: #3f3f3f;
      font-family: PingFangSC-Regular;
    }
    span.total {
      font-family: PingFangSC-Regular;
      color: #666666;
      font-size: 12px;
      padding-top: 2px;
    }
    input {
      width: 30px;
      border: 1px solid #e6e6e6;
      border-radius: 3px;
      text-align: center;
    }
    .metric-dialog-pagination-separator {
      padding: 2px 5px;
    }
    > .arrow {
      cursor: pointer;
      text-align: center;
      user-select: none;
      margin: 12px 15px 0px 15px;
      width: 8px;
      height: 8px;
      border-left: 1px solid #999;
      border-bottom: 1px solid #999;
    }
    > .arrow-left {
      transform: translate(0, -50%) rotate(45deg);
    }
    > .arrow-right {
      transform: translate(0, -50%) rotate(-135deg);
    }
  }
  .metric-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-table td {
    padding: 8px 0;
    color: #333;
  }
  .el-table .cell {
    line-height: 20px;
  }
}
</style>
