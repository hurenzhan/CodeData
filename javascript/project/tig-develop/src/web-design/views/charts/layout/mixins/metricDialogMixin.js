import api from '../../../../api/charts'
export default {
  data() {
    return {
      domainList: [], // 业务域
      domainSelected: '', // 选中的业务域
      subjectList: [], // 主题
      subjectSelected: '', // 选中的主题
      keyword: '', // 关键字
      sdFlagType: [       //指标类型
        {
          id: 0,
          sdFlag: '0',
          label: '汇总指标'
        },
        {
          id: 1,
          sdFlag: '1',
          label: '明细指标'
        }
      ],
      typeSelected: '',  //选中的指标类型
    }
  },
  computed: {
    // 报表名字
    name: {
      get() {
        return this.$store.state.charts.name
      },
      set(value) {
        this.$store.commit('changeName', value)
      }
    }
  },
  mounted() {
    this.getDomainList()
  },
  methods: {
    async getDomainList() {
      const res = await api.getDomainList()
      this.domainList = res ? res.data : []
    },
    // 指标类型改变
    async typeChange() {
      this.goFirstPage()
    },
    // 业务域改变
    async domainChange() {
      if (this.domainSelected) {
        const res = await api.getSubjectList(
          {
            domainCode: this.domainSelected
          }
        )
        this.subjectList = res ? res.data : []
      } else {
        this.subjectList = []
      }
      this.subjectSelected = ''
      this.goFirstPage()
    },
    // 主题改变
    async subjectChange() {
      this.goFirstPage()
      // this.getMetrics()
    },
    keywordChange() {
      this.goFirstPage()
      this.valueNoChange = false
    },
    // 这个方法是为了应对指标名称input框输入查询超时后
    // 输入框值不变的情况下change事件不触发
    keywordNotChange() {
      if(this.valueNoChange){
        this.goFirstPage()
      }
      this.valueNoChange = true
    }
  }
}
