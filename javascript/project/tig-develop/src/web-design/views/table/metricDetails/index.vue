<template>
  <div class="indexDetailCot">
    <div class="row">
      <div class="indexInfo">
        <div class="descInfo">
          <div class="title-content-style" style="color:#333333;" @click="sendMetricMsg">{{indexData.metricsNm}}</div>
          <div class="index-content" style="clear:both">
            <div class="row-index">
              <label class="attribute">业务定义:</label>
              <label class="valueDesc">{{indexData.businessDef}}</label>
            </div>
            <div class="row-index">
              <label class="attribute">口径描述:</label>
              <label class="valueDesc">{{indexData.caliberDesc}}</label>
            </div>
          </div>
          <div class="row-index">
            <label class="attribute">计算公式:</label>
            <label class="valueDesc">{{indexData.calculationFormula}}</label>
          </div>
          <div class="row-index">
            <label class="attribute">指标编码:</label>
            <label class="valueDesc">{{indexData.metricsCode}}</label>
          </div>
        </div>
      </div>
    </div>
    <!-- 维度信息 -->
    <div class="titleInfo">
      <div class="tableInfo">
        <p class="table-title">
          <span>维度</span>
          <span class="warnInfo">
              <Icon type="ios-star"></Icon>为必要维度</span>
        </p>
        <div class="row">
          <div class="indexDetailInfo" v-for="(items, index) in  historyData" :key="index">
            <div class="indexDetail" style="overflow:hidden">
              <div class="index-left" style="width:300px;">
                <div style="float:left;padding:5px 0px">
                  <Icon type="ios-star" v-if="items.isTimeDim"></Icon>
                </div>
                <div style="float:left">
                  <div class="row baseFont" style="height:32px">{{items.dimCode}}</div>
                  <div class="row">
                    <div class="dimTypeBox">
                      <template v-if="items.dimType">
                          <span class="str" style="">{{items.dimType}}</span>
</template>
                    </div>
                    <div class="dimNum">
                      <span style="">{{items.dimNm}}</span>
                    </div>
                    <Icon v-show="items.isHaveDimValue"  @click.native="toggleShow(index,items)" type="ios-arrow-down" style="margin-left:8px;cursor: pointer;"></Icon>
                  </div>
                </div>
              </div>
              <div class="baseFont" style="padding:5px 4px;line-height: 24px;float:left" >{{items.dimDesc}}</div>
            </div><!--indexDeatil结束-->
            <div class="categoryList" v-show="items.isShow" :style="items.style">
<template v-if="items.isShow">
  <div style="overflow:hidden">
    <div class="categoryInfoList">
      <div class="categoryInfo" v-for="(item, index) in dimValueListOdd[items.dimCode]" :key="index">
        <div class="left category">
          <div class="left titleColor">
            {{item.dimValue}}
          </div>
          <div class="left pd">
            {{item.dimValueNm}}
          </div>
        </div>
        <div class="left apd titleColor">
        </div>
      </div>
    </div>
    <div style="border-right:1px solid #E6E6E6;width:1px;min-height:400px;overflow: hidden;float:left"></div>
    <div class="categoryInfoList">
      <div class="categoryInfo" v-for="item in items.dimValueListEven" :key="item">
        <div class="left category">
          <div class="left titleColor">
            {{item.dimValue}}
          </div>
          <div class="left pd">
            {{item.dimValueNm}}
          </div>
        </div>
        <div class="left apd titleColor">
        </div>
      </div>
    </div>
  </div>
  <div style="float:right;">
    <Page :total="paging[items.dimCode].total"  simple @on-change="changePageDim(items, $event)"></Page>
  </div>
</template>

<template v-else>
  <div style="text-align: center;margin-top:30px">
    {{items.errorDesc}}</div>
</template>
            </div>
          </div>
          <div class="row right" style="margin-top:10px">
          <Page :current.sync="current" id="pageB" :total="total" :pageSize="pageSize" simple @on-change="changePageB"></Page>
          </div>
        </div>
      </div>

      <div class="row">
        <div class=" bold titleColor middleFont">上卷下钻路径</div>
        <div class="line"></div>
        <div class="indexDetailInfo" v-for="(items, index) in pathList" :key="index">
          <div class="index-left" style="padding:5px 4px;line-height: 24px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;">
            {{items.routeNm}}
          </div>
          <div class="index-right baseFont" style="padding:5px 4px;line-height: 24px">{{items.route}}
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <div class="row right" style="margin-top:10px">
        <Page :current.sync="currentP" id="pageP" :total="totalP" :pageSize="pageSizeP" simple @on-change="changePageP"></Page>
      </div>
    </div>
  </div>
</template>

<script>
  import cockpitdetailsApi from '@/web-design/api/table'
  
  export default {
    data() {
      return {
        paging: {},
        tableColumns1: [{
          title: '编码',
          key: 'status'
        }, {
          title: '名称',
          key: 'name',
          render(row) {
            return `<span  style='cursor:pointer' @click='showTable(row)'>${row.name}<Icon type='ios-information-outline'   style='font-size:16px;cursor:pointer;padding-left:4px' ></Icon></span>`
          }
        }, {
          title: '类型',
          key: 'name'
        }, {
          title: '是否必须',
          key: 'id'
        }, {
          title: '描述',
          key: 'update'
        }],
        tableSubColumn: [{
          title: '编码',
          key: 'status'
        }, {
          title: '维值',
          key: 'name'
        }, {
          title: '描述',
          key: 'update'
        }],
        isShow: false,
        isHide: true,
        isHideApiTool: true,
        isHideExportParam: true,
        total: 1,
        pageSize: 10,
        current: 1,
        totalP: 1,
        pageSizeP: 1,
        currentP: 1,
        indexDetailList: [],
        pathList: [{
          pathName: '路径一',
          path: '门店-门店级别1'
        }, {
          pathName: '路径二',
          path: '门店-门店级别2'
        }, {
          pathName: '路径三',
          path: '门店-门店级别3'
        }],
        pathList1: [],
        breadData: {},
        indexData: {},
        historyData: [],
        historyData1: [],
        dimValueListOdd: {},
        dimValueListEven: [],
        isData: false,
        errorDesc: '',
        style: '',
        showPage: true,
        showPageP: true
      }
    },
    methods: {
      sendMetricMsg() {
        this.$emit('receiveMsg', this.indexData.metricsNm)
      },
      changePageDim(items, $event) {
        if (!Number.isInteger(Number($event)) || Number($event) <= 0) {
          this.$Message.info('页码必须输入正整数')
          this.tempPage = 1
          return
        }
        if (Number($event) > this.pageTotal) {
          this.$Message.info('页码超出最大值')
          this.tempPage = this.pageTotal
          return
        }
        const dimId = items.dimCode
        const offset = ($event - 1) * 10
        // this.paging[dimId].page =  $event
        this.getDimValue(offset, dimId)
      },
      // 获取dimValue
      async getDimValue(offset, dimId) {
        const limit = 10
        const res = await cockpitdetailsApi.queryDimValue({
          offset,
          limit,
          dimId
        })
        if (res && res.data) {
          this.dimValueListOdd[dimId] = res.data
        }
      },
      async metricDetail() {
        const limit = 10
        const offset = 0
        const metricId = this.id
        // 指标详情数据查询
        const res = await cockpitdetailsApi.metricDetail({
          params: {
            limit,
            offset,
            metricId
          }
        })
        if (!res) return
        // 指标详情
        this.historyData1 = res.data[0].metricsDimList
        // 维度查询
        this.queryDimValue()
        // 指标信息
        this.indexData = res.data[0].metricsInfo
        // 总页数
        this.total = res.data[0].metricsDimCount
        // 讲指标详情返回数据返回--modify
        this.historyData = this.historyData1
        // modify
        // 上卷下钻
        this.pathList1 = res.data[0].metricsPathList
        // 上卷下钻数量
        this.totalP = res.data[0].metricsPathCount
        // 单页个数
        this.pageSizeP = 5
        if (this.totalp <= this.pageSizeP) {
          this.pathList = this.pathList1
        } else {
          this.pathList = this.pathList1.slice(0, this.pageSizeP)
        }
        // 初始化将指标名称带给父组件
        this.sendMetricMsg()
      },
      // 维度信息查询
      queryDimValue() {
        const limit = 10
        const obj = {}
        for (let i = 0; i < this.historyData1.length; i += 1) {
          obj[this.historyData1[i].dimCode] = {}
        }
        this.dimValueListOdd = obj
        this.historyData1.forEach((v) => {
          const dimId = v.dimCode
          if (dimId) {
            cockpitdetailsApi.queryDimValue({
              offset: 0,
              limit,
              dimId
            }).then((res) => {
              // console.log('shuj', res)
              if (res && res.data) {
                this.dimValueListOdd[dimId] = res.data
                const total = res.total || 0
                this.paging[dimId] = {
                  total
                }
              }
            })
          }
        })
      },
      // 指标详情分页
      async changePageB(val) {
        // modify 添加维度列表接口查询
        const limit = 10
        const offset = (val - 1) * 10
        const metricsCode = this.indexData.metricsCode
        const metricsType = this.indexData.metricsType
        const res = await cockpitdetailsApi.qryMetricDim({
          offset,
          limit,
          metricsCode,
          metricsType
        })
        if (res && res.data) {
          this.historyData = res.data
        }
        // -------------------------------------
        const obj = {}
        for (let i = 0; i < this.historyData.length; i += 1) {
          obj[this.historyData[i].dimCode] = {}
        }
        this.dimValueListOdd = obj
        this.historyData.forEach((v) => {
          const dimId = v.dimCode
          if (dimId) {
            cockpitdetailsApi.queryDimValue({
              offset,
              limit,
              dimId
            }).then((res) => {
              if (res && res.data) {
                this.dimValueListOdd[dimId] = res.data
                const total = res.total || 0
                this.paging[dimId] = {
                  total
                }
              }
            })
          }
        })
        // -------------------------------------
      },
      // 上卷下钻分页
      changePageP(val) {
        const _start = (val - 1) * this.pageSizeP
        const _end = val * this.pageSizeP
        this.pathList = this.pathList1.slice(_start, _end)
      },
      showTable() {
        this.isHide = !this.isHide
      },
      toggleShow(index) {
        this.$set(this.historyData[index], 'isShow', !this.historyData[index].isShow)
      },
      request() {
        this.getDimList()
        this.getDimPathList()
      }
    },
    watch: {},
    created() {},
    mounted() {
      // 指标id
      this.id = this.$route.query.metricsCode
      // 指标类型
      this.mType = this.$route.query.metricsType
      // 初始化查询指标信息
      this.metricDetail()
    }
  }
</script>

<style lang="less" scoped>
  .titleBar {
    display: inline-block
  }
  
  .comeBack {
    float: right;
    margin-right: 25px
  }
  
  .titleBar {
    margin-bottom: 0.5rem;
  }
  
  .descInfo {
    margin-bottom: 0.3rem;
    .title-content-style {
      font-size: 16px
    }
    p {
      font-size: 15px;
    }
    span {
      font-weight: 700;
    }
  }
  
  .baseFont {
    float: left
  }
  
  .middleFont {
    font-size: 16px;
    font-weight: 700
  }
  
  .titleInfo {
    width: 895px;
    margin-top: 60px;
    .table-title {
      margin-top: 20px;
      border-bottom: 1px solid #f5f5f5;
      line-height: 50px;
    }
    .table-title span:nth-child(1) {
      font-size: 16px;
      font-weight: 700;
    }
    .table-title span:nth-child(2) {
      float: right;
      color: #A7A7A7;
      .ivu-icon-ios-star:before {
        color: #fd94b8;
        font-size: 10px;
      }
    }
  }
  
  .ivu-icon-ios-star:before {
    color: #fd94b8;
  }
  
  .row {
    clear: both;
    padding: 5px 4px;
    overflow: hidden;
  }
  
  .right {
    display: inline-block;
    float: right;
  }
  
  .valueDesc {
    display: block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    color: #999;
    line-height: 24px;
  }
  
  .attribute {
    font-size: 14px;
    color: #333;
    line-height: 24px;
  }
  
  .dimTypeBox {
    display: block;
    float: left;
    width: 120px;
    min-height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
    white-space: nowrap;
    .str {
      background-color: #f5f5f5;
      color: #999;
      border: 1px solid #e6e6e6;
      padding: 0 5px;
      border-radius: 3px;
      margin-right: 5px;
      font-size: 12px;
    }
  }
  
  .dimNum {
    display: block;
    float: left;
    width: 130px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .indexDetailInfo {
    border-bottom: 1px solid #f9f9f9;
    overflow: hidden;
    padding: 5px 0;
    .categoryList {
      width: 100%;
      height: 236px;
      background: #f5f5f5;
      clear: both;
      overflow: auto;
    }
    .index-left {
      float: left;
    }
  }
  
  .categoryList .categoryInfoList {
    float: left;
    width: 49%;
    .category {
      padding-top: 20px;
      padding-left: 20px;
      .titleColor {
        width: 700px;
      }
      .pd {
        margin-left: 10px;
      }
    }
  }
</style>
