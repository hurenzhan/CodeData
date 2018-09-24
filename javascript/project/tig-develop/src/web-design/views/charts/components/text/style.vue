<template>
  <div class="right-text">
    <!-- title -->
    <div class="right-title">
			<div class="right-title-head">
				<span>元素标题</span>
      	<el-checkbox v-model="checked" class="checkbox-style">显示</el-checkbox>
			</div>
			<el-input size="small" v-model="textTitle" clearable placeholder="请输入标题"></el-input>
		</div>
    <!-- textArea -->
		<div class="right-content">
			<p>文本内容</p>
			<el-input
				type="textarea"
				:autosize="{ minRows: 20, maxRows: 22}"
				placeholder="请输入文本内容"
				v-model="textContent">
			</el-input>
		</div>
  </div>
</template>

<script>
export default {
	name:'text-style',
	data() {
		return{
		}
	},
	computed: {
		// 获取vuex数据
    currentContainer () {
      return this.$store.state.charts.chartsOption.filter(item => item.selected)[0]
		},
		// 是否显示标题
		checked: {
			get () {
        return this.currentContainer.nameToggle
      },
      set (value) {
        this.$store.commit('containerNameToggle', {
          index: this.currentContainer.i,
          value
        })
      }
		},
		// 获取标题输入框文本
		textTitle: {
      get () {
        return this.currentContainer.name
      },
      set (value) {
        this.$store.commit('changeContainerName', {
          index: this.currentContainer.i,
          value
        })
      }
		},
		// 文本区域
		textContent: {
      get () {
        return this.currentContainer.feature.content
      },
      set (value) {
        this.$store.commit('textChangeContent', {
          index: this.currentContainer.i,
          value
        })
      }
		},
	},
	methods: {
	}
}
</script>

<style lang="less" scoped>
	.right-text {
		.right-title {
			margin: 10px 10px 0 10px;
			.right-title-head {
				font-size: 15px;
				font-weight: 700;
				margin-bottom: 10px;
				.checkbox-style {
					float: right;
				}
			}
		}
		.right-content {
			font-size: 15px;
			font-weight: 700;
			margin: 10px;
			p {
				margin-bottom: 10px;
			}
		}
	}
</style>
