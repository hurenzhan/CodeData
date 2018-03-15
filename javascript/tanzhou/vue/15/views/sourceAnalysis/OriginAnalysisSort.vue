<template>
    <page-wrap>

        <!-- 标题栏 -->
        <title-wrap>
          <new-title title="来源分析-来源域名升降" :date="searchData.dateTime" :date2="searchData.dateTime2" />
        </title-wrap>

        <!-- 搜索栏 -->
        <search-wrap>
            <el-form ref="form" :model="searchData" size="mini">
                <el-form-item>
                    <el-date-picker
                            v-model="searchData.dateTime"
                            @change="changeDate"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                    <span>&nbsp;&nbsp;对比&nbsp;&nbsp;</span>
                    <el-date-picker
                            v-model="searchData.dateTime2"
                            type="daterange"
                            @change="changeDate"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                    <el-button type="success" @click="onExportAll">导出表格</el-button>
                </el-form-item>
            </el-form>
        </search-wrap>


        <!-- 其它的都放在这儿 -->
        <other-wrap>
            <div class="rect">
                <p>访问次数</p>
                <ul class="originDataSortDetail">
                    <template v-for="(item, index) in total.total">
                        <li>
                            <p>{{item.title}}</p>
                            <p :style="{color: index === 2 ? total.type.type === 'up' ? 'red' : total.type.type === 'down' ? 'green' : '#888' : ''}">{{item.number}}</p>
                        </li>
                    </template>
                </ul>
            </div>
        </other-wrap>


        <!-- 表格 -->
        <table-wrap>
            <el-table
                    ref="table"
                    :data="tableData"
                    size="mini"
                    sortable="custom"
                    @sort-change="tableSortChange"
                    :cell-style="setCellStyle"
                    :height="tabTableHeight">
                <el-table-column prop="domain" label="来路域名">
                  <template slot-scope="scope">
                    <a :href="scope.row.domain" target="_blank" :title="scope.row.domain">{{scope.row.domain}}</a>
                  </template>
                </el-table-column>
                <el-table-column prop="one_num" :label="showTime1" sortable>
                  <template slot-scope="scope">
                      <a @click="clickDomain(scope.row)" :title="scope.row.one_num">{{scope.row.one_num}}</a>
                  </template>
                </el-table-column>
                <el-table-column prop="two_num" :label="showTime2" sortable>
                  <template slot-scope="scope">
                      <a @click="clickDomain(scope.row)" :title="scope.row.two_num">{{scope.row.two_num}}</a>
                  </template>
                </el-table-column>
                <el-table-column prop="sort" label="变化情况" sortable></el-table-column>
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
    import NewTitle from './../../components/base/NewTitle.vue'
    import paginationWrap from './../../components/pageStructure/paginationWrap.vue'
    import NewPagination from './../../components/base/NewPagination.vue'

    import { getDates }  from './../../assets/js/baseFunc/baseSelfFunc'
    import { mapState, mapMutations } from 'vuex'

    export default {
        components: {
            PageWrap, TitleWrap, SearchWrap, OtherWrap, TableWrap, paginationWrap, NewTitle, NewPagination
        },
        data () {
            return {
                searchData: {
                    dateTime: [getDates('yesterday'), getDates('yesterday')],
                    dateTime2: [getDates('daybefore'), getDates('daybefore')],
                    urldetail: ""
                },
                showTime1: "",
                showTime2: "",
                total: [
                    {
                        title: '2017-12-14 至 2017-12-14',
                        number: 0
                    },
                    {
                        title: '2017-12-17 至 2017-12-23',
                        number: 0
                    },
                    {
                        title: '变化情况',
                        number: "+0(+0%)"
                    }
                ],
                tableData: [],
                paginationData: {
                    total: 0
                },
                dayMark: '昨天',
                loading: false
            }
        },
        mounted () {
            this.init()
        },
        computed: {
            ...mapState('navTabs',[
                'tabTableHeight'
            ])
        },
        methods: {
            initSearchData () {
                this.dayMark = '昨天'
                this.searchData.dateTime = [getDates('yesterday'), getDates('yesterday')]
                this.searchData.dateTime2 = [getDates('daybefore'), getDates('daybefore')]
                if (this.searchData.dateTime[0] === this.searchData.dateTime[1]){
                    this.showTime1 = this.searchData.dateTime[0]
                } else{
                    this.showTime1 = this.searchData.dateTime[0] + " 至 " + this.searchData.dateTime[1]
                }
                if (this.searchData.dateTime2[0] === this.searchData.dateTime2[1]){
                    this.showTime2 = this.searchData.dateTime2[0]
                } else {
                    this.showTime2 = this.searchData.dateTime2[0] + " 至 " + this.searchData.dateTime2[1]
                }
                this.onSubmit()
            },
            init () {
                this.initSearchData()
            },
            tableSortChange (val) {
                this.paginationData.prop = val.prop
                this.paginationData.order = val.order
                this.onSubmit('changeSort')
            },
            onSubmit (action) {
                let that = this
                that.loading = true
                if (action !== 'changeCurrentPage') {
                  that.paginationData.currentPage = 1
                }
                if (action !== 'changeSort' && action !== 'changeCurrentPage') {
                  that.$refs.table.clearSort()
                  this.paginationData.prop = ''
                  this.paginationData.order = 'descending'
                }
                that.$ajax.post('/originanalysissort/index', {"searchData":that.searchData,"paginate":that.paginationData})
                    .then(function (res) {
                        if (res.data) {
                            that.tableData = res.data.tableData
                            that.total = res.data.total
                            that.paginationData.total = res.data.page
                        }
                        that.loading = false
                    })
                    .catch(function(err) {
                    })
            },
            onClear () {
                this.initSearchData()
            },
            changeDate(val) {
              if (val !== null) {
                if (this.searchData.dateTime[0] === this.searchData.dateTime[1]) {
                    this.showTime1 = this.searchData.dateTime[0]
                } else{
                    this.showTime1 = this.searchData.dateTime[0] + " 至 " + this.searchData.dateTime[1]
                }
                if (this.searchData.dateTime2[0] === this.searchData.dateTime2[1]) {
                    this.showTime2 = this.searchData.dateTime2[0]
                } else {
                    this.showTime2 = this.searchData.dateTime2[0] + " 至 " + this.searchData.dateTime2[1]
                }
              }
              this.onSubmit()
            },
            onExportAll () {
                let that = this
                that.loading = true
                that.$ajax.post('/keyword/export', {"type":"1"})
                    .then(function (res) {
                        if (res.data) {
                            window.location = 'index.php/originanalysissort/export?start_time2=' + that.searchData.dateTime2[0] + '&end_time2=' + that.searchData.dateTime2[1]  + '&start_time1=' + that.searchData.dateTime[0] + '&end_time1=' + that.searchData.dateTime[1];
                        }
                    })
                    .catch(function(err) {
                    })
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
            setCellStyle (val) {
              if (val.columnIndex == 3) {
                if (val.row.type === 'up') {
                  return { color : 'red', fontWeight: 'bold' }
                } else if (val.row.type === 'down') {
                  return { color : 'green', fontWeight: 'bold' }
                } else {
                  return { color : '#777', fontWeight: 'bold' }
                }
              }
            },
            ...mapMutations('navTabs', ['addTab', 'func_domain_to_visitDetail']),
            clickDomain (val) {
              let obj = {
                date: this.searchData.dateTime,
                number: val.one_num,
                url: {
                  way: 'from-zdy',
                  value: val.domain
                }
              }
              this.addTab({name: 'flowAnalysis/VisitDetail', title: '访问明细'})
              this.func_domain_to_visitDetail(obj)
            }
        }
    }
</script>

<style scoped>
    @import "./../../assets/css/page/OriginAnalysisSort.css";
</style>
