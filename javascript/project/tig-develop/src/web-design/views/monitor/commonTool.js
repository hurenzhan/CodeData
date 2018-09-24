/**
 * name: 通用工具类
 * func: 封装了多页面公用的四级联动菜单业务逻辑和时间选择处理逻辑,
 *           各页面只需使用混合mixin引入即可使用
 * warning: 页面中数据请求方式统一使用getTableData对象, 且都是post请求
 * author: 程宾 2017.11.21
 */
import apiMonitor from '@/web-design/api/monitor'

export default {
  data() {
    return {
      // 四级联动下拉菜单数组
      // industrys: [], // 产业下拉
      // business: [], // 业务域下拉
      // firstTopic: [], // 一级主题下拉
      // secondTopic: [], // 二级主题下拉
      limitDate: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      }
    }
  },
  props: {
    showFlag: false
  },
  watch: {
    showFlag() {
      if (this.showFlag) {
        // this.getIndustrys()
        this.clearQueryConditions()
      }
    }
  },
  methods: {
    // 获取产业,产业默认存在
    // async getIndustrys() {
    //   const industy = await apiMonitor.queryIndustry()
    //   if (!industy) return
    //   this.industrys = industy.data
    // },
    // // 产业变化后获取对应业务域
    // async industryChange() {
    //   const industryId = this.getTableData.body.industryId
    //   // 如果产业有值就获取对应业务域,若为空就清空后面三级下拉菜单
    //   if (industryId) {
    //     const busi = await apiMonitor.queryBusiness(
    //       {
    //         params: {
    //           industryId
    //         }
    //       }
    //     )
    //     if (!busi) return
    //     this.business = busi.data
    //   } else {
    //     this.business = []
    //     this.getTableData.body.domainId = ''
    //   }
    //   this.firstTopic = []
    //   this.secondTopic = []
    //   this.getTableData.body.firstSubject = ''
    //   this.getTableData.body.secondSubject = ''
    //   // this.$refs.dataTable.judgeType()
    //   this.queryItem()
    // },
    // // 业务域变化后获取对应一级主题
    // async businessChange() {
    //   const industryId = this.getTableData.body.industryId
    //   const businessId = this.getTableData.body.domainId
    //   if (businessId) {
    //     const firTopic = await apiMonitor.queryFirstTopic(
    //       {
    //         params: {
    //           industryId,
    //           businessId
    //         }
    //       }
    //     )
    //     if (!firTopic) return
    //     this.firstTopic = firTopic.data
    //   } else {
    //     this.firstTopic = []
    //     this.getTableData.body.firstSubject = ''
    //   }
    //   this.secondTopic = []
    //   this.getTableData.body.secondSubject = ''
    //   // this.$refs.dataTable.judgeType()
    //   this.queryItem()
    // },
    // // 一级主题变化后获取对应二级主题
    // async firstTopicChange() {
    //   const industryId = this.getTableData.body.industryId
    //   const businessId = this.getTableData.body.domainId
    //   const firstTopic = this.getTableData.body.firstSubject
    //   if (firstTopic) {
    //     const secTopic = await apiMonitor.querySecondTopic(
    //       {
    //         params: {
    //           industryId,
    //           businessId,
    //           firstReportId: firstTopic
    //         }
    //       }
    //     )
    //     if (!secTopic) return
    //     this.secondTopic = secTopic.data
    //   } else {
    //     this.secondTopic = []
    //     this.getTableData.body.secondSubject = ''
    //   }
    //   // this.$refs.dataTable.judgeType()
    //   this.queryItem()
    // },
    // 条件查询
    queryItem() {
      const canQuery = this.judgeDateRange()
      if (!canQuery) {
        return
      }
      this.$refs.dataTable.judgeType()
    },
    // 对时间区间进行判断,给出对应提示,返回值true表示可以条件查询, false表示不能查询
    judgeDateRange() {
      if (this.startDate && this.endDate) {
        const startDate = new Date(this.startDate)
        const endDate = new Date(this.endDate)
        if (startDate.valueOf() - endDate.valueOf() > 0) {
          this.$Message.warning('开始时间不能小于结束时间')
          return false
        }
        return true
      }
      // return true
    },
    // 格式化今天0点到明天0点的时间
    formatRecentTime(isPre) {
      const date = new Date()
      const year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      month = month >= 10 ? month : `0${month}`
      day = day >= 10 ? day : `0${day}`
      if (isPre) {
        return `${year}-${month}-${day} 00:00:00`
      } else {
        return `${year}-${month}-${day} 23:59:59`
      }
    }
  }
}
