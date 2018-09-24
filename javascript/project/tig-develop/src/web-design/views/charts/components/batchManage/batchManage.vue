<template>
  <div>
    <p>兼容性管理,慎用</p>
    <el-button @click="start">执行</el-button>
    <el-progress :text-inside="true" :stroke-width="18" :percentage="progress"></el-progress>
  </div>
</template>

<script>
  import api from '../../../../api/batchManage'
  export default {
    name: 'BatchManage',
    data () {
      return {
        progress: 0 // 进度
      }
    },
    mounted () {
    },
    methods: {
      async start () {
        const reportsFlatten = await this.getReportList()
        for (let i = 0; i < reportsFlatten.length; i++) {
          const reportId = reportsFlatten[i].reportId
          const versionId = reportsFlatten[i].reportVersion[0]
          if (i > 0) {
            const res = await api.getReportInfo({
              reportId,
              versionId
            })
            const reportContent = JSON.parse(res.data.reportContent)
            // 计算容器高度
            if (reportContent.heightResized === undefined) {
              reportContent.chartsOption.forEach(item => {
                item.h = Math.ceil(item.h * 41 / 11)
              })
              reportContent.heightResized = true
              try {
                await api.update({
                  reportId,
                  versionId,
                  reportContent: JSON.stringify(reportContent),
                  reportName: reportContent.name
                })
              } catch (e) {
                console.log(reportContent.name, '报错')
              }
            }
          }
          this.progress = Math.round(i / reportsFlatten.length * 100)
          console.log(this.progress)
        }
      },
      // 获取所有报表list
      async getReportList () {
        const res1 = await api.getReportList({
          limit: 1
        })
        const res2 = await api.getReportList({
          limit: res1.total
        })
        return res2.data
      }
    }
  }
</script>
