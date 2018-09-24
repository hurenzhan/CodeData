<template>
  <div class="right-iframe">
    <div class="right-title">
		<div class="right-title-head">
			<span>容器标题</span>
      	    <el-checkbox v-model="checked" class="checkbox-style">显示</el-checkbox>
		</div>
		<el-input size="small" v-model="iframeTitle" clearable placeholder="请输入标题"></el-input>
	</div>
    <div class="right-iframe-term">
         <!-- <el-collapse accordion v-model="activeName">
            <el-collapse-item name="1"> -->
                <!-- <template slot="title"> -->
                    <span class="chart-type-title">
                        <!-- <span class="el-icon-caret-top triangle" :class="{activeIcon: activeName === '1'}"></span> -->
                        <span style="margin-left:8px">URL链接</span>
                    </span>
                <!-- </template> -->
                <div class="el-collapse-item-div">
                   <el-input
                    size="small"
                    clearable
                    type="textarea"
                    :rows="15"
                    placeholder="请输入url链接"
                    v-model="inputContent"  @change="iframeContentChange">
                    </el-input>
                </div>
<!--                
            </el-collapse-item>
         </el-collapse> -->
    </div>
  </div>
</template>

<script>
import bus from "../../utils/eventBus";
export default {
  name: "iframe-style",
  data() {
    return {
        activeName: '',
    };
  },
  computed: {
    // 获取vuex数据
    currentContainer() {
      return this.$store.state.charts.chartsOption.filter(
        item => item.selected
      )[0];
    },
    // 是否显示标题
    checked: {
      get() {
        return this.currentContainer.nameToggle;
      },
      set(value) {
        const index = this.currentContainer.i
        this.$store.commit("containerNameToggle", {
          index,
          value
        });
        this.$store.commit('containerHeightChange', {
          index,
          value
        });
        bus.$emit('searchReset')
      }
    },
    // 获取标题输入框文本
    iframeTitle: {
      get() {
        return this.currentContainer.name;
      },
      set(value) {
        this.$store.commit("changeContainerName", {
          index: this.currentContainer.i,
          value
        });
      }
    },
    // 输入框内容
    inputContent: {
      get() {
        return this.currentContainer.feature.content;
      },
      set(value) {
          this.$store.commit("inputContentChange", {
          index: this.currentContainer.i,
          value
        });
      }
    }
  },
  methods: {
    //修改iframe的url
    iframeContentChange(val = this.iframeContent){
      let value = this.myTrim(val)  // 清除字符串首尾两端的空白符
      this.$store.commit("iframeContentChange", {
          index: this.currentContainer.i,
          value
        });
    },
    myTrim(pram){
      return pram.replace(/(^\s*)|(\s*$)/g, "");
    }
  }
};
</script>

<style lang="less" >
.right-iframe {
  .right-title {
      margin: 10px;
      .right-title-head {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 10px;
          .checkbox-style {
              float: right;
            }
        }
    }
  .right-iframe-term {
        position: relative;
        .chart-type-title {
            width: 100%;
            color: #333;
            font-size: 14px;
            padding-left: 6px;
            font-weight: bold;
            .triangle{
                background: #FFFFFF;
                color: #D3D6D8;
                font-size: 14px;
            }
        }
        .el-dropdown{
            float: right;
            display: table;
            .icon-position{
                padding: 0px 11px 0px 30px;
                display: table-cell;
            }
        } 
        // .el-collapse-item {
          .el-collapse-item-div{
            padding: 10px;
          // }
        .el-collapse {
          border-bottom: none;
        }
        .el-collapse-item__content {
          margin-bottom: 0px;
          padding-bottom: 0px;
        }
        .el-icon-arrow-right:before{
          content: ''
        }
      }
    }
    .activeIcon {
      transform: rotate(180deg);
    }
}
</style>
