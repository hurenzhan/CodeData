<template>
  <div>
    <search @select="selected" :ty="ty" @freezeBtn="freezeBtn"></search>
    <table-paging ref="table" :columns="followed == 1 ? columns : column" :ajax="getListajax" :type="2" @on-select-change="selectChange">
    </table-paging>
  </div>
</template>

<script>
import system from '@/web-design/api/system'
  import search from './search'

  export default {
    data() {
      return {
        staffIds: {
          default() {
            return []
          }
        },
        columns: [
          {
            title: '工号/姓名',
            key: 'staffId',
            width: 200,
            render: (h, params) =>
              h('div', [
                h('p', {
                  class: 'report-name not-link'
                }, params.row.name),
                h('p', {
                  class: 'report-id'
                }, params.row.staffId)
              ], params.row.name)
          },
          {
            title: '产业',
            key: 'industry',
            width: 500
          },
          {
            title: '部门',
            key: 'orgName'
          },
          {
            title: '用户组',
            key: 'groupName'
          },
          // {
          //   title: '角色',
          //   key: 'roleName'
          // }
        ],
        column: [
          {
            title: '工号/姓名',
            key: 'staffId',
            width: 200,
            render: (h, params) =>
              h('div', [
                h('p', {
                  class: 'report-name not-link'
                }, params.row.name),
                h('p', {
                  class: 'report-id'
                }, params.row.staffId)
              ], params.row.name)
          },
          {
            title: '部门',
            key: 'orgName',
            width: 500
          },
          {
            title: '职位',
            key: 'postName'
          },
          // {
          //   title: '角色',
          //   key: 'roleName'
          // },
          {
            title: '主系统',
            key: 'systemName',
            className: 'systemName',
            render: (h, params) => (
              h('p', {
                class: 'report-name not-link',
                style: {
                  color: '#495060'
                },
                attrs: {
                  title: params.row.systemName
                },
              }, params.row.systemName)
            )
          }
        ],
        selArr: [],
        seltempArr: [],
      }
    },
    components: {
      search
    },
    props: {
      getListajax: {
        default() {
          return {}
        }
      },
      ty: {
        default() {
          return {}
        }
      },
      followed: {
        default() {
          return {}
        }
      }
    },
    mounted() {
    },
    methods: {
      selected(val) {
        this.getListajax.body = val
        this.$refs.table.judgeType()
      },
      freezeBtn() { // 整体冻结
        this.seltempArr = []
        for (let i = 0; i < this.selArr.length; i += 1) {
          this.seltempArr.push(this.selArr[i].staffId)
        }
        this.modifyUserFreezeFlag(this.seltempArr)
      },
      selectChange(val) {
        this.selArr = val
        // this.modifyUserFreezeFlag(val);
      },
      async modifyUserFreezeFlag(par) { // 冻结接口
        await system.modifyUserFreezeFlag(par)
      },
    }
  }
</script>

<style lang="less">
.report-name,
.report-id {
  font-size: 14px;
}
// .report-name {
//   margin-top: 6px;
// }
// .report-id {
//   margin-bottom: 6px;
// }
.ivu-table td.systemName p
{
  font-size: 14px;  
  // overflow:hidden;
  // text-overflow:ellipsis;
  // display:-webkit-box;
  // -webkit-box-orient:vertical;
  // -webkit-line-clamp:2;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
