<template>
  <div class="sidebar-wrapper">
    <Row>
      <Col span="8">
      <Menu theme="dark" accordion>
        <Submenu name="1" v-for="item of menuList" :key="item.name">
          <template slot="title">
            <Icon :type="item.icon"></Icon>
            {{item.text}}
          </template>
          <router-link :name="childItem.url" :to="childItem.url" v-for="childItem in item.children" :key="childItem.name">
            <MenuItem :name="childItem.url">{{ childItem.text }}</MenuItem>
          </router-link>
        </Submenu>
      </Menu>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuList: [ {
      "id" : "m1",
      "icon" : "android-stopwatch",
      "text" : "监控",
      "url" : "",
      "children" : [ {
        "id" : "m1-c1",
        "icon" : "",
        "text" : "报表监控",
        "url" : "/reportMonitor"
      } ]
    }, {
      "id" : "m2",
      "icon" : "ios-copy-outline",
      "text" : "报表",
      "url" : "",
      "children" : [ {
        "id" : "m2-c1",
        "icon" : "",
        "text" : "报表管理",
        "url" : "/tableManage"
      }, {
        "id" : "m2-c2",
        "icon" : "",
        "text" : "创建自定义报表",
        "url" : "/tableCreate"
      } ]
    }, {
      "id" : "m4",
      "icon" : "ios-gear",
      "text" : "系统",
      "url" : "",
      "children" : [ {
        "id" : "m4-c1",
        "icon" : "",
        "text" : "用户管理",
        "url" : "/userManage"
      }, {
        "id" : "m4-c3",
        "icon" : "",
        "text" : "主系统管理",
        "url" : "/systemManage"
      } ]
    } ]
    }
  },
  computed: {
    tmpUrl() {
      return this.$route.path
    }
  },
  // mounted() {
  //   this.preventMenuReset()
  // },
  methods: {
    // 每次f5刷新(或者跳转路由)后，菜单会重置，这里hack一下,
    // 理想时间设置为49ms，但是有些浏览器时间太短获取不到dom，这里设置100ms
    preventMenuReset() {
      setTimeout(() => {
        const tmpUrl = this.$route.path
        // 路由在黑名字里（不在菜单里），直接跳出,这个黑名单需要维护
        if (blacklist.includes(tmpUrl)) return
        // 创建流程flowCreate需要判断到flowType（只有5在菜单里，不是5直接跳出）
        if (this.tmpUrl === '/flowCreate') {
          if (this.$route.query.flowType !== '5') {
            return
          }
        }
        document.querySelector(`a[href^='#${tmpUrl}']`).parentNode.parentNode.firstChild.click()
        document.querySelector(`a[href^='#${tmpUrl}'] li`).click()
      }, 150)
    }
  },
  watch: {
    // 路由跳转，菜单会重置，hack
    tmpUrl() {
      // 路由在黑名字里（不在菜单里），直接跳出,这个黑名单需要维护
      if (blacklist.includes(this.tmpUrl)) return
      // 创建流程flowCreate需要判断到flowType（只有5在菜单里，不是5直接跳出）
      if (this.tmpUrl === '/flowCreate') {
        if (this.$route.query.flowType !== '5') {
          return
        }
      }
      const firstMenuActiveFlag = Array.from(document.querySelector(`a[href^='#${this.tmpUrl}']`).parentNode.parentNode.classList).includes('ivu-menu-opened')
      const secondMenuActiveFlag = Array.from(document.querySelector(`a[href^='#${this.tmpUrl}'] li`).classList).includes('ivu-menu-item-selected')
      if (!firstMenuActiveFlag) {
        document.querySelector(`a[href^='#${this.tmpUrl}']`).parentNode.parentNode.firstChild.click()
      }
      if (!secondMenuActiveFlag) {
        document.querySelector(`a[href^='#${this.tmpUrl}'] li`).click()
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./default.less";
@bg-color: #4B4D4E;
@select-color: #424444;
@active-link-color: @primary-color;
.sidebar-wrapper {
  height: 100%;
  float: left;
  background-color: @bg-color;
  padding-top: 28px;
}

.ivu-menu-dark {
  background-color: @bg-color;
}

.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title {
  background-color: @select-color;
}

.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened {
  background-color: @bg-color;
}

.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active,
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover {
  background: @select-color !important;
  &::after {
    content: '';
    display: block;
    width: 3px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: @active-link-color;
  }
}
  /*导航a*/
  a{
    display: block;
    position: relative;
  }
</style>
<!--<style>
  .router-link-active{
    background: #424444 !important;
  }
  .router-link-active:after{
    content: '';
    display: block;
    width: 3px;
    height: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #51A6FF;
  }
</style>-->
