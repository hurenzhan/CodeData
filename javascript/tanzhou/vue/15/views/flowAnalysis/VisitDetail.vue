<template>
  <page-wrap>
    <!-- 搜索栏 -->
    <search-wrap>
      <el-form ref="form" :model="searchData" label-width="100px" size="mini">
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="bg">

              <el-form-item label="日期与时间：">
                <el-radio-group v-model="dayMark" @change="changeDayMark">
                  <el-radio-button label="昨天"></el-radio-button>
                  <el-radio-button label="前天"></el-radio-button>
                </el-radio-group>

                <el-date-picker
                  v-model="searchData.date"
                  type="date"
                  @change="changeDate"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>

                <el-time-select
                  placeholder="起始时间"
                  class="date-min"
                  v-model="searchData.time.start"
                  @change="changeTimeStart"
                  :picker-options="{
                    start: '00:00',
                    step: '01:00',
                    end: '23:00'
                  }">
                </el-time-select>
                <el-time-select
                  readonly
                  placeholder="结束时间"
                  class="date-min"
                  v-model="searchData.time.end"
                  :picker-options="{
                    start: '00:59',
                    step: '01:00',
                    end: '23:59'
                  }">
                </el-time-select>
              </el-form-item>

            </div>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="0">
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button type="danger" @click="onClear">清空</el-button>
              <el-button type="success" @click="onExport">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="bg">
              <el-form-item label="数据依据：">
                <el-radio-group v-model="searchData.show" @change="onSubmit">
                  <el-radio label="pv">按PV显示</el-radio>
                  <el-radio label="uv">按UV显示</el-radio>
                  <el-radio label="number">按访问次数显示</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="12">
            <div class="bg">
              <el-form-item label="选择地区：">
                <el-radio-group v-model="searchData.area.type" @change="onSubmit">
                  <el-radio label="ip">IP地区</el-radio>
                  <el-radio label="domain">域名地区</el-radio>
                </el-radio-group>
                <el-select v-model="searchData.area.value" placeholder="请选择" style="margin-left: 5%;">
                 <el-option
                   v-for="item in baseData.areas"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
                 </el-option>
               </el-select>
             </el-form-item>
           </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <div class="bg">
              <el-form-item label="IP：">
                <el-input v-model="searchData.ip" placeholder="请输入内容"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <!-- <el-col :span="8">
            <div class="bg">
              <el-form-item label="来源页面：">
                <el-input v-model="searchData.fromUrl" placeholder="请输入内容"></el-input>
              </el-form-item>
            </div>
          </el-col> -->
          <el-col :span="12">
            <div class="bg">
              <el-form-item label="受访页面：">
                <el-input v-model="searchData.resUrl" placeholder="请输入内容"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <div class="bg">
              <el-form-item label="来源页面：">
                <el-radio-group v-model="searchData.newFromUrl.from" @change="changeFromUrl">
                  <el-radio label="from-direct">直接输入网址或书签</el-radio>

                  <el-radio label="from-searchEngine">搜索引擎
                    <el-select v-model="searchData.newFromUrl.searchEngine.select" placeholder="请选择" :disabled="searchEngine_select_disabled" style="width: 150px;margin-left: 5%;">
                      <el-option label="全部" value='all'></el-option>
                      <el-option label="百度" value='baidu'></el-option>
                      <el-option label="360搜索" value='360'></el-option>
                      <el-option label="搜狗" value='sougou'></el-option>
                      <el-option label="谷歌" value='google'></el-option>
                      <el-option label="神马" value='shenma'></el-option>
                   </el-select>
                   <el-input v-model="searchData.newFromUrl.searchEngine.input" :disabled="searchEngine_input_disabled" placeholder="请输入搜索词" style="width: 150px;"></el-input>
                  </el-radio>

                  <el-radio label="from-other">其它外部链接</el-radio>

                  <el-radio label="from-zdy">自定义URL
                    <el-input v-model="searchData.newFromUrl.zdy.input" :disabled="zdy_input_disabled" style="width: 150px;"></el-input>
                  </el-radio>

                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </search-wrap>

    <!-- 表格 -->
    <table-wrap>
      <el-table
        ref="table"
        v-loading="loading"
        :data="tableData"
        size="mini"
        @sort-change="tableSortChange"
        :height="tabTableHeight">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="expandWrap">
              <el-form style="padding-left: 10px;" label-position="left" inline size="mini">
                <el-row>
                  <el-col :span="4">
                    <el-form-item label="网络接入商： ">
                      <span>{{ props.row.expandInfo.listInfo.netAccessProvider}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="语言： ">
                      <span>{{ props.row.expandInfo.listInfo.language}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="设备类型： ">
                      <span>{{ props.row.expandInfo.listInfo.equipmentType}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="操作系统： ">
                      <span>{{ props.row.expandInfo.listInfo.operateSystem}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="分辨率： ">
                      <span>{{ props.row.expandInfo.listInfo.resolvePower}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item label="浏览器： ">
                      <span>{{ props.row.expandInfo.listInfo.browser}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>

              <el-table
                v-show="searchData.show === 'pv' ? false : true"
                size="mini"
                :data="props.row.expandInfo.tableInfo"
                style="width: 100%">
                <el-table-column
                  label="访问轨迹">
                  <template slot-scope="scope">
                    <a :href="scope.row.accessTrajectory" :title="scope.row.accessTrajectory" target="_blank">{{scope.row.accessTrajectory}}</a>
                   </template>
                </el-table-column>
                <el-table-column
                  label="打开时间"
                  prop="openTime">
                </el-table-column>
                <el-table-column
                  label="停留时长"
                  prop="stayTime">
                </el-table-column>
                <el-table-column
                  label="页面地址">
                  <template slot-scope="scope">
                    <a :href="scope.row.pageArea" :title="scope.row.pageArea" target="_blank">{{scope.row.pageArea}}</a>
                   </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="120px"
          label="浏览时间"
          sortable="custom"
          prop="log_time">
        </el-table-column>
        <el-table-column label="来源页面">
          <template slot-scope="scope">
            <a :href="scope.row.url_from" target="_blank" :title="scope.row.url_from">{{scope.row.url_from}}</a>
           </template>
        </el-table-column>
        <el-table-column
          label="受访页面">
          <template slot-scope="scope">
            <a :href="scope.row.web_from" target="_blank" :title="scope.row.web_from">{{scope.row.web_from}}</a>
           </template>
        </el-table-column>
        <el-table-column
          width="120px"
          label="IP"
          prop="ip_address">
        </el-table-column>
        <el-table-column
          width="120px"
          label="IP地区"
          sortable="custom"
          prop="ip_area">
        </el-table-column>
        <el-table-column
          width="120px"
          label="域名地区"
          sortable="custom"
          prop="domain_area">
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
  import SearchWrap from './../../components/pageStructure/SearchWrap.vue'
  import TableWrap from './../../components/pageStructure/TableWrap.vue'
  import paginationWrap from './../../components/pageStructure/paginationWrap.vue'
  import NewPagination from './../../components/base/NewPagination.vue'

  import { getDates }  from './../../assets/js/baseFunc/baseSelfFunc'
  import { mapState } from 'vuex'

  export default {
    components: {
      PageWrap, SearchWrap, TableWrap, paginationWrap, NewPagination
    },
    data () {
      return {
        baseData: {
          areas: [
            {
              value: '0',
              label: ' - - - - - - - '
            }
          ]
        },
        searchData: {
          date: '',
          time: {
            start: '',
            end: ''
          },
          show: 'pv',
          area: {
            type: 'ip',
            value: '0'
          },
          ip: '',
          newFromUrl: {
            from: '',
            searchEngine: {
              select: 'all',
              input: ''
            },
            zdy: {
              input: ''
            }
          },
          resUrl: ''
        },
        tableData: [],
        paginationData: {},
        dayMark: '昨天',
        loading: false,
        searchEngine_select_disabled: true,
        searchEngine_input_disabled: true,
        zdy_input_disabled: true
      }
    },
    computed: {
      ...mapState('navTabs', [
          'tabTableHeight', 'domain_to_visitDetail'
      ])
    },
    mounted () {
      this.init()
    },
    watch: {
      domain_to_visitDetail () {
        this.init()
      }
    },
    methods: {
      tableSortChange (val) {
        this.paginationData.order = val.order
        this.paginationData.prop = val.prop
        this.onSubmit('changeSort')
      },
      showPaginationData (data) {
        this.paginationData.pageSizes = data.pageSizes
        this.paginationData.pageSize = data.pageSize
        this.paginationData.currentPage = data.currentPage
        this.paginationData.total = data.total
        this.paginationData.order = data.order
        this.paginationData.prop = 'log_time'
      },
      initSearchData () {
        this.dayMark = this.domain_to_visitDetail.date[0] === getDates('yesterday') ? '昨天' : (this.domain_to_visitDetail.date[0] === 'daybefore' ? '前天' : (this.domain_to_visitDetail.date.length === 0 ? '昨天' : ''))
        this.searchData.date = this.domain_to_visitDetail.date.length > 0 ? this.domain_to_visitDetail.date[0] : getDates('yesterday')
        this.searchData.time = {
          start: '',
          end: ''
        }
        this.searchData.show = this.domain_to_visitDetail.number !== '' ? 'number' : 'pv'
        this.searchData.area = {
          type: 'ip',
          value: '0'
        }
        this.searchData.ip = ''
        this.searchData.resUrl = ''
        this.searchData.newFromUrl = {
          from: this.domain_to_visitDetail.url.way !== '' ? this.domain_to_visitDetail.url.way : '',
          searchEngine: {
            select: this.domain_to_visitDetail.url.way === 'from-searchEngine' ? this.domain_to_visitDetail.url.value : 'all',
            input: this.domain_to_visitDetail.url.way === 'from-searchEngine'  ? this.domain_to_visitDetail.keyword : '',
          },
          zdy: {
            input: this.domain_to_visitDetail.url.way === 'from-zdy' ? this.domain_to_visitDetail.url.value : ''
          }
        }
        this.searchEngine_select_disabled = this.domain_to_visitDetail.url.way === 'from-searchEngine' ? false : true
        this.searchEngine_input_disabled = this.domain_to_visitDetail.url.way === 'from-searchEngine' ? false : true
        this.zdy_input_disabled = this.domain_to_visitDetail.url.way === 'from-zdy' ? false : true
      },
      init () {
        let that = this
        this.initSearchData()
        this.$ajax.get('/visit_detail/init')
          .then(function(res) {
            if (res.data.baseData !== undefined) {
              that.baseData = res.data.baseData
            }
          })
          .catch(function(err) {
          })
          that.onSubmit()
      },
      changeFromUrl (val) {
        if (val === 'from-direct' || val === 'from-other') {
          this.searchData.newFromUrl.searchEngine.select = 'all'
          this.searchData.newFromUrl.searchEngine.input = ''
          this.searchData.newFromUrl.zdy.input = ''
          this.searchEngine_select_disabled = true
          this.searchEngine_input_disabled = true
          this.zdy_input_disabled = true
        } else if (val === 'from-searchEngine') {
          this.searchData.newFromUrl.zdy.input = ''
          this.zdy_input_disabled = true
          this.searchEngine_select_disabled = false
          this.searchEngine_input_disabled = false
        } else if (val === 'from-zdy') {
          this.searchData.newFromUrl.searchEngine.select = 'all'
          this.searchData.newFromUrl.searchEngine.input = ''
          this.searchEngine_select_disabled = true
          this.searchEngine_input_disabled = true
          this.zdy_input_disabled = false
        }
      },
      onSubmit (action) {
        let that = this
        if (action !== 'changeCurrentPage') {
          that.paginationData.currentPage = 1
        }
        if (action !== 'changeSort' && action !== 'changeCurrentPage') {
          that.$refs.table.clearSort()
          this.paginationData.prop = 'log_time'
          this.paginationData.order = 'descending'
        }

        that.loading = true
        that.$ajax.post('/visit_detail/index', {search: that.searchData, paginate: that.paginationData})
          .then(function (res) {
            if (res.data !== undefined && res.data.tableData !== undefined && res.data.total !== undefined && res.data.show !== undefined) {
              that.tableData = res.data.tableData
              that.paginationData.total = res.data.total
            }
              that.loading = false
          })
          .catch(function(err) {
              that.loading = false
          })
      },
      onClear () {
        this.dayMark = '昨天'
        this.searchData.date = getDates('yesterday')
        this.searchData.time = {
          start: '',
          end: ''
        }
        this.searchData.show = 'pv'
        this.searchData.area = {
          type: 'ip',
          value: '0'
        }
        this.searchData.ip = ''
        this.searchData.resUrl = ''
        this.searchData.newFromUrl = {
          from: '',
          searchEngine: {
            select: 'all',
            input: '',
          },
          zdy: {
            input: ''
          }
        }
        this.searchEngine_select_disabled = true
        this.searchEngine_input_disabled = true
        this.zdy_input_disabled = true
        this.onSubmit()
      },
      onExport () {
          let that = this
          that.$ajax.post('/visit_detail/import', {"type":"1"})
              .then(function (res) {
                  if (res.data === 'ok') {
                      window.location = 'index.php/visit_detail/import?date=' + that.searchData.date + '&starttime=' + that.searchData.time.start + '&endtime=' + that.searchData.time.end + '&value='+that.searchData.area.value + '&type='+that.searchData.area.type + '&ip='+that.searchData.ip + '&fromUrl='+that.searchData.newFromUrl + '&resUrl='+that.searchData.resUrl + '&show='+that.searchData.show;
                  }
                  that.loading = false
              })
              .catch(function(err) {
              })
      },
      changeDayMark () {
        switch (this.dayMark) {
          case '今天':
            this.searchData.date = getDates('today')
            break
          case '昨天':
            this.searchData.date = getDates('yesterday')
            break
          case '前天':
            this.searchData.date = getDates('daybefore')
            break
        }
        this.onSubmit()
      },
      changeDate () {
        if (this.searchData.date === getDates('today')) {
          this.dayMark = '今天'
        } else if (this.searchData.date === getDates('yesterday')) {
          this.dayMark = '昨天'
        } else if (this.searchData.date === getDates('daybefore')) {
          this.dayMark = '前天'
        } else {
          this.dayMark = ''
        }
        this.onSubmit()
      },
      changeTimeStart () {
        if (this.searchData.time.start === null) {
          this.searchData.time.end = ''
        } else {
          this.searchData.time.end = this.searchData.time.start.substring(0, 2) + ':59'
        }
          this.onSubmit()
      },
      showSizeChange (val) {
        this.paginationData.pageSize = val
        this.onSubmit()
      },
      showCurrentChange (val) {
        this.paginationData.currentPage = val
        this.onSubmit('changeCurrentPage')
      }
    }
  }
</script>
