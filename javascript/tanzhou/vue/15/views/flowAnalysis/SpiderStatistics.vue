<template>
    <page-wrap>

        <!-- 标题栏 -->
        <title-wrap>
          <new-title title="流量分析-蜘蛛分析" :date="searchData.dateTime" />
        </title-wrap>

        <!-- 搜索栏 -->
        <search-wrap>
            <el-form ref="form" :model="searchData" size="mini">
              <el-form-item>
                  <el-radio-group v-model="dayMark" @change="changeDayMark">
                      <el-radio-button label="昨天"></el-radio-button>
                      <el-radio-button label="最近7天"></el-radio-button>
                      <el-radio-button label="最近30天"></el-radio-button>
                  </el-radio-group>
                  <el-date-picker
                    v-model="searchData.dateTime"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    @change="changeDate"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
              </el-form-item>
            </el-form>
        </search-wrap>


        <!-- 其它的都放在这儿 -->
        <other-wrap>
            <template v-for="(data,title) in spiderDataDetail">
                <div class="rect">
                    <p :class="title">{{title}}</p>
                    <ul class="spiderDataDetail">
                        <template v-for="item in data">
                            <li>
                                <p>{{item.title}}</p>
                                <p>{{item.number}}</p>
                            </li>
                        </template>
                    </ul>
                </div>
            </template>


          <el-card class="spider-pc-pieChart">
            <div slot="header">
              <span>PC蜘蛛饼状图</span>
            </div>
            <div class="box-card-content">
              <div id="spider_pc_pieChart"></div>
            </div>
          </el-card>

          <el-card class="spider-m-pieChart">
            <div slot="header">
              <span>M蜘蛛饼状图</span>
            </div>
            <div class="box-card-content">
              <div id="spider_m_pieChart"></div>
            </div>
          </el-card>

          <el-form :model="searchData" size="mini" style="margin-left:10px;">
            <el-form-item label="选择指标：" style="margin-bottom:3px!important;">
                <el-radio-group v-model="searchData.pieChartMedia" @change="onCharts">
                  <el-radio label="pc">PC蜘蛛</el-radio>
                  <el-radio label="m">M蜘蛛</el-radio>
                </el-radio-group>
            </el-form-item>
          </el-form>

          <el-card class="spider-barChart">
            <div class="box-card-content">
              <div id="spider_barChart"></div>
            </div>
          </el-card>

        </other-wrap>

        <!-- 表格 -->
        <table-wrap>
            <el-form :model="searchData" size="mini" style="margin-left:10px;">
              <el-form-item label="选择指标：" style="margin-bottom:3px!important;">
                  <el-radio-group v-model="searchData.tableMedia" @change="onTable">
                    <el-radio label="pc">PC蜘蛛</el-radio>
                    <el-radio label="m">M蜘蛛</el-radio>
                  </el-radio-group>
              </el-form-item>
            </el-form>

            <el-table
                ref="table"
                :data="tableData"
                size="mini"
                @sort-change="tableSortChange"
                :row-class-name="tableRowClassName">
                <el-table-column prop="date" label="日期" sortable="custom"></el-table-column>
                <el-table-column prop="total" label="蜘蛛抓取总量" sortable="custom"></el-table-column>
                <el-table-column prop="baidu" label="百度蜘蛛" sortable="custom"></el-table-column>
                <el-table-column prop="zz360" label="360蜘蛛" sortable="custom"></el-table-column>
                <el-table-column prop="sougou" label="搜狗蜘蛛" sortable="custom"></el-table-column>
                <el-table-column prop="shenma" label="神马蜘蛛" sortable="custom"></el-table-column>
                <el-table-column prop="other" label="其它" sortable="custom"></el-table-column>
            </el-table>
        </table-wrap>


        <!-- 分页 -->
        <pagination-wrap>
            <new-pagination
                :total="paginationData.total"
                :propCurrentPage="paginationData.currentPage"
                @initPaginationData="showPaginationData"
                @handleSizeChange="showSizeChange"
                @handleCurrentChange="showCurrentChange"
            />
        </pagination-wrap>

    </page-wrap>
</template>


<script>
    import PageWrap from './../../components/pageStructure/PageWrap.vue'
    import TitleWrap from './../../components/pageStructure/titleWrap.vue'
    import OtherWrap from './../../components/pageStructure/OtherWrap.vue'
    import SearchWrap from './../../components/pageStructure/SearchWrap.vue'
    import TableWrap from './../../components/pageStructure/TableWrap.vue'
    import paginationWrap from './../../components/pageStructure/paginationWrap.vue'
    import NewTitle from './../../components/base/NewTitle.vue'
    import NewPagination from './../../components/base/NewPagination.vue'

    import { getDates }  from './../../assets/js/baseFunc/baseSelfFunc'
    import { mapState } from 'vuex'

    export default {
        components: {
            PageWrap, TitleWrap, SearchWrap, OtherWrap, TableWrap, paginationWrap, NewTitle, NewPagination
        },
        data () {
            return {
                searchData: {
                    dateTime: '',
                    pieChartMedia: 'pc',
                    tableMedia: 'pc'
                },
                spiderDataDetail: {
                  'PC': [
                  {
                      title: '蜘蛛抓取总量',
                      number: 0
                  },
                  {
                      title: '百度蜘蛛',
                      number: 0
                  },
                  {
                      title: '360蜘蛛',
                      number: 0
                  },
                  {
                      title: '搜狗蜘蛛',
                      number: 0
                  },
                  {
                      title: '神马蜘蛛',
                      number: 0
                  },
                  {
                      title: '其它',
                      number: 0
                  }
                ],
                'M':[
                    {
                        title: '蜘蛛抓取总量',
                        number: 0
                    },
                    {
                        title: '百度蜘蛛',
                        number: 0
                    },
                    {
                        title: '360蜘蛛',
                        number: 0
                    },
                    {
                        title: '搜狗蜘蛛',
                        number: 0
                    },
                    {
                        title: '神马蜘蛛',
                        number: 0
                    },
                    {
                        title: '其它',
                        number: 0
                    }
                ],},

                spiderPcPieChartData: [
                  {
                    value: 0,
                    name: '百度蜘蛛： 0(0%)'
                  },
                  {
                    value: 0,
                    name: '360蜘蛛： 0(0%)'
                  },
                  {
                    value: 0,
                    name: '搜狗蜘蛛： 0(0%)'
                  },
                  {
                    value: 0,
                    name: '神马蜘蛛： 0(0%)'
                  },
                  {
                    value: 0,
                    name: '其它： 0(0%)'
                  }
                ],
                spiderMPieChartData: [
                  {
                    value: 0,
                    name: '百度蜘蛛： 0(0%)'
                  },
                  {
                    value: 0,
                    name: '360蜘蛛： 0(0%)'
                  },
                  {
                    value: 0,
                    name: '搜狗蜘蛛： 0(0%)'
                  },
                  {
                    value: 0,
                    name: '神马蜘蛛： 0(0%)'
                  },
                  {
                    value: 0,
                    name: '其它： 0(0%)'
                  }
                ],
                spiderBarChartData: {
                  total: [300],
                  baidu: [50],
                  zz360: [20],
                  sougou: [40],
                  shenma: [70],
                  other: [100],
                },
                spiderBarChartTitle:['2017-12-03'],
                tableData: [
                  {
                    date: '总计',
                    total: 0,
                    baidu: '0(0%)',
                    zz360: '0(0%)',
                    sougou: '0(0%)',
                    shenma: '0(0%)',
                    other: '0(0%)'
                  }
                ],
                paginationData: {
                    total: 0
                },
                dayMark: '昨天',
                loading: false
            }
        },
        created () {
            this.init()
        },
        mounted () {
          this.initPieEcahrts()
          this.initBarEcharts()
          this.onSubmit()
        },
        methods: {
            initSearchData () {
              this.dayMark = '昨天'
              this.searchData.dateTime = [getDates('yesterday'), getDates('yesterday')]
            },
            init () {
              this.initSearchData()
            },
            initPieEcahrts () {
              let spider_pc_pieChart_option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: this.spiderPcPieChartData.map(x => x.name)
                },
                color:['#0980d9', '#1d9bf9', '#4db3ff', '#79c3fa', '#cee7fa', '#c6e5fc'],
                series : [
                    {
                        name: '蜘蛛',
                        type: 'pie',
                        radius: ['50%', '85%'],
                        center: ['58%', '50%'],
                        data: this.spiderPcPieChartData,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            }
                        }
                    }
                ]
              }
              let spider_m_pieChart_option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: this.spiderMPieChartData.map(x => x.name)
                },
                color:['#ee2d2d', '#fb5050', '#f56c6c', '#f89090', '#fababa', '#fad9d9', '#fce4e4'],
                series : [
                    {
                        name: '蜘蛛',
                        type: 'pie',
                        radius: ['50%', '85%'],
                        center: ['58%', '50%'],
                        data: this.spiderMPieChartData,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            }
                        }
                    }
                ]
              }
              this.$echarts.init(document.getElementById('spider_pc_pieChart')).setOption(spider_pc_pieChart_option)
              this.$echarts.init(document.getElementById('spider_m_pieChart')).setOption(spider_m_pieChart_option)
            },
            initBarEcharts () {
              let spider_barChart_option = {
                color:['#ddd', 'red', 'orange', 'yellow', 'green', 'indigo', 'purple'],
                toolbox: {
                  show: true,
                  feature: {
                      restore: {},
                      saveAsImage: {}
                  }
                },
                legend: {
                  data: ['蜘蛛抓取总量', '百度蜘蛛', '360蜘蛛', '搜狗蜘蛛', '神马蜘蛛', '其它']
                },
                tooltip : {
                     trigger: 'axis',
                     axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                         type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                     }
                 },
                 grid: {
                     left: '3%',
                     right: '4%',
                     bottom: '3%',
                     containLabel: true
                 },
                 xAxis : [
                     {
                         type : 'category',
                         data : this.spiderBarChartTitle,
                         axisTick: {
                             alignWithLabel: true
                         }
                     }
                 ],
                 yAxis : [
                     {
                         type : 'value'
                     }
                 ],
                 series: [
                    {
                        name: '蜘蛛抓取总量',
                        type: 'bar',
                        data: this.spiderBarChartData.total
                    },
                    {
                        name: '百度蜘蛛',
                        type: 'line',
                        data: this.spiderBarChartData.baidu
                    },
                    {
                        name: '360蜘蛛',
                        type: 'line',
                        data: this.spiderBarChartData.zz360
                    },
                    {
                        name: '搜狗蜘蛛',
                        type: 'line',
                        data: this.spiderBarChartData.sougou
                    },
                    {
                        name: '神马蜘蛛',
                        type: 'line',
                        data: this.spiderBarChartData.shenma
                    },
                    {
                        name: '其它',
                        type: 'line',
                        data: this.spiderBarChartData.other
                    }
                ]
              }

              this.$echarts.init(document.getElementById('spider_barChart')).setOption(spider_barChart_option)
            },
            onCharts () {
              let that = this
              that.$ajax.post('/spider_statistics/index', {"search":that.searchData,"paginate":that.paginationData})
                   .then(function (res) {
                       if (res.data) {
                           that.spiderBarChartData = res.data.spiderBarChartData
                           that.spiderBarChartTitle = res.data.spiderBarChartTitle
                           that.initBarEcharts()
                       }
                   })
                   .catch(function(err) {
                   })
            },
            onTable (action) {
              let that = this
              if (action !== 'changeCurrentPage') {
                that.paginationData.currentPage = 1
                that.$refs.table.clearSort()
                this.paginationData.prop = 'date'
                this.paginationData.order = 'descending'
              }
              that.loading = true
              that.$ajax.post('/spider_statistics/index', {"search":that.searchData,"paginate":that.paginationData})
                   .then(function (res) {
                       if (res.data) {
                           that.tableData = res.data.tableData
                           that.paginationData.total = res.data.total
                       }
                       that.loading = false
                   })
                   .catch(function(err) {
                   })
            },
            onSubmit (action) {
              let that = this
              if (action !== 'changeCurrentPage') {
                that.paginationData.currentPage = 1
              }
              if (action !== 'changeSort' && action !== 'changeCurrentPage') {
                that.$refs.table.clearSort()
              }

              that.loading = true
              that.$ajax.post('/spider_statistics/index', {"search":that.searchData,"paginate":that.paginationData})
                   .then(function (res) {
                       if (res.data) {
                           that.spiderDataDetail = res.data.spiderDataDetail
                           that.spiderPcPieChartData = res.data.spiderPcPieChartData
                           that.spiderMPieChartData = res.data.spiderMPieChartData
                           that.tableData = res.data.tableData
                           that.paginationData.total = res.data.total
                           that.spiderBarChartData = res.data.spiderBarChartData
                           that.spiderBarChartTitle = res.data.spiderBarChartTitle

                           that.initPieEcahrts()
                           that.initBarEcharts()
                       }
                       that.loading = false
                   })
                   .catch(function(err) {
                   })
            },
            changeDayMark (val) {
                switch (val) {
                    case '昨天':
                        this.searchData.dateTime = [getDates('yesterday'), getDates('yesterday')]
                        break
                    case '最近7天':
                        this.searchData.dateTime = [getDates('sevenDay'), getDates('yesterday')]
                        break
                    case '最近30天':
                        this.searchData.dateTime = [getDates('thirtyDay'), getDates('yesterday')]
                        break
                }
                this.onSubmit()
            },
            changeDate (val) {
              if (val !== null) {
                if (val[0] === getDates('yesterday') && val[1] === getDates('yesterday')) {
                  this.dayMark = '昨天'
                } else if (val[0] === getDates('sevenDay') && val[1] === getDates('yesterday')) {
                  this.dayMark = '最近7天'
                } else if (val[0] === getDates('thirtyDay') && val[1] === getDates('yesterday')) {
                  this.dayMark = '最近30天'
                } else {
                  this.dayMark = ''
                }
              } else {
                this.dayMark = ''
              }
              this.onSubmit()
            },
            showPaginationData (data) {
                this.paginationData.pageSizes = data.pageSizes
                this.paginationData.pageSize = data.pageSize
                this.paginationData.currentPage = data.currentPage
                this.paginationData.total = data.total
            },
            showSizeChange (val) {
                this.paginationData.pageSize = val
                this.onSubmit()
            },
            showCurrentChange (val) {
                this.paginationData.currentPage = val
                this.onSubmit('changeCurrentPage')
            },
            tableSortChange (val) {
                this.paginationData.prop = val.prop
                this.paginationData.order = val.order
                this.onSubmit('changeSort')
            },
            tableRowClassName({row, rowIndex}) {
              if (rowIndex === 0) {
                return 'sumClass'
              }
              return ''
            }
        }
    }
</script>

<style scoped>
  @import "./../../assets/css/page/spiderStatistics.css";
</style>
