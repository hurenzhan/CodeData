<template>
  <div class="tableWrap" :id="activeTabName">
    <slot>

    </slot>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
      ...mapState('navTabs',[
          'activeTabName'
      ])
  },
  mounted () {
    this.calculateTabTableHeight()
    this.scrollPaneFunc()
  },
  updated () {
    this.calculateTabTableHeight()
    let that = this
    window.onresize = function () {
      that.calculateTabTableHeight()
    }
  },
  methods: {
    ...mapMutations('navTabs', ['setTabTableHeight']),
    calculateTabTableHeight () {
      let currentTab = document.getElementById('pane-' + this.activeTabName)
      let contentHeight = document.getElementsByClassName('content')[0].offsetHeight
      let topHeight = currentTab.getElementsByClassName('tableWrap').length > 0 ? currentTab.getElementsByClassName('tableWrap')[0].offsetTop : 0
      let bottomHeight = 77
      let tabTableHeight = contentHeight - topHeight - bottomHeight
      this.setTabTableHeight(tabTableHeight)
    },
    scrollPaneFunc () {
      let scrollPane = document.getElementsByClassName('el-tabs__content')[0]
      let that = this

      scrollPane.onscroll = function () {
        let paneTop = scrollPane.scrollTop
        if (document.getElementById(that.activeTabName) !== null) {
          let currentPane = document.getElementById('pane-' + that.activeTabName)
          let table = currentPane.getElementsByClassName('tableWrap')[0]
          if (currentPane.getElementsByClassName('el-table__header-wrapper').length > 0) {
            let tableHeader = currentPane.getElementsByClassName('el-table__header-wrapper')[0]
            if (paneTop > table.offsetTop) {
              tableHeader.style.position = 'fixed'
              tableHeader.style.top = '66px'
              tableHeader.style.zIndex = 1
            } else {
              tableHeader.removeAttribute('style')
            }
          }

          // if (currentPane.getElementsByClassName('widthTableHeader').length > 0) {
          //   let widthTableHeader = currentPane.getElementsByClassName('widthTableHeader')[0]
          //   if (paneTop > table.offsetTop) {
          //     widthTableHeader.style.position = 'fixed'
          //     widthTableHeader.style.top = '66px'
          //     widthTableHeader.style.left = '173px'
          //   } else {
          //     widthTableHeader.removeAttribute('style')
          //   }
          // }
        }
      }
    }
  }
}
</script>
