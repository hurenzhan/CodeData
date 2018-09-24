<template>
  <div>
    <!--<Button type="primary" @click="createModal = true">新增</Button>-->
    <Row type="flex" justify="space-between">
        <Col>
            <!-- <Button type="default" v-if="ty==1" @click="freezeBtn">冻结</Button> -->
            <Select v-model="filter.industryId" style="width:220px;margin-right:12px;" placeholder="请选择产业" v-if="ty==1" @on-change="change" clearable filterable>
              <Option v-for="item in depart" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>

            <Select v-model="filter.groupId" style="width:220px;margin-right:12px;" placeholder="请选择用户组" v-if="ty==1" @on-change="change" clearable filterable>
              <Option v-for="item in user" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>

            <Select v-model="filter.roleId" style="width:220px;margin-right:12px;" placeholder="请选择角色" v-if="ty==1" @on-change="change" clearable filterable>
              <Option v-for="item in role" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>

            <Select v-model="filters.systemId" style="width:220px;margin-right:12px;" placeholder="请选择主系统" v-if="ty==2" @on-change="changes" clearable filterable>
              <Option v-for="item in part" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </Col>
         <Col v-if="ty==1" class="searchWra">
            <Input v-model="filter.searchKey" icon="ios-search" placeholder="工号/姓名搜索"  style="width: 200px" @on-change="change"></Input>
        </Col>
        <Col v-if="ty==2" class="searchWra">
            <Input v-model="filters.searchKey" icon="ios-search" placeholder="工号/姓名搜索"  style="width: 200px" @on-change="changes"></Input>
        </Col>
    </Row>
  </div>
</template>

<script>
import system from '@/web-design/api/system'
import systemAdmin from '@/web-design/api/system'

export default {
  data() {
    return {
      filter: {
        industryId: '',
        groupId: '',
        roleId: '',
        searchKey: ''
      },
      filters: {
        systemId: '',
        searchKey: ''
      },
      depart: [],
      user: [],
      role: [],
      part: [],
    }
  },
  methods: {
    change() {
      this.$emit('select', this.filter)
    },
    changes() {
      this.$emit('select', this.filters)
    },
    async querySysInfo(par) { // 支持的主系统
      const data = await system.querySysInfo(par)
      for (let i = 0; i < data.data.length; i += 1) {
        this.part.push({
          value: data.data[i].systemId,
          label: data.data[i].systemNm
        })
      }
    },
    async roleDownList(par) { // 角色下拉框
      const data = await systemAdmin.roleDownList(par)
      for (let i = 0; i < data.data.length; i += 1) {
        this.role.push({
          value: data.data[i].roleId,
          label: data.data[i].roleName
        })
      }
    },
    async industryDownList(par) { // 产业下拉框
      const data = await systemAdmin.industryDownList(par)
      for (let i = 0; i < data.data.length; i += 1) {
        this.depart.push({
          value: data.data[i].valueId,
          label: data.data[i].name
        })
      }
    },
    async groupDownList(par) { // 用户组下拉框
      const data = await systemAdmin.groupDownList(par)
      for (let i = 0; i < data.data.length; i += 1) {
        this.user.push({
          value: data.data[i].code,
          label: data.data[i].name
        })
      }
    },
  },
  mounted() {
    this.$emit('select', '')
    if (this.ty === 1) {
      this.groupDownList()
      this.industryDownList()
      this.roleDownList()
    } else {
      this.querySysInfo()
    }
  },
  props: {
    ty: {
      default: ''
    }
  }
}
</script>

<style lang="less">
.searchWra {
  .ivu-input-wrapper {
    margin-bottom: -10px;
  }
  .ivu-input-icon-normal + .ivu-input {
      padding-left: 32px;
    }
    .ivu-input-icon {
      left: 0;
    }
}
</style>
