/**
 * @name tablePaging组件使用的多选行实现工具
 * @function 实现行的多选,翻页后记录每页被勾选数据,实现反选,全选逻辑
 * @description 使用时必须定义tablePaging的ref属性为dataTable,并相应修改此文件中
 * 的行标识属性名称,然后在tablePaging组件上直接绑定以下预留接口函数即可.
 * 注意: tablePaging中的"选项改变时触发"的函数对应此文件中的反选逻辑函数
 */
export default {
  data() {
    return {
      rowIdFlag: 'reportId', // 表数据中每行的唯一标识符,不同的表格用此文件时需要修改这个值
      selectedDataArr: [], // 存放已勾选的行对象的数组
      pageArray: [], // 记录所有页面中全选信息, 每个页面对应一个数组,若本页全选, 数组中存放本业所有对象, 否则为空
      currentPage: 1, // 当前显示页面,默认为1
      firstChangePage: true // 是否第一次翻页
    }
  },
  mounted() {
    this.getPageInfo()
  },
  methods: {
    /************************************* 内部使用的函数 *******************************************/
    // 只在页面加载时执行一次的函数,用来初始化pageArray,并对第一页是否全选进行判断
    getPageInfo() {
      this.pageArray.push([])
      // 初始化时也要判断第一页是否已经全选
      setTimeout(() => {
        if (this.judgePageSelectAll()) {
          this.pageArray[this.currentPage - 1] = [].concat(this.$refs.dataTable.list)
        }
      }, 500)
    },
    // 判断当前页数据是否初始化时就是全选(区别于手动全选逻辑) 全选返回true, 非全选返回false
    // 其中属性rowIdFlag是行对象数据唯一标识符,移植时只需要改为需要的属性即可
    judgePageSelectAll() {
      let count = 0
      // 先获取本页全部数据
      const list = this.$refs.dataTable.list
      list.forEach((item) => {
        if (this.selectedDataArr.filter(each => item[this.rowIdFlag] === each[this.rowIdFlag])
        .length !== 0) {
          count += 1
        }
      })
      if (count === list.length) {
        return true
      } else {
        return false
      }
    },
    /************************************预留接口函数*********************************************/
    // 切换页面
    pageChange(page, total) {
      this.currentPage = page
      // 在第一次翻页时将所有页面对应的数组放入pageArray中.注意,在初始化时已将第一页对应数组放入,所以此处要toal-1
      if (this.firstChangePage === true) {
        for (let i = 0; i < total - 1; i += 1) {
          this.pageArray.push([])
        }
        this.firstChangePage = false
      }
      setTimeout(() => {
        // 翻页后判断本页是否已经全选
        if (this.judgePageSelectAll()) {
          this.pageArray[this.currentPage - 1] = this.$refs.dataTable.list
        }
      }, 500)
    },
    // 翻页后显示勾选行
    showChecked(row) {
      this.selectedDataArr.forEach((item) => {
        if (row[this.rowIdFlag] === item[this.rowIdFlag]) {
          row._isChecked = true
        }
      })
    },
    // 勾选某一行
    selectOne(selection, row) {
      this.selectedDataArr.push(row)
      // 如果单选后导致页面全选,就调用一次全选,打开全选标志
      if (selection.length === this.$refs.dataTable.list.length) {
        this.selectAll(selection)
      }
    },
    // 取消某行的选择
    cancelSelect(selection, row) {
      // 取消某项选择后此页肯定为非全选状态,清空本页面全选记录数组内的指标
      this.pageArray[this.currentPage - 1] = []
      // 从数组中删掉这个指标,
      this.selectedDataArr.forEach((item, index) => {
        if (item[this.rowIdFlag] === row[this.rowIdFlag]) {
          this.selectedDataArr.splice(index, 1)
        }
      })
    },
    // 全选本页面数据
    selectAll(selection) {
      let tempArr = []
      // 全选后过滤出本页全选前的未选数据,防止已选数据数组中对象重复
      this.selectedDataArr.forEach((item) => {
        if (selection.filter(each => each[this.rowIdFlag] === item[this.rowIdFlag]).length === 0) {
          tempArr.push(item)
        }
      })
      // 合并全选后的已选数据数组(无重复项)
      this.selectedDataArr = selection.concat(tempArr)
      // 少量延时后将本业全选的数据全部放入全选记录数组,若不延时会触发selectChange函数的if执行
      setTimeout(() => {
        this.pageArray[this.currentPage - 1] = selection
      }, 500)
    },
    // 选择项发生变化时触发,规定它仅在全选后点击反选才有效
    selectChange() {
      if (this.pageArray[this.currentPage - 1].length === this.$refs.dataTable.list.length) {
        this.pageArray[this.currentPage - 1].forEach((item) => {
          this.selectedDataArr.forEach((v, index) => {
            if (v[this.rowIdFlag] === item[this.rowIdFlag]) {
              this.selectedDataArr.splice(index, 1)
            }
          })
        })
        this.pageArray[this.currentPage - 1] = []
      }
    },
  }
}
