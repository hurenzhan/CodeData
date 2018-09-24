<template>
<div style="padding: 20px 40px;background:#fff;">
  <hot-table
    :exportDisable="exportDisable"
    :designConfig="tableConfig"
    :report="{ reportId: reportId, versionId: versionId}"
    :businessType="businessType"
    ></hot-table>
</div>
</template>
<script>
import tableApi from '@/web-design/api/table'
import hotTable from './hotTable'

export default {
  components: {
    hotTable
  },
  data() {
    return {
      tableConfig: null,
      exportDisable: false,
      reportId: null,
      versionId: null,
      businessType: ''
    }
  },
  props: {
    report: {
      default() {
        return {
          versionId: '',
          reportId: '',
        }
      }
    }
  },
  watch: {
    report(val) {
      if (val && val.versionId && val.reportId) {
        this.reportId = val.reportId
        this.versionId = val.versionId
        this.initConfig()
      }
    }
  },
  created() {
    // 限制F5刷新请求
    document.onkeydown = function(e){
      if(e.keyCode === 116){
        if(new Date().getTime() - sessionStorage.getItem("f5_limit") > 8000){
          sessionStorage.setItem("f5_limit", new Date().getTime())
        }else{
          if(window.event){   
            e.returnValue = false
          }else{
            e.preventDefault()  
          } 
        } 
      }
    }
    const query = this.$route.query
    if (query && query.reportId && query.versionId) {
      this.reportId = query.reportId
      this.versionId = query.versionId
      if (query.export && query.export === '1') {
        this.exportDisable = true
      }
      this.initConfig()
    }
    // 业务类型 默认空 1 驾驶舱  2 报表市场预览  3 用户权限
    if (query && query.businessType) {
      this.businessType = query.businessType
    }
    if (this.report && this.report.versionId && this.report.reportId) {
      this.reportId = this.report.reportId
      this.versionId = this.report.versionId
      this.initConfig()
    }
  },
  methods: {
    // 获取表格配置
    async initConfig() {
      if (!this.reportId || !this.versionId) return
      const headers = {}
      if (this.$route.query.flag === '1' || this.$route.query.flag === 1) {
        headers.LogFlag = 1
      }
      const data = await tableApi.config({
        reportId: this.reportId,
        versionId: this.versionId,
        systemLabel: 4
      }, headers)
      if (!data || !data.data) return
      const res = data.data
      if (res && res.reportContent) {
        const tableConfig = JSON.parse(res.reportContent)
        console.log(res)
        tableConfig.reportContent.reportType =  res.reportType
        this.tableConfig = tableConfig.reportContent
      } else {
        // 报表不存在时，清空tableConfig
        this.tableConfig = null
      }
    }
  }
}
</script>
