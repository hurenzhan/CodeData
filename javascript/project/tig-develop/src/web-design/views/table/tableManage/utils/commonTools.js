/**
 * @name 通用工具类
 * @function 从电子表格版本管理和可视化版本管理页面中抽取的公共属性和方法
 * @description 直接以mixin方式引入使用即可
 */
import api from '../../../../api/versionManage'

export default {
  data() {
    return {
      dialogTableVisible: false,
      selectGroup: '', // 分组下拉框选择的值
      currentGroup: '', // 当前选择的分组
      searchKey: '', // 搜索框值
      operateObj: Object, // 当前用户操作的报表对象,带有报表id和切换的版本号
      newGroupNameArr: [], // 新增分组时筛选名称的数组
      groupLists: [], // 分组名列表
      tableData: [],
      editingGroupName: '', // 当前正在编辑的分组名称(编辑前的名字)
    }
  },
  mounted() {
    this.getGroupList();
  },
  methods: {
    groupChange() {
      this.getTableData.params.groupId = this.selectGroup
    },
    inputChange() {
      this.getTableData.params.searchKey = this.searchKey
    },
    // 获取报表分组列表
    async getGroupList() {
      const list = await api.queryReportGroupList()
      if (!list) return
      this.groupLists = list.data // 分组下拉列表
      this.groupLists = [].concat(list.data)
      // 给分组对象添加编辑标志
      // 注意此处不能直接遍历数组对象打点进行属性添加, 否则vue不响应这个属性的变化.
      this.groupLists = this.groupLists.map(item => {
        return {
          ...item,
          editFlag : false
        }
      })
    },
    // 查询
    searchClick() {
      this.$refs.dataTable.judgeType()
      // 查询新数据后也要进行全选判断,万一筛选出来的数据是全选的状态,就需要能触发反选
      if (this.judgePageSelectAll()) {
        this.pageArray[this.currentPage - 1] = [].concat(this.$refs.dataTable.list)
      }
    },
    // 分组弹出框点击取消
    cancelClick() {
      this.dialogTableVisible = false
    },
    // 分组弹出框点击确定
    enterClick() {
      this.dialogTableVisible = false
      // 当用户选择了一个分组时点击确定才发送请求
      if (this.currentGroup && this.selectedDataArr.length>0) {
        this.addReportToGroup()
      }
    },
    // 添加报表到分组
    async addReportToGroup() {
      const groupId = this.currentGroup
      const reportIdList = []
      this.selectedDataArr.forEach(item => {
        reportIdList.push(item.reportId)
      })
      const res = await api.addReportToGroup({
        groupId,
        reportIdList
      })
      if (!res) return
      if (res.statusCode === '0') {
        this.$Message.success('分组成功!')
        this.$refs.dataTable.judgeType(this.currentPage)
      }
    },
    // 新增分组名称
    addNewGroupName() {
      this.newGroupNameArr = [{
        reportGroupName: '未命名',
        reportGroupId: 9001,
        editFlag: true
      }, {
        reportGroupName: '未命名2',
        reportGroupId: 9002,
        editFlag: true
      }, {
        reportGroupName: '未命名3',
        reportGroupId: 9003,
        editFlag: true
      }, {
        reportGroupName: '未命名4',
        reportGroupId: 9004,
        editFlag: true
      }, {
        reportGroupName: '未命名5',
        reportGroupId: 9005,
        editFlag: true
      }]
      this.groupLists.forEach(item => {
        this.newGroupNameArr.forEach((item2, index) => {
          if (item.reportGroupName == item2.reportGroupName) {
            this.newGroupNameArr.splice(index, 1)
          }
        })
      })
      if (this.newGroupNameArr.length == 0) {
        this.$Message.info('未命名分组过多,请重新命名后再新建分组')
        return
      }
      
      this.groupLists.push(this.newGroupNameArr[0])
      setTimeout(() => {
        document.getElementById(this.newGroupNameArr[0].reportGroupId).focus()
      }, 100);
    },
    // 编辑分组名称
    editeClick(item) {
      // 进入编辑先获取编辑前的分组名称
      this.editingGroupName = item.reportGroupName
      item.editFlag = true
      setTimeout(() => {
        document.getElementById(item.reportGroupId).focus()
      }, 100)
    },
    // 输入框失去焦点
    async lostFocus(item) {
      item.editFlag = false
      // 更新分组列表
      var groupName = document.getElementById(item.reportGroupId).value
      var groupId = item.reportGroupId > 9000?'':item.reportGroupId
      // 名称为空或名称未修改的将不做处理
      if (groupName.length == 0) {
        this.groupLists.pop()
        return
      } 
      if (this.editingGroupName == groupName) {
        return
      }
      // groupId 存在说明是修改已有分组名称, 不存在说明是新增分组
      if (groupId) {
        // 修改分组名称
        const res = await api.groupRename({
          groupName,
          groupId
        })
        if (!res) return
        if (res.statusCode === '0') {
          this.$Message.success('名称修改成功!')
          this.getGroupList();
          this.$refs.dataTable.judgeType()
        }
      } else {
        // 新增报表分组
        const res = await api.addReportGroup({
          groupName
        })
        if (!res) {
          this.groupLists.pop()
          return
        }
        // 如果代码走到这里说明添加分组成功了
        this.$Message.success('分组添加成功!')
        this.getGroupList()
      }
    },
    // 删除分组名称
    async deleteClick(item) {
      const reportGroupId = item.reportGroupId
      this.currentGroup = reportGroupId == this.currentGroup?'':this.currentGroup
      const res = await api.deleteGroupName({
        reportGroupId
      })
      if (!res) return
      if (res.statusCode === '0') {
        this.$Message.success('删除成功!');
      } else {
        this.$Message.error('未能删除成功!')
      }
      this.getGroupList()
      if (this.selectGroup === reportGroupId) {
        this.selectGroup = ''
        this.groupChange()
      }
      this.$refs.dataTable.judgeType()
    }
  }
}
