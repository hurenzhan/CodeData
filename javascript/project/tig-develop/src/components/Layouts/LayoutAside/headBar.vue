<template>
  <div>
    <header class="header">
      <img class="logo" src="/static/design/logo2.png" alt="logo">
      <Menu class="visible-nav" mode="horizontal" theme="dark">
        <Submenu  name="table">
          <template slot="title" >
            <span style="color: #fff">报表</span>
          </template>
          <!-- <MenuItem name="tableManage" @click.native="goTo('/tableManage')">
            <img src="/static/charts/images/elecTable.svg" alt="elec"/>电子表格
          </MenuItem> -->
          <MenuItem name="tableManage2" @click.native="goTo('/tableCharts')">
            <img src="/static/charts/images/visionable.svg" alt="vision"/>可视化
          </MenuItem>
          <MenuItem name="tableManage3" @click.native="goMobileDesign()">
            <img src="/static/charts/images/visionable.svg" alt="vision"/>移动端
          </MenuItem>
        </Submenu>
        <Submenu name="monitor">
          <template slot="title">
            <span style="color: #fff">监控</span>
          </template>
          <MenuItem name="reportMonitor" @click.native="goTo('/monitor/use')">
            <img src="/static/charts/images/usageStatic.svg" alt="usage">使用统计
          </MenuItem>
          <MenuItem name="reportMonitor2" @click.native="goTo('/monitor/visit')">
            <img src="/static/charts/images/visitStatic.svg" alt="visite">访问统计
          </MenuItem>
          <MenuItem name="reportMonitor3"  @click.native="goTo('/monitor/exp')">
            <img src="/static/charts/images/tableExport.svg" alt="export">报表导出
          </MenuItem>
        </Submenu>
        <Submenu name="system">
          <template slot="title">
            <span style="color: #fff">系统</span>
          </template>
          <MenuItem name="userManage" @click.native="goTo('/userManage')">
            <img src="/static/charts/images/userManage.svg" alt="userManage">用户管理
          </MenuItem>
          <MenuItem name="systemManage" @click.native="goTo('/systemManage')">
            <img src="/static/charts/images/systemManage.svg" alt="systemManage">主系统管理
          </MenuItem>
        </Submenu>
      </Menu>
      <div class="user-info">
        <span  style="color: #fff" v-text="userName"></span>
        <Button style="color: #fff; font-size: 14px;" type="text" @click="logout">注销</Button>
      </div>
    </header>
  </div>
</template>

<script>
import config from '@/env'

export default {
  props: {
    userName: {
      type: String
    },
    userCode: {
      type: String
    }
  },
  methods: {
    goMobileDesign() {
      // window.location.href = config.mobileDesign
      // window.open(config.mobileDesign + '?systemId=' + this.$route.query.systemId, '_blank');
      let systemId = this.$store.state.design.systemId
      window.open(config.mobileDesign + '?systemId=' + systemId, '_blank')
    },
    goTo(path) {
      this.$router.push(path)
    },
    logout() {
      location.href = config.dataCloud
    }
  }
}
</script>

<style lang="less" scoped>
@import "./default.less";
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: @primary-color;
  width: 100%;
  .logo {
    height: 29px;
    margin-left: 32px;
  }
  .user-info {
    font-size: 14px;
    margin-right: .20rem;
    display: flex;
    align-items: center;
    white-space:nowrap;
    img {
      width: .32rem;
      height: .32rem;
      border-radius: 50%;
    }
  }
  ul.ivu-menu-horizontal {
    height: 50px;
    line-height: 50px;
    min-width: 414px;
    display: flex;
    justify-content: space-around;
  }
  ul.ivu-menu-drop-list li.ivu-menu-item-selected {
    background-color: rgba(51, 166, 255, 0.15) !important;
    color: #000000 !important;
  }
  ul.ivu-menu-drop-list li.ivu-menu-item:hover {
    background-color: rgba(51, 166, 255, 0.15) !important;
  }
  ul.ivu-menu-drop-list li.ivu-menu-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  ul.ivu-menu-drop-list li.ivu-menu-item img {
    margin-right: 8.5px;
  }
}
</style>
<style lang="less">
  div.wrapper {
    overflow: hidden;
  }
  .header {
    ul.visible-nav {
      div.ivu-menu-submenu-title>i.ivu-icon {
        display: none !important;
      }
      // margin-left: 200px;
      // flex: 1;
      background: #51A6FF;
      color: #fff;
      li.ivu-menu-submenu {
        padding-left: 0px;
        padding-right: 0px;
        // margin-right: 110px;
      }
    }
  }
</style>
