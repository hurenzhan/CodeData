<template>
  <div class="add-panel">
    <div class="add-panel-item" v-for="(item, index) in category" :key="index">
      <el-tooltip effect="dark" placement="bottom" popper-class="add-popper" :content="'添加'+ item.name">
        <el-button @click.stop="add(item.id)">
          <span class="img" :icon="item.icon" :style="getBackground(item.icon)"></span>
        </el-button>
      </el-tooltip>
      <span>{{item.name}}</span>
    </div>
  </div>
</template>

<script>
  import {containerCategory} from '../../static/configData'
  import addPanel from '../../layout/mixins/addPanelMixin'
  export default {
    name: 'TabAddPanel',
    mixins: [addPanel],
    data () {
      return {
        category: containerCategory.filter(item => item.id !== 3)
      }
    },
    props: [
      'containerIndex', // 当前第几个容器
      'tabIndex' // 当前tab页index
    ],
    methods: {
      add (id) {
        this.$store.commit('addContainer', {
          id,
          tabContainerIndex: this.containerIndex, // 有了这两个字段，代表是从tab容器添加的
          activeTabIndex: this.tabIndex
        })
      }
    }
  }
</script>
