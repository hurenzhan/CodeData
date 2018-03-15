<template>
    <page-wrap>

        <!-- 标题栏 -->
        <title-wrap>
          <new-title title="流量分析-来路域名" :date="searchData.dateTime" />
        </title-wrap>

        <!-- 搜索栏 -->
        <search-wrap>
            <el-form ref="form" :model="searchData" size="mini">
                <el-form-item>
                    <el-row :gutter="20">

                        <el-col :span="12">
                            <div class="bg">
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
                            </div>
                        </el-col>

                        <el-col :span="4">
                            <div class="bg">
                                <el-input v-model="searchData.urldetail" placeholder="请输入URL" style="width:100%;"></el-input>
                            </div>
                        </el-col>

                        <el-col :span="8">
                            <el-button type="primary" @click="onSubmit">查询</el-button>
                            <el-button type="danger" @click="onClear">清空</el-button>
                            <el-button type="warning" @click="onExportAll">导出全部</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </search-wrap>


        <!-- 其它的都放在这儿 -->
        <other-wrap>
            <div class="rect">
                <ul class="originDataDetail">
                    <template v-for="item in originDataDetail">
                        <li>
                            <p>{{item.title}}</p>
                            <p>{{item.number}}</p>
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
                @sort-change="tableSortChange"
                size="mini"
                :height="tabTableHeight">
                <el-table-column prop="d_name" label="来路域名">
                    <template slot-scope="scope">
                        <a :href="'http://'+scope.row.d_name" target="_blank" :title="scope.row.d_name">{{scope.row.d_name}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="d_num" label="访问次数" sortable="custom">
                  <template slot-scope="scope">
                      <a @click="clickDomain(scope.row)" :title="scope.row.d_num">{{scope.row.d_num}}</a>
                  </template>
                </el-table-column>
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
    import { mapState, mapMutations } from 'vuex'

    export default {
        components: {
            PageWrap, TitleWrap, SearchWrap, OtherWrap, TableWrap, paginationWrap, NewTitle, NewPagination
        },
        data () {
            return {
                searchData: {
                    dateTime: '',
                    urldetail: ''
                },
                originDataDetail: [
                    {
                        title: '访问次数',
                        number: 0
                    },
                    {
                        title: '直接输入网址或书签',
                        number: 0
                    },
                    {
                        title: '搜索引擎',
                        number: 0
                    },
                    {
                        title: '其他外部链接',
                        number: 0
                    }
                ],
                tableData: [],

                paginationData: {
                    total: 0,
                    prop:"d_num",
                    order:"descending"
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
                this.searchData.urldetail = ''
            },
            init () {
                this.initSearchData()
                this.onSubmit()
            },
            tableSortChange (val) {
                this.paginationData.prop = val.prop
                this.paginationData.order = val.order
                this.onSubmit('changeSort')
            },
            onSubmit (action) {
                let that = this
                if (action !== 'changeCurrentPage') {
                  that.paginationData.currentPage = 1
                }
                if (action !== 'changeSort' && action !== 'changeCurrentPage') {
                  that.$refs.table.clearSort()
                  this.paginationData.prop = 'd_num'
                  this.paginationData.order = 'descending'
                }
                that.loading = true
                that.$ajax.post('/originanalysis/index', {searchData:that.searchData,paginate:that.paginationData})
                    .then(function (res) {
                        if (res.data) {
                            that.tableData = res.data.tableData
                            that.originDataDetail = res.data.originDataDetail
                            that.paginationData.total = res.data.total
                        }
                        that.loading = false
                    })
                    .catch(function(err) {
                    })
            },
            onClear () {
                this.initSearchData()
                this.onSubmit()
            },
            onExportAll () {
                let that = this
                that.loading = true
                that.$ajax.post('/keyword/export', {"type":"1"})
                    .then(function (res) {
                        if (res.data) {
                            window.location = 'index.php/keyword/export?keyword=' + that.searchData.keyword + '&start_time=' + that.searchData.dateTime[0] + '&end_time=' + that.searchData.dateTime[1];
                        }
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
            ...mapMutations('navTabs', ['addTab', 'func_domain_to_visitDetail']),
            clickDomain (val) {
              let obj = {
                date: this.searchData.dateTime,
                number: val.d_num,
                url: {
                  way: 'from-zdy',
                  value: val.d_name
                }
              }
              this.addTab({name: 'flowAnalysis/VisitDetail', title: '访问明细'})
              this.func_domain_to_visitDetail(obj)
            }
        }
    }
</script>

<style scoped>
    @import "./../../assets/css/page/OriginAnalysis.css";
</style>
