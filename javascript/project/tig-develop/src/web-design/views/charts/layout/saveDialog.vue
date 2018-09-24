<template>
  <el-dialog
    :visible="value"
    :show-close="false">
    <div slot="title" class="save-title">
      <p>
        <span>保存</span>
        <span>*请选择维度权限再保存</span>
      </p>
      <i class="el-icon-close" @click="close"></i>
    </div>
    <div>
      <el-checkbox
        v-for="(item, index) in dimensionLimit"
        :key="index"
        :checked="item.value"
        @change="change(index, $event)"
      >
        {{item.name}}
      </el-checkbox>
    </div>
    <div slot="footer" class="save-footer">
      <el-button size="mini" type="primary" @click="save">保存</el-button>
      <el-button size="mini" @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import api from '../../../api/charts'
  export default {
    name: 'SaveDialog',
    props: ['value'],
    data () {
      return {}
    },
    computed: {
      dimensionLimit () {
        return this.$store.state.charts.dimensionLimit
      }
    },
    methods: {
      close () {
        this.$store.commit('saveDialogToggle', false)
      },
      change (index, value) {
        this.$store.commit('dimensionLimitChange', {
          index,
          value
        })
      },
      async save () {
        const res = await api.save({
          versionId: '', // 首次保存这里的两个id怎么处理
          reportId: '',
          reportDesc: '',
          reportName: '',
          reportType: 1,
          reportContent: '123'
        })
        res.statusCode === '0' && this.close()
      }
    }
  }
</script>

<style lang="less">
  .save-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
