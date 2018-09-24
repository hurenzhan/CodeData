<template>
  <div class="app bodySty">
    <page :currentPage="currentPage" class="firstPage">
      <div class="topBar">
        <div class="pageLogo">
          <img src="static/index/logo.png">
          <span>天工</span>
        </div>
        <ul class="index_link">
          <li>
            <a href="/develop.html" target="_blank">登录</a>
          </li>
        </ul>
      </div>
      <section class="animate textPos" ref="section1">
        <div class="firsText">
          <img src="static/index/text1.png">
        </div>
      </section>
    </page>
    <page :currentPage="currentPage">
      <section class="animate move-left textPos">
        <div class="secondText">
          <div>
            <p class="text-title">统一的数据分析门户</p>
            <p class="text-title">—</p>
            <p class="text-info">为用户提供统一的</p>
            <p class="text-info">看数门户</p>
            <p class="text-info">用户自定义</p>
            <p class="text-info">展示内容</p>
            <p class="text-info">方便用户快速查看到关注的指标</p>
            <p class="text-info">报表数据</p>
          </div>
        </div>
      </section>
    </page>
    <page :currentPage="currentPage">
      <section class="animate textPosT">
        <div class="thirdText">
          <div>
            <p class="text-title">便捷高效的报表开发</p>
            <p class="text-title">—</p>
            <p class="text-info">无SQL</p>
            <p class="text-info">拖拽式的操作</p>
            <p class="text-info">业务用户也可自助配置报表</p>
            <p class="text-info">简单的报表配置步骤</p>
            <p class="text-info">几分钟即可完成报表配置</p>
          </div>
        </div>
      </section>
    </page>
    <page :currentPage="currentPage">
      <section class="animate move-left textPosF">
        <div class="fourthText">
          <div>
            <p class="text-title">构建报表生态系统</p>
            <p class="text-title">—</p>
            <p class="text-info">规划报表体系</p>
            <p class="text-info">对报表进行全生命周期管理</p>
            <p class="text-info">建设报表市场</p>
            <p class="text-info">提供报表权限管控以及报表运营</p>
          </div>
        </div>
      </section>
    </page>
    <page-controller :pageNum="pageNum" :currentPage="currentPage" @changePage="changePage" :option="controllerOption">
    </page-controller>
  </div>
</template>

<script>
import env from '@/env'
import Page from './Page'
import PageController from './PageController'

// 页面进出动画
function afterEnterAnimate($child) {
  $child.$el.querySelector('.animate').classList.remove('move-left', 'move-right')
}
function beforeLeaveAnimate($child) {
  const moveType = Math.random() > 0.5 ? 'move-left' : 'move-right'
  $child.$el.querySelector('.animate').classList.add(moveType)
}

export default {
  data() {
    return {
      ssoLoginBussiness: env.ssoLoginBusiness,
      currentPage: 1,
      options: [{
        background: "url('static/index/banner1.jpg') no-repeat center center",
        color: '#fff',
        isCenter: false,
        afterEnter: afterEnterAnimate,
        beforeLeave: beforeLeaveAnimate
      }, {
        background: "url('static/index/banner2.jpg') no-repeat center center",
        color: '#fff',
        isCenter: false,
        afterEnter: afterEnterAnimate,
        beforeLeave: beforeLeaveAnimate
      }, {
        background: "url('static/index/banner3.jpg') no-repeat center center",
        color: '#fff',
        isCenter: false,
        afterEnter: afterEnterAnimate,
        beforeLeave: beforeLeaveAnimate
      }, {
        background: "url('static/index/banner4.jpg') no-repeat center center",
        color: '#fff',
        isCenter: false,
        afterEnter: afterEnterAnimate,
        beforeLeave: beforeLeaveAnimate
      }],
      controllerOption: {
        arrowsType: false, // 是否显示箭头
        navbar: true,
        highlight: true,
        loop: false // 是否循环
      }
    }
  },
  computed: {
    // 总page数
    pageNum() {
      return this.options.length
    }
  },
  methods: {
    changePage(index) {
      /* eslint-disable */
      // beforeLeave Hook
      const beforeIndex = this.currentPage - 1
      const leaveFunction = this.options[beforeIndex].beforeLeave
      typeof leaveFunction === 'function' && leaveFunction.call(this, this.$children[beforeIndex])
      // change page
      this.currentPage = index
      // afterEnter Hook
      const nextIndex = index - 1
      const enterFunction = this.options[nextIndex].afterEnter
      this.$nextTick(() => {
        typeof enterFunction === 'function' && enterFunction.call(this, this.$children[nextIndex])
      })
    }
  },
  components: {
    Page,
    PageController
  },
  mounted() {
    this.$children.forEach((child, index) => {
      // 动态设置各个page内的options
      if (child.option === null) {
        const childOption = this.options[index]
        this.$set(childOption, 'index', index + 1)
        child.option = childOption
      }
    })
  }
}
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
}
.app {
  height: 100%;
  width: 100%;
}
/* .bodySty { */
  /** firstPage-topBar,bg-position */

  /* text-position */

  /** 1440 */

  /** 1366 */

/* } */
.bodySty .firstPage {
  background-position-y: -5px !important;
  background-size: cover!important;
}
.bodySty .firstPage .topBar {
  width: 100%;
  height: 54px;
  background-color: #000;
  opacity: 0.64;
  font-size: 14px;
  line-height: 54px;
}
.bodySty .firstPage .topBar .pageLogo {
  height: 54px;
  float: left;
  font-size: 14px;
  margin-left: 360px;
}
.bodySty .firstPage .topBar .pageLogo img {
  vertical-align: middle;
  margin-right: 10px;
}
.bodySty .firstPage .topBar ul {
  float: right;
  margin-right: 200px;
}
.bodySty .firstPage .topBar ul li {
  float: left;
  margin-right: 50px;
}
.bodySty .firstPage .topBar ul li a {
  text-decoration: none;
}
.bodySty .textPos {
  text-align: center;
}
.bodySty .textPosT {
  text-align: right;
}
.bodySty .firsText {
  margin-top: 50px;
}
.bodySty .secondText {
  margin-top: 50px;
}
.bodySty .thirdText {
  margin-top: 50px;
  margin-right: 250px;
}
.bodySty .fourthText {
  margin-top: 50px;
  margin-left: 200px;
}
.bodySty .text-title {
  font-size: 28px;
  color: blue;
  font-family: ´微软雅黑´;
  background-image: -webkit-gradient(linear, left top, left bottom, from(#3e7eff), to(#8afffe));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.bodySty .text-info {
  font-size: 16px;
  color: #fff;
  margin-bottom: 10px;
}
@media screen and (min-width: 1366px) and (max-width: 1440px) {
  .bodySty .firsText img {
  width: 250px;
}

}
@media screen and (max-width: 1366px) {
  .bodySty .firsText {
  margin-top: 35px;
}
.bodySty .firsText img {
  width: 250px;
}
.bodySty .secondText {
  margin-top: 35px;
}
.bodySty .secondText img {
  height: 210px;
}
.bodySty .thirdText {
  margin-top: 50px;
  margin-right: 200px;
}

}
/* animate style */
.animate {
  transition: all 1s ease-out 0s;
}
.move-left {
  transform: translatex(-1000%);
  transition: all 1.5s ease-out 1s;
}
.move-right {
  transform: translatex(1000%);
  transition: all 1.5s ease-out 1s;
}
@media screen and (max-width: 768px) {
  html,
body {
  font-size: 12px;
}

}
a {
  text-decoration: none;
  color: inherit;
}
a:hover {
  text-decoration: underline;
  color: #51a6ff;
}

</style>

