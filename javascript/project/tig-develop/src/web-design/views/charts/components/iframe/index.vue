<template>
  <div class="iframe-assembly">
    <div class="left-iframe" ref="mycontainer" v-loading="iframeLoading">
      <div class="iframe-content-wrap">
          <iframe src="" frameborder="0" :id="iframeId" scrolling="yes" allowfullscreen="true"
          width="100%" height="100%" @load="load">
          </iframe>
      </div>
    </div>
  </div>
</template>
<script>
import { containerInit } from "../../static/configData";
import bus from "../../utils/eventBus";

export default {
  name: "iframeInfo",
  data() {
    return {
      iframeLoading: false
    };
  },
  components: {},
  props: ["index"],
  mixins: [],
  computed: {
    // 获取vuex公共数据,展示联动
    option() {
      return this.$store.state.charts.chartsOption[this.index];
    },
    // 是否显示标题栏
    isShowTab() {
      return this.option.nameToggle;
    },
    iframeId() {
      return  "iframe_"+this.option.i;
    },
    iframeContent() {
      return this.option.feature.iframeContent;
    },
    iframeHeight() {
      return this.option.feature.iframeHeight;
    }
  },
  watch: {
    iframeContent() {
      this.setIframeSrc();
    }
  },
  mounted() {
    
    this.iframeOnClick();
    // 初始化加载已保存的iframeSrc
    this.setIframeSrc();
    //监听定制化页面是否准备好
    window.addEventListener("message", this.receiveMessage, false);
    // 监听拖拽
    bus.$on(`resizeOrMove_${this.index}`, obj => {

    });
    // 关联查询面板，获取查询条件处理后发送给定制化页面
    bus.$on(`updateQuery_${this.index}`, obj => {
      // console.log(obj);
      const url = this.iframeContent;
      let data = ""
      let domain = url.split('/')
      if(domain[3] === "private.html"){
        data = this.packDataZgxz(obj)
      }else{
        this.$message('请正确输入定制化页面url链接')
      }
      // console.log(data)
      const newData = JSON.stringify(data);
      this.sendIframeMessege(newData, url);
    });
  },
  beforeDestroy() {
    bus.$off(`resizeOrMove_${this.index}`);
    bus.$off(`updateQuery_${this.index}`);
  },
  methods: {
    //监听iframe子页面点击事件,选中容器 
    iframeOnClick() {
      let ifra = document.getElementById(this.iframeId);
      ifra.contentWindow.addEventListener("click", function() {
        ifra.click();
      });
    },
    // iframe onload 加载完成执行load
    load() {
      this.iframeLoading = false;
      this.iframeOnClick();
    },
    setIframeSrc() {
      if (location.href === this.iframeContent) {
        this.$message('iframe暂不支持自身加载！')
        return false
      }
      setTimeout(() => {
        this.iframeSrc();
      }, 5);
    },
    // 设置iframe.src
    iframeSrc() {
      let ifra = document.getElementById(this.iframeId);
      let url = this.iframeContent;
      // let domain = url.split('/')
      // if(domain[2] && domain[2] !== location.hostname){
      //   this.$message({
      //     message: "URL链接不符合要求，请重新输入",
      //     type:"warning"
      //   })
      //   return false
      // }
      ifra.src = url;
      this.iframeLoading = true;
      // 防止错误的url导致的长时间loading,设置若未正确加载关闭loading，则强制6秒后关闭
      setTimeout(() =>{ this.iframeLoading = false } ,6000)
    },
    // 定制化页面通信方法, 发送消息
    sendIframeMessege(data, url) {
      let ifra = document.getElementById(this.iframeId);
      if (url.length === 0) return;
      ifra.contentWindow.postMessage(data, url);
    },
    // 定制化页面通信方法, 接收消息
    receiveMessage(event) {
      // 我们能信任信息来源吗？
      if (event.origin.split("//")[1] !== location.hostname) {
        return false;
      }
      if (event.data && typeof event.data === "string") {
        // console.log(event.data)
        if (event.data === "zgds ready!") {
          // 通知查询面板准备完毕
          this.$store.commit("chartsReady", {
            index: this.index
          });
        }
      }
    },
    // 处理查询面板的数据，包装成诸葛下钻页面需要的参数
    packDataZgxz(obj){
      const data = {
        empNo: "17030352",
        statisDate: "",
        statisDateCom: "",
        paytime: "085400",
        filters: [
          {
            code: "BC_WD_0002",
            type: "in",
            value: "YG"
          }
        ]
      };
      data.empNo = this.$store.state.auth.user.code;
      if (obj.dateData[0] && obj.dateData[0].formatType !== "date") {
        this.$message({
          message: "日期选择只支持天,请重新选择",
          type: "error"
        });
        return false;
      }
      let reg = new RegExp("-", "g");
      if (obj.dateData[0]) {
        data.statisDate = obj.dateData[0].dateData[0].replace(reg, "");
      }
      if (obj.dateData[1]) {
        data.statisDateCom = obj.dateData[1].dateData[1].replace(reg, "");
      }else{
        this.$message("请选择对比日期")
        return false
      }
      
      let date = new Date();
      let hours = date.getHours().toString();
      let minutes = date.getMinutes().toString();
      let seconds = date.getSeconds().toString();
      let currentTime = `${hours.padStart(2, 0)}${minutes.padStart(2, 0)}${seconds.padStart(2, 0)}`
      data.paytime = currentTime;
      let filters = [];
      obj.dimListData.forEach(item => {
        let filter = {};
        filter.code = item.dimCode;
        if (item.selectedOper && item.selectedOper === "notin") {
          item.selectedOper = "not in";
        }
        filter.type = item.selectedOper;
        filter.value = item.dimSelectedList.join(",");
        return filters.push(filter);
      });
      data.filters = filters;
      return data
    }
  }
};
</script>
<style lang="less" scoped>
.iframe-assembly {
  overflow: hidden !important;
}
.left-iframe {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  .search-title {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    font-size: 16px;
    font-weight: bold;
    padding-left: 6px;
    height: 40px;
    line-height: 40px;
  }
  .iframe-content-wrap {
    padding: 11px;
    box-sizing: border-box;
    font-size: 14px;
    height: 100%;
    word-break: break-all;
    word-wrap: break-word;
    .iframe-content {
      width: 100%;
    }
  }
}
</style>
