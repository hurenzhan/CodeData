<template>
  <page-wrap>
    <div class="title">
      <new-title title="流量分析-趋势分析" :date="searchData.dateTime" />
    </div>

    <search-wrap>
      <el-form ref="form" :model="searchData" size="mini">
        <el-form-item>
          <el-radio-group v-model="dayMark" @change="changeDayMark">
            <el-radio-button label="昨天"></el-radio-button>
            <el-radio-button label="前天"></el-radio-button>
            <el-radio-button label="最近7天"></el-radio-button>
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
          <el-checkbox v-model="searchData.compare" @change="changeCompare">对比</el-checkbox>
          <el-date-picker
                  v-model="searchData.dateTime2"
                  v-show="showCompareDate"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  @change="changeDate2"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
          </el-date-picker>
          <el-button type="success" @click="onExport">导出表格</el-button>
        </el-form-item>
      </el-form>
    </search-wrap>

    <div class="rect">
      <ul class="flowDataDetail">
        <template v-for="item in flowDataDetail">
          <li>
            <p>{{item.title}}</p>
            <p>{{item.number}}</p>
          </li>
        </template>
      </ul>
    </div>

    <div class="rect" v-show="searchData.compare">
      <ul class="flowDataDetail">
        <template v-for="item in flowDataDetail2">
          <li>
            <p>{{item.title}}</p>
            <p>{{item.number}}</p>
          </li>
        </template>
      </ul>
    </div>

    <el-card class="line-chart" v-show="showEcharts">
      <div class="box-card-content">
        <div id="lineChart"></div>
      </div>
    </el-card>

    <!-- 表格 -->
    <table-wrap>
      <el-table
              v-loading="loading"
              v-show="!searchData.compare"
              :data="tableData.simple"
              border
              :row-class-name="tableRowClassName"
              size="mini">
        <el-table-column label="时段" prop="period"></el-table-column>
        <el-table-column label="浏览次数(PV)" prop="pv"></el-table-column>
        <el-table-column label="独立访客(UV)" prop="uv"></el-table-column>
        <el-table-column label="IP" prop="ip"></el-table-column>
        <el-table-column label="新独立访客" prop="newUv"></el-table-column>
        <el-table-column label="访问次数" prop="visitNumber"></el-table-column>
        <el-table-column label="平均访问频度" prop="visitFreq"></el-table-column>
        <el-table-column label="平均访问时长" prop="visitTime"></el-table-column>
        <el-table-column label="平均访问深度" prop="visitDepth"></el-table-column>
        <el-table-column label="人均浏览页数" prop="viewPages"></el-table-column>
        <el-table-column label="跳出率" prop="bounceRate"></el-table-column>
      </el-table>
      <el-table
              v-show="searchData.compare"
              v-loading="loading"
              :data="tableData.complex"
              border
              :cell-style="setCellStyle"
              size="mini">
        <el-table-column
                label="时段"
                width="120px"
                prop="period">
        </el-table-column>
        <el-table-column label="浏览次数(PV)">
          <el-table-column label="时段一" prop="pv.one"></el-table-column>
          <el-table-column label="时段二" prop="pv.two"></el-table-column>
          <el-table-column label="变化情况" prop="pv.change" width="120px"></el-table-column>
        </el-table-column>
        <el-table-column label="独立访客(UV)">
          <el-table-column label="时段一" prop="uv.one"></el-table-column>
          <el-table-column label="时段二" prop="uv.two"></el-table-column>
        </el-table-column>
        <el-table-column label="IP">
          <el-table-column label="时段一" prop="ip.one"></el-table-column>
          <el-table-column label="时段二" prop="ip.two"></el-table-column>
        </el-table-column>
        <el-table-column label="新独立访客">
          <el-table-column label="时段一" prop="newUv.one"></el-table-column>
          <el-table-column label="时段二" prop="newUv.two"></el-table-column>
        </el-table-column>
        <el-table-column label="访问次数">
          <el-table-column label="时段一" prop="visitNumber.one"></el-table-column>
          <el-table-column label="时段二" prop="visitNumber.two"></el-table-column>
        </el-table-column>
        <el-table-column label="平均访问频度">
          <el-table-column label="时段一" prop="visitFreq.one"></el-table-column>
          <el-table-column label="时段二" prop="visitFreq.two"></el-table-column>
        </el-table-column>
        <el-table-column label="平均访问时长">
          <el-table-column label="时段一" prop="visitTime.one"></el-table-column>
          <el-table-column label="时段二" prop="visitTime.two"></el-table-column>
        </el-table-column>
        <el-table-column label="平均访问深度">
          <el-table-column label="时段一" prop="visitDepth.one"></el-table-column>
          <el-table-column label="时段二" prop="visitDepth.two"></el-table-column>
        </el-table-column>
        <el-table-column label="人均浏览页数">
          <el-table-column label="时段一" prop="viewPages.one"></el-table-column>
          <el-table-column label="时段二" prop="viewPages.two"></el-table-column>
        </el-table-column>
        <el-table-column label="跳出率">
          <el-table-column label="时段一" prop="bounceRate.one"></el-table-column>
          <el-table-column label="时段二" prop="bounceRate.two"></el-table-column>
        </el-table-column>
      </el-table>
    </table-wrap>

  </page-wrap>
</template>

<script>
    import PageWrap from './../../components/pageStructure/PageWrap.vue'
    import SearchWrap from './../../components/pageStructure/SearchWrap.vue'
    import TableWrap from './../../components/pageStructure/TableWrap.vue'
    import NewTitle from './../../components/base/NewTitle.vue'

    import { getDates }  from './../../assets/js/baseFunc/baseSelfFunc'

    export default {
        components: {
            PageWrap, SearchWrap, TableWrap, NewTitle
        },
        data () {
            return {
                searchData: {
                    dateTime: [getDates('yesterday'), getDates('yesterday')],
                    dateTime2: [getDates('daybefore'), getDates('daybefore')],
                    compare: false
                },
                flowDataDetail: [],
                flowDataDetail2: [],
                lineChartData: {
                    left: {
                        pv: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                        uv: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                        ip: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    },
                    right: {
                        pv: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                        uv: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                        ip: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    }
                },
                xData: ['00:00', '', '', '', '04:00', '', '', '', '08:00', '', '', '', '12:00', '', '', '',
                    '16:00', '', '', '', '20:00', '', '', ''],
                tableData: {
                    simple: [],
                    complex: [],
                },
                loading: false,
                dayMark: '昨天',
                showCompareDate: false,
                showEcharts: true
            }
        },
        mounted () {
            this.createChart()
            this.onSubmit()
        },
        methods: {
            changeDayMark (val) {
                switch (val) {
                    case '前天':
                        this.searchData.dateTime = [getDates('daybefore'), getDates('daybefore')]
                        this.searchData.dateTime2 = [getDates('fourDay'), getDates('fourDay')]
                        break
                    case '昨天':
                        this.searchData.dateTime = [getDates('yesterday'), getDates('yesterday')]
                        this.searchData.dateTime2 = [getDates('daybefore'), getDates('daybefore')]
                        break
                    case '最近7天':
                        this.searchData.dateTime = [getDates('sevenDay'), getDates('yesterday')]
                        this.searchData.dateTime2 = [getDates('fourteenDay'), getDates('eightDay')]
                        break
                }
                this.onSubmit()
            },
            changeDate (val) {
                if (val[0] === getDates('daybefore') && val[1] === getDates('daybefore')) {
                    this.dayMark = '前天'
                    this.searchData.dateTime2 = [getDates('fourDay'), getDates('fourDay')]
                } else if (val[0] === getDates('yesterday') && val[1] === getDates('yesterday')) {
                    this.dayMark = '昨天'
                    this.searchData.dateTime2 = [getDates('daybefore'), getDates('daybefore')]
                } else if (val[0] === getDates('sevenday') && val[1] === getDates('yesterday')) {
                    this.dayMark = '最近7天'
                    this.searchData.dateTime2 = [getDates('fourteenDay'), getDates('eightDay')]
                } else {
                    this.dayMark = ''
                }
                this.isshowEchart()
                this.onSubmit()
            },
            changeDate2 (val) {
                this.isshowEchart()
                this.onSubmit()
            },
            changeCompare (val) {
                this.showCompareDate = val
                this.isshowEchart()
                this.createChart()
                this.onSubmit()
            },
            onExport () {
                let that = this
                that.$ajax.post('/trend_analysis/import', {"type":"1"})
                    .then(function (res) {
                        if (res.data === 'ok') {
                            window.location = 'index.php/trend_analysis/import?starttime=' + that.searchData.dateTime[0] + '&starttime2=' + that.searchData.dateTime2[0] + '&endtime=' + that.searchData.dateTime[1] + '&endtime2=' + that.searchData.dateTime2[1] + '&compare=' + that.searchData.compare;
                        }
                        that.loading = false
                    })
                    .catch(function(err) {
                    })
            },
            tableRowClassName({row, rowIndex}) {
                if (rowIndex === 0) {
                    return 'sumClass'
                }
                return ''
            },
            onSubmit() {
                var that = this
                this.$ajax.post('/trend_analysis/index', that.searchData)
                    .then(function (res) {
                        if (res.data !== undefined) {
                            if (res.data.compare === false) {
                                that.lineChartData.left = res.data.lineChartData
                                that.xData = res.data.xdata
                                that.tableData.simple = res.data.tableData
                                that.flowDataDetail = res.data.flowDataDetail
                            } else {
                                if (that.searchData.dateTime[0] === that.searchData.dateTime[1] && that.searchData.dateTime2[0] === that.searchData.dateTime2[1]) {
                                    that.tableData.complex = res.data.tableData
                                    that.lineChartData = res.data.lineChartData
                                    that.flowDataDetail = res.data.flowDataDetail
                                    that.flowDataDetail2 = res.data.flowDataDetail2
                                    that.xData = res.data.xdata
                                } else {
                                    that.tableData.complex = res.data.tableData
                                    that.flowDataDetail = res.data.flowDataDetail
                                    that.flowDataDetail2 = res.data.flowDataDetail2
                                }
                            }
                            that.createChart()
                        }
                    })
                    .catch(function(err) {

                    })
            },
            setCellStyle (val) {
                if (val.columnIndex == 3) {
                    if (val.row.type === 'up') {
                        return { color : 'green', fontWeight: 'bold' }
                    } else if (val.row.type === 'down') {
                        return { color : 'red', fontWeight: 'bold' }
                    } else {
                        return { color : '#777', fontWeight: 'bold' }
                    }
                }
            },
            createChart () {
                let that = this
                var lineChart_option = {
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        align: 'left',
                        left: 10,
                        data: ['PV(左侧)', 'UV(左侧)', 'IP(左侧)', 'PV(右侧)', 'UV(右侧)', 'IP(右侧)'],
                        selected: {
                            'PV(左侧)': true,
                            'UV(左侧)': true,
                            'IP(左侧)': true,
                            'PV(右侧)': false,
                            'UV(右侧)': false,
                            'IP(右侧)': false
                        }
                    },
                    xAxis: {
                        type: 'category',
                        name: 'x',
                        splitLine: {show: false},
                        boundaryGap: false,
                        data: this.xData
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: 'PV(左侧)',
                            type: 'line',
                            data: this.lineChartData.left.pv,
                            color: 'blue',
                            itemStyle: {
                                normal: {
                                    color: "#2ec7c9",
                                    lineStyle: {
                                        color: "#2ec7c9"
                                    }
                                }
                            }
                        },
                        {
                            name: 'UV(左侧)',
                            type: 'line',
                            data: this.lineChartData.left.uv,
                            itemStyle: {
                                normal: {
                                    color: "#f56c6c",
                                    lineStyle: {
                                        color: "#f56c6c"
                                    }
                                }
                            }
                        },
                        {
                            name: 'IP(左侧)',
                            type: 'line',
                            data: this.lineChartData.left.ip,
                            itemStyle: {
                                normal: {
                                    color: "orange",
                                    lineStyle: {
                                        color: "orange"
                                    }
                                }
                            }
                        },
                        {
                            name: 'PV(右侧)',
                            type: 'line',
                            data: this.lineChartData.right.pv,
                            color: 'blue',
                            itemStyle: {
                                normal: {
                                    color: "#2ec7c9",
                                    lineStyle: {
                                        color: "#2ec7c9"
                                    }
                                }
                            }
                        },
                        {
                            name: 'UV(右侧)',
                            type: 'line',
                            data: this.lineChartData.right.uv,
                            itemStyle: {
                                normal: {
                                    color: "#f56c6c",
                                    lineStyle: {
                                        color: "#f56c6c"
                                    }
                                }
                            }
                        },
                        {
                            name: 'IP(右侧)',
                            type: 'line',
                            data: this.lineChartData.right.ip,
                            itemStyle: {
                                normal: {
                                    color: "orange",
                                    lineStyle: {
                                        color: "orange"
                                    }
                                }
                            }
                        }
                    ]
                }
                let lineChart = this.$echarts.init(document.getElementById('lineChart'))
                if (that.searchData.compare) {
                    lineChart_option.legend.selected = {
                        'PV(左侧)': true,
                        'UV(左侧)': true,
                        'IP(左侧)': true,
                        'PV(右侧)': true,
                        'UV(右侧)': true,
                        'IP(右侧)': true
                    }
                }
                lineChart.setOption(lineChart_option)
                lineChart.on('legendselectchanged', function (params) {
                    if (that.searchData.compare) {
                        switch (params.name) {
                            case 'PV(左侧)':
                                params.selected['PV(右侧)'] = params.selected[params.name]
                                break
                            case 'PV(右侧)':
                                params.selected['PV(左侧)'] = params.selected[params.name]
                                break
                            case 'UV(左侧)':
                                params.selected['UV(右侧)'] = params.selected[params.name]
                                break
                            case 'UV(右侧)':
                                params.selected['UV(左侧)'] = params.selected[params.name]
                                break
                            case 'IP(左侧)':
                                params.selected['IP(右侧)'] = params.selected[params.name]
                                break
                            case 'IP(右侧)':
                                params.selected['IP(左侧)'] = params.selected[params.name]
                                break
                        }
                        lineChart_option.legend.selected = params.selected
                        lineChart.setOption(lineChart_option)
                    }
                })
            },
            isshowEchart () {
                if (this.searchData.compare === false) {
                    this.showEcharts = true
                } else {
                    if (this.searchData.dateTime[0] === this.searchData.dateTime[1] && this.searchData.dateTime2[0] === this.searchData.dateTime2[1]) {
                        this.showEcharts = true
                    } else {
                        this.showEcharts = false
                    }
                }
            }
        }
    }
</script>

<style scoped>
  @import "./../../assets/css/page/trendAnalysis.css";
</style>
