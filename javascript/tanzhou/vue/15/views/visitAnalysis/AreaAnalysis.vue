<template>
    <page-wrap>

        <!-- 标题栏 -->
        <title-wrap>
          <new-title title="访客分析-地区分析" :date="searchData.dateTime" />
        </title-wrap>

        <!-- 搜索栏 -->
        <search-wrap>
          <el-form ref="form" :model="searchData" size="mini">
            <el-form-item>
              <el-radio-group v-model="dayMark" @change="changeDayMark">
                  <el-radio-button label="昨天"></el-radio-button>
                  <el-radio-button label="前天"></el-radio-button>
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

              <el-radio-group v-model="searchData.tongji" @change="changeTongjiWay" style="margin-left: 20px;">
                <el-radio label="ip">按IP统计</el-radio>
                <el-radio label="domain">按Domain统计</el-radio>
              </el-radio-group>

            </el-form-item>
          </el-form>
        </search-wrap>


        <!-- 其它的都放在这儿 -->
        <other-wrap>
          <div class="rect">
            <ul class="areaDataDetail">
              <template v-for="item in areaDataDetail">
                <li>
                  <p>{{item.title}}</p>
                  <p>{{item.number}}</p>
                </li>
              </template>
            </ul>
          </div>

          <el-card class="map-chart">
            <div class="box-card-content">
              <div id="areaAnalysis_mapChart"></div>
            </div>
          </el-card>

          <el-card class="pie-chart">
            <div slot="header">
              <el-form ref="form" :model="searchData" size="mini">
                  <el-form-item label="选择指标：">
                      <el-select v-model="searchData.provinceRange" @change="changeArea" size="mini" clearable placeholder="省级">
                        <el-option
                          v-for="item in baseData.provinceCity"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                  </el-form-item>
                </el-form>
            </div>
            <div class="box-card-content">
              <div id="areaAnalysis_pieChart"></div>
            </div>
          </el-card>

        </other-wrap>


        <!-- 表格 -->
        <table-wrap class="areaAnalysis_table">
          <el-form ref="form" :model="searchData" size="mini" class="withTableHeader">
              <el-form-item label="选择指标：">
                <el-radio-group v-model="searchData.tableDataClassify" @change="changeProvinces">
                  <el-radio-button label="省级"></el-radio-button>
                  <el-radio-button label="市级"></el-radio-button>
                </el-radio-group>
                <el-button type="success" class="button" @click="onExport">导出表格</el-button>
              </el-form-item>
          </el-form>
          <el-table
            ref="table"
            v-loading="loading"
            :data="tableData"
            @sort-change="tableSortChange"
            :row-class-name="tableRowClassName"
            size="mini">
            <el-table-column type="expand">
              <template slot-scope="props">
                <div class="expandWrap" style="background-color: #fff;">
                  <div class="expandWrap_title">城市：</div>
                  <el-table
                    size="mini"
                    :data="props.row.expandInfo === undefined ? [] : props.row.expandInfo.tableInfo"
                    :show-header="false"
                    style="width: 100%">
                    <el-table-column
                      label="">
                      <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                      </template>
                    </el-table-column>
                    <el-table-column label="浏览次数(PV)" sortable="custom" prop="pv"></el-table-column>
                    <el-table-column label="占比" sortable="custom" prop="proportion"></el-table-column>
                    <el-table-column label="独立访客(UV)" sortable="custom" prop="uv"></el-table-column>
                    <el-table-column label="IP" sortable="custom" prop="ip"></el-table-column>
                    <el-table-column label="新独立访客" sortable="custom" prop="newUv"></el-table-column>
                    <el-table-column label="访问次数" sortable="custom" prop="visitNumber"></el-table-column>
                    <el-table-column label="跳出率" sortable="custom" prop="bounceRate"></el-table-column>
                  </el-table>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label=""
              width="150">
              <template slot-scope="props">
                {{props.row.name}} &nbsp;&nbsp;&nbsp;&nbsp;
              </template>
            </el-table-column>
            <el-table-column label="浏览次数(PV)" sortable="custom" prop="pv"></el-table-column>
            <el-table-column label="占比" sortable="custom" prop="proportion"></el-table-column>
            <el-table-column label="独立访客(UV)" sortable="custom" prop="uv"></el-table-column>
            <el-table-column label="IP" sortable="custom" prop="ip"></el-table-column>
            <el-table-column label="新独立访客" sortable="custom" prop="newUv"></el-table-column>
            <el-table-column label="访问次数" sortable="custom" prop="visitNumber"></el-table-column>
            <el-table-column label="跳出率" sortable="custom" prop="bounceRate"></el-table-column>
          </el-table>
        </table-wrap>


        <!-- 分页 -->
        <pagination-wrap :style="{display: (searchData.tableDataClassify === '省级' ? 'none' : 'block')}">
            <new-pagination
                :total="paginationData.total"
                :propPageSize="paginationData.pageSize"
                @initPaginationData="showPaginationData"
                @handleSizeChange="showSizeChange"
                @handleCurrentChange="showCurrentChange" />
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
                baseData: {
                  provinceCity: []
                },
                searchData: {
                    dateTime: '',
                    tongji: 'ip',
                    provinceRange: '0',
                    tableDataClassify: '省级'
                },
                areaDataDetail: [],
                areaAnalysis_mapChart_data: [],
                areaAnalysis_pieChart_data: [],
                tableData: [
                {
                    name:"全站总计",
                    pv:0,
                    proportion:"100%",
                    uv:0,
                    ip:0,
                    newUv:0,
                    visitNumber:0,
                    bounceRate:"0%",
                }
                ],
                paginationData: {
                    total: 0,
                    pageSize: 50,
                },
                dayMark: '昨天',
                loading: false
            }
        },
        computed: {
          ...mapState('navTabs',[
              'tabTableHeight'
          ])
        },
        mounted () {
            this.initCharts()
            this.init()
        },
        methods: {
            initSearchData () {
              this.dayMark = '昨天'
              this.searchData.dateTime = [getDates('yesterday'), getDates('yesterday')]
              this.searchData.keyword = ''
            },
            tableSortChange (val) {
                this.paginationData.prop = val.prop
                this.paginationData.order = val.order
                this.onSubmit('changeSort')
            },
            init () {
              let that = this
              this.initSearchData()
              this.$ajax.get('/area/init')
                  .then(function(res) {
                      if (res.data) {
                          that.baseData = res.data.baseData
                      }
                  })
                  .catch(function(err) {
                  })
              this.onSubmit()
            },
            onSubmit (action) {
                let that = this
                if (action !== 'changeCurrentPage') {
                  that.paginationData.currentPage = 1
                }
                if (action !== 'changeSort' && action !== 'changeCurrentPage') {
                  that.$refs.table.clearSort()
                  that.paginationData.prop = ''
                  that.paginationData.order = ''
                }
                // if (action === false) {
                //     that.paginationData.prop = ""
                //     that.paginationData.order = ""
                // }
                that.loading = true
                if (that.searchData.tableDataClassify === "省级") {
                    that.paginationData.pageSize = 50
                }
                if (that.searchData.tableDataClassify === "市级") {
                    that.paginationData.pageSize = 20
                }
                that.$ajax.post('/area/index', {searchData:that.searchData,paginate:that.paginationData})
                  .then(function (res) {
                      if (res.data !== undefined) {
                          that.areaDataDetail = res.data.areaDataDetail
                          that.areaAnalysis_mapChart_data = res.data.areaAnalysis_mapChart_data
                          that.areaAnalysis_pieChart_data = res.data.areaAnalysis_pieChart_data
                          that.tableData = res.data.detail.tableData
                          that.paginationData.total = res.data.detail.paginationData
                          that.initCharts()
                      }
                      that.loading = false
                  })
                  .catch(function(err) {
                      that.loading = false
                  })
            },
            onClear () {
                this.initSearchData()
            },
            onExport () {
                let that = this
                that.$ajax.post('/area/export', {"type":"1"})
                    .then(function (res) {
                        if (res.data === 'ok') {
                            window.location = 'index.php/area/export?tableDataClassify=' + that.searchData.tableDataClassify + '&start_time=' + that.searchData.dateTime[0] + '&end_time=' + that.searchData.dateTime[1] + '&tongji='+that.searchData.tongji;
                        }
                        that.loading = false
                    })
                    .catch(function(err) {
                    })
            },
            changeArea () {
              let that = this
              this.$ajax.post('/area/changearea',{searchData:that.searchData,provinceRange:this.searchData.provinceRange})
                  .then(function(res) {
                      if (res.data) {
                          that.areaAnalysis_pieChart_data = res.data.areaAnalysis_pieChart_data
                          that.baseData = res.data.baseData
                          that.setEcharsPieChart()
                      }
                  })
                  .catch(function(err) {
                  })
            },
            changeDayMark (val) {
                switch (val) {
                    case '前天':
                        this.searchData.dateTime = [getDates('daybefore'), getDates('daybefore')]
                        break
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
                this.searchData.tableDataClassify = "省级"
                this.onSubmit()
            },
            changeDate (val) {
              if (val !== null) {
                if (val[0] === getDates('yesterday') && val[1] === getDates('yesterday')) {
                  this.dayMark = '今天'
                } else if (val[0] === getDates('yesterday') && val[1] === getDates('yesterday')) {
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
                this.searchData.tableDataClassify = "省级"
                this.onSubmit()
            },
            changeProvinces () {
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
            changeTongjiWay () {
                this.searchData.tableDataClassify = "省级"
                this.onSubmit()
            },
            initCharts(){
                this.setEcharsPieChart()
                this.setEcharsMapChart()
            },
            tableRowClassName({row, rowIndex}) {
                if (rowIndex === 0) {
                    return 'sumClass'
                }
                return ''
            },
            setEcharsPieChart () {
                let areaAnalysis_pieChart_option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: this.areaAnalysis_pieChart_data.map(x => x.name)
                    },
                    color:['#2ec7c9','#f56c6c', 'orange', '#FF4090', '#9069f8', '#41e99c'],
                    series : [
                        {
                            name:'访问来源',
                            type:'pie',
                            radius: ['40%', '70%'],
                            center: ['75%', '50%'],
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                }
                            },
                            data: this.areaAnalysis_pieChart_data
                        }
                    ]
                }
                this.$echarts.init(document.getElementById('areaAnalysis_pieChart')).setOption(areaAnalysis_pieChart_option)
            },
            setEcharsMapChart () {
                let areaAnalysis_mapChart_option = {
                    tooltip : {
                        trigger: 'item'
                    },
                    dataRange: {
                        min: 0,
                        max: 5000,
                        x: 'left',
                        y: 'center',
                        text: ['高','低'],
                        color: ['#005c86', '#0084be', '#00a2e9', '#3fbeef', '#97d6f5', '#d7eef8'],
                        calculable : true
                    },
                    series : [
                        {
                            name: 'map',
                            type: 'map',
                            map: 'china',
                            roam: true,
                            center: ['50%', '50%'],
                            selectedMode: 'multiple',
                            label: {
                                normal: {
                                    show: false,
                                    color: '#eee'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    areaColor: '#d7eef8',
                                    borderWidth: '1',
                                    borderColor: '#fff'
                                },
                                emphasis: {
                                    areaColor: 'pink',
                                    color: '#000',
                                    borderWidth: '2',
                                    borderColor: '#fff'
                                }
                            },
                            data: this.areaAnalysis_mapChart_data
                        }
                    ]
                }
                this.$echarts.init(document.getElementById('areaAnalysis_mapChart')).setOption(areaAnalysis_mapChart_option)
            }
        }
    }
</script>

<style scoped>
  @import "./../../assets/css/page/areaAnalysis.css";
</style>
