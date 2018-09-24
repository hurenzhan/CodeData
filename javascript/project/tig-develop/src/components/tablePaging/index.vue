<template>
  <div>
    <div class="u-tableList1 my-slide-bar">
      <Table
        ref="table"
        :width="width"
        :border="border"
        class="table-content"
        @on-select="onSingleSelectChange"
        @on-selection-change="onSelectChange"
        @on-select-cancel="onSingleSelectCancel"
        @on-select-all="onSelectAll"
        :row-class-name="show" :columns="columns"
        :data="list"
        :loading="loading"
      >
        <template slot="loading" v-if="loading">
          <slot>加载中</slot>
        </template>
      </Table>
    </div>
    <div class="pageWrapper1" v-if="paging && list.length > 0">
      <span>
        当前 {{ offset + 1 }} - {{ offset + list.length }} 条 共 {{ total }} 条 每页展示
        <Input v-model.number="limit" class="paging-limit" size="small" @on-enter="limitChange" /> 条
      </span>
      <span style="float:right;">
        <Button type="text" @click="pagePre" :disabled="this.page === 1">上一页</Button>
        <span class="mr-10" v-text="page + '/' + pageTotal"></span>
        <Button type="text" @click="pageNext" :disabled="this.page === this.pageTotal">下一页</Button>
        <span class="mr-10">跳转至</span>
        <Input v-model="tempPage" class="paging-limit mr-10" size="small" @on-enter="pageChange" />
        <span>页</span>
      </span>
    </div>
  </div>
</template>

<script>
import axios from '@/web-design/api'

export default {
  data() {
    return {
      notePad: false,
      list: [],
      localData: [],
      total: 0,
      page: 1,
      tempPage: 1,
      pageTotal: 1,
      limit: 10,
      offset: 0,
      radioId: '',
      sortKey: '', // 本地分页排序的字段名称
    }
  },
  props: {
    loading: false,
    width: '',
    show: {
      type: Function,
      default() {
        return ''
      }
    },
    // 列配置
    columns: {
      default() {
        return []
      }
    },
    // 假数据
    data: {
      default() {
        return []
      }
    },
    // axios 配置
    ajax: {
      default() {
        return {}
      }
    },
    // 单选配置
    radio: {
      default() {
        return {
          use: false,
          key: 'id'
        }
      }
    },
    paging: { // 分页配置
      default: true
    },
    type: { // 表格类型， 1 data 本地模拟数据分页  2 ajax 远程分页 3 ajax 获取数据，本地分页
      default: 1
    },
    // 边框
    border: {
      default: false
    }
  },
  mounted() {
    // 初始化时判断屏幕宽度,确定表格初始显示显示条数
    this.detectWindow()
    if (this.radio.use) {
      this.configRadio()
    }
    this.search()
    // 浏览器尺寸变化时监听宽度,笔记本尺寸时默认限制6条显示
    window.onresize = () => {
      this.detectWindow()
    }
  },
  watch: {
    // 当窗口尺寸切换为笔记本尺寸或台式机尺寸时触发默认条数显示改变,刷新列表
    notePad() {
      this.search()
    }
  },
  methods: {
    // 侦测窗口尺寸, 可视区域高度小于710时显示7条
    detectWindow() {
      this.notePad = document.body.clientHeight >= 710 ? false : true
      this.limit = this.notePad ? 7 : 10
    },
    // 设置页数和offset
    search() {
      switch (this.type) {
        case 2: this.remotePaging()
          break
        case 3: this.remoteLoaclPaging()
          break
        case 1: this.localPaging()
          break
        default: this.localPaging()
      }
    },
    //  设置页数和offset, 判断表格类型
    judgeType(page, limit) {
      if (limit) {
        this.limit = limit
      }
      if (page) {
        this.page = page
        this.offset = (this.page - 1) * this.limit
      } else {
        this.page = 1
        this.offset = 0
      }
      this.search()
    },
    // 本地分页
    localPaging() {
      this.localData = this.data
      this.total = this.data.length
      this.opLocalPaging()
    },
    // 远程分页
    async remotePaging() {
      const params = Object.assign(this.ajax.params || {}, {
        limit: this.limit || 20,
        offset: this.offset
      })
      const body = Object.assign(this.ajax.body || {}, {
        limit: this.limit || 20,
        offset: this.offset
      })
      const res = await axios.request({
        url: this.ajax.url,
        method: this.ajax.methods || 'get',
        params,
        data: body || {}
      })
      if (!res) return
      this.list = (res && res.data) || []
      this.total = (res && res.total) || 0
      this.$emit('total', res.total)
      // 数据加载完成的钩子
      this.$emit('dataLoaded', res.data)
      this.$emit('update:loading', false)
      this.getPageTotal()
      // 数据加载完成，检查下有否数据
      this.checkData()
    },
    async remoteLoaclPaging() {
      const params = Object.assign(this.ajax.params || {}, {
        limit: this.limit,
        offset: this.offset
      })
      const res = await axios.request({
        url: this.ajax.url,
        method: this.ajax.methods || 'get',
        params,
        data: this.ajax.body || {}
      })
      if (!res) return
      this.localData = (res && res.data) || []
      this.total = (res && res.total) || 0
      // 本地分页若设置排序方式, 需要进行本地数组内容排序,未设置不影响
      this.localData = this.sortLocalDataArray(this.localData)
      this.opLocalPaging()
    },
    // 对目标数组进行排序,返回一个排序后的数组
    sortLocalDataArray(arr) {
      if (arr.length === 0) {
        return arr
      }
      // 是否需要手动排序
      let flag = false
      let sortType = ''
      this.columns.forEach((item) => {
        if (item.sortType) {
          flag = true
          sortType = item.sortType
          this.sortKey = item.key
        }
      })
      if (flag) {
        if (sortType === 'desc') {
          arr.sort(this.descSort)
        } else {
          arr.sort(this.ascSort)
        }
      }
      return arr
    },
    // 降序
    descSort(a, b) {
      const timeA = new Date(a[this.sortKey]).valueOf()
      const timeB = new Date(b[this.sortKey]).valueOf()
      return timeB - timeA
    },
    // 升序
    ascSort(a, b) {
      const timeA = new Date(a[this.sortKey]).valueOf()
      const timeB = new Date(b[this.sortKey]).valueOf()
      return timeA - timeB
    },
    // 本地分页操作
    opLocalPaging() {
      this.getPageTotal()
      switch (Number(this.type)) {
        case 2: this.remotePaging()
          break
        case 1:
        case 3:
        default: this.list = this.localData.slice(this.offset, this.offset + this.limit)
      }
    },
    // 切换页码
    pageChange() {
      if (!Number.isInteger(Number(this.tempPage)) || Number(this.tempPage) <= 0) {
        this.$Message.info('页码必须输入正整数')
        this.tempPage = 1
      }
      if (Number(this.tempPage) > this.pageTotal) {
        this.$Message.info('页码超出最大值')
        this.tempPage = this.pageTotal
      }
      this.page = this.tempPage
      this.offset = (this.page - 1) * this.limit
      // this.$emit('page', this.page)
      this.opLocalPaging()
      this.$emit('tableChangePage', this.page, this.total, this.limit)
    },
    pagePre() {
      if (this.page > 1) {
        this.page = Number(this.page) - 1
        this.tempPage = this.page
        this.pageChange()
      }
      // this.$emit('tableChangePage', this.page, this.total, this.limit)
    },
    pageNext() {
      if (this.page < this.pageTotal) {
        this.page = Number(this.page) + 1
        this.tempPage = this.page
        this.pageChange()
        // this.$emit('tableChangePage', this.page, this.total, this.limit)
      }
    },
    // 计算总页数
    getPageTotal() {
      this.pageTotal = Math.ceil(this.total / this.limit)
    },
    // 切换条数据
    limitChange() {
      if (!Number.isInteger(this.limit) || this.limit <= 0) {
        this.$Message.info('页码必须输入正整数')
        // 当输入不合规则时根据当前屏幕尺寸来决定limit的值
        this.limit = this.notePad ? 7 : 10
      } else if (!Number.isInteger(this.limit) || this.limit > this.total) {
        this.limit = this.total
      }
      // 当limit变化时也改变notepad的值, 否则自动侦测屏幕可能失效
      if (this.limit > 7) {
        this.notePad = false
      } else {
        this.notePad = true
      }
      this.getPageTotal()
      this.page = 1
      this.offset = 0
      this.$emit('limit', this.limit)
      this.opLocalPaging()
      this.$emit('tableChangePage', this.page, this.total, this.limit)
    },
    // radio
    configRadio() {
      this.columns.unshift({
        title: ' ',
        key: 'radio',
        width: '70',
        render: (h, params) => {
          let bool = false
          if (params.row[this.radioKey] === this.radioId) {
            bool = true
          }
          return h('Radio', {
            props: {
              value: bool
            },
            on: {
              'on-change': (val) => {
                if (val) {
                  this.radioId = params.row[this.radioKey]
                  this.$emit('on-radio', params.row[this.radioKey])
                }
              }
            }
          })
        },
      })
    },
    // 多选选中项改变时调用,selection是已被选中的项
    onSelectChange(selection) {
      this.$emit('on-select-change', selection)
    },
    // 多选情况下，选中某一项触发, selection已选数据，row刚选择的数据
    onSingleSelectChange(selection, row) {
      this.$emit('on-select', selection, row)
    },
    // 多选情况下,取消选中某一项触发, selection已选数据, row刚取消选择的数据
    onSingleSelectCancel(selection, row) {
      this.$emit('on-select-cancel', selection, row)
    },
    // 点击全选时触发, selection已选项
    onSelectAll(selection) {
      this.$emit('on-select-all', selection)
    },
    // 判断是否有值，没有值的话，取消全选按钮,fixed bug TIG-465
    checkData() {
      const checkAllBox = document.querySelector('thead tr th input[type=checkbox]')
      if (!checkAllBox) return
      if (this.list.length) {
        checkAllBox.disabled = false
      } else {
        checkAllBox.disabled = true
      }
    }
  }
}
</script>

<style lang="less">
.u-tableList1 {
  overflow: auto;
  .ivu-table-wrapper {
    border: none;
    position: static;
    margin-top: 16px !important;
  }
  .ivu-table-header {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    height: 48px;
    line-height: 48px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-family: 'PingFangSC-Medium';
    background: rgba(0, 0, 0, 0.02);
  }
  .ivu-table td {
    border-bottom: .01rem dashed #f5f5f5;
    font-size: 14px;
    min-height: 38px;
    height: 38px;
    box-sizing: border-box;
    padding-top: 6px;
    padding-bottom: 6px;
    line-height: 22px;
  }
  .ivu-table:after,
  .ivu-table:before {
    display: none;
  }
}
// 限制表头文字不换行,防止表头沉降
.table-content th .ivu-table-cell span{
  // height: 60px !important;
  white-space: nowrap;
}
.pageWrapper1 {
  >span>div.paging-limit input {
    font-family: 'PingFangSC-Regular';
    font-size: 14px;
    text-align: center;
  }
}
</style>

<style lang="less" scoped>
.paging-limit {
  width: .41rem;
  input.ivu-input.ivu-input-small {
    text-align: center;
  }
}

.table-content {
  margin: .2rem 0;
  min-width: 1000px;
}

.pageWrapper1 {
  width: 100%;
  font-size: 14px;
  font-family: 'PingFangSC-Regular';
  color: rgba(0, 0, 0, 0.45);
  height: .6rem;
  line-height: .6rem;
  background: #F5F5F5;
  box-sizing: border-box;
  padding: 0 51px;
  .ivu-page {
    float: right;
  }
  >ul>li {
    background: none;
  }
  .ivu-page-item-active a,
  .ivu-page-item-active:hover a {
    color: #2580ff;
  }
  button.ivu-btn-text:focus {
    box-shadow: none;
  }
  >span button{
    font-size: 14px;
  }
}

/*自定义浏览器滑块*/

</style>
