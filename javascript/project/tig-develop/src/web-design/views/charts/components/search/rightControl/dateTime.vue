<template>
  <!--时间组件-->
	<div class="right-Component">
		<div class="date-content">
			<!-- <el-collapse  accordion> -->
				<el-collapse-item title="日期范围" ref="collapse-time">
					<!-- 日期标题输入框 -->
					<div>
						<!-- {{typeName}} -->
						<div v-if="typeName === 'dateRange'">
							<el-input class="date-input" size="mini" v-model="dateInput" placeholder="请输入内容"></el-input>
						</div>
						<div v-else>
							<el-input class="date-input" size="mini" v-model="dbDate" disabled placeholder="对比日期"></el-input>
						</div>
						<!-- {{datemessage}} -->
					</div>
					
					<div class="common">
						<span>类型</span>
						<!-- 时间类型下拉框 -->
						<div class="dateTime-select" v-if="datemessage === 0">
							<el-select v-model="selectedDate" size="mini" @change="changeType" placeholder="请选择">
								<el-option
									v-for="item in dateType"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</div>
						<div class="dateTime-select" v-else>
							<el-select v-model="selectedDate" size="mini" @change="changeCompType" placeholder="请选择">
								<el-option
									v-for="item in dateType"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</div>
					</div>

					<!-- 默认 -->
					<div class="common">
						<span>默认</span>
						<!-- 默认下拉框 -->
						<div class="dateTime-select" v-if="datemessage === 0">
							<el-select v-model="defaultSelect" size="mini" @change="changeDefaultData" placeholder="请选择">
								<el-option
									v-for="item in defaultData"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</div>
						<div class="dateTime-select" v-else>
							<el-select v-model="defaultSelect" size="mini" @change="changeLYDefaultData" placeholder="请选择">
								<el-option
									v-for="item in secondSelect"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</div>
					</div>

				</el-collapse-item>
			<!-- </el-collapse> -->
		</div>
	</div>
  
</template>

<script>
import time from '../searchMixins/time.js'
export default {
	name:'dateTime',
	mixins: [time],
  data() {
    return {
			dateType: [
				{
					value: 'dateRange',
					label: '时间范围'
				}, {
					value: 'dateTime',
					label: '日期'
				}
			],
			defaultData: [
				{
					value: 'nowDate',
					label: '当天'
				}, {
					value: 'preDate',
					label: '前一天'
				},{
					value: 'nowMonth',
					label: '当月'
				},{
					value: 'lastMonth',
					label: '上一月'
				}
			],
			secondSelect: [
				{
					value: 'nowDate',
					label: '去年当天'
				}, {
					value: 'preDate',
					label: '去年前日'
				},{
					value: 'nowMonth',
					label: '去年当月'
				},{
					value: 'lastMonth',
					label: '去年上月'
				}
			],
			selectedDate: 'dateRange', // 下拉框选择(1.时间范围, 2.日期)
			defaultSelect: 'preDate', // 默认下拉框选择（默认选择前一天）,
			input: '',
			activeName: '', // 默认只展示一个
			dateOnly: '',
			dateRang: '',
			dbDate: '对比日期'
    }
	},
	mounted() {
		const styleConfig = this.currentContainer.feature.dateCategory[this.datemessage]
		this.initStyle(styleConfig)
    // 默认展开当前面板
    this.$nextTick(() => {
      this.$refs['collapse-time'].handleHeaderClick()
    })
	},
	props: ["message","datemessage", "typeName"], // datemessage:当前第几个日期条件组件
	computed: {
		// 获取vuex数据
    currentContainer () {
			return this.$store.state.charts.chartsOption.filter(item => item.selected)[0]
		},
		// 修改日期组件中输入框内容
		dateInput: {
      get () {
        return this.currentContainer.feature.dateCategory[this.datemessage].title
      },
      set (value) {
        this.$store.commit('dateChangeTitle', {
          index: this.currentContainer.i,
					value,
					key: this.datemessage
        })
      }
		},
	},
	methods: {
		// 初始化修改右侧面板数据
		initStyle (value) {
			if (value.formatType === '') {
				this.selectedDate = 'dateRange'
				this.defaultSelect = 'preDate'
			}else {
				this.selectedDate = value.type
				this.defaultSelect = value.dateType
			}
		},
		// 改变日期控件类型
		changeType () {
			// 修改时间类型(日期/日期范围)
			this.$store.commit('changeDateType', {
				index: this.currentContainer.i,
				value: this.selectedDate, //类型
				key: this.datemessage,
			})
			// 切换类型时 初始化默认值为前一天
			if (this.selectedDate === 'dateTime') {
				this.$store.commit('changeDateOnly', {
					index: this.currentContainer.i,
					value: this.getPreDate(new Date()),
					key: this.datemessage,
					type: this.selectedDate,
					formatType: 'date',
					dateType: 'preDate'
				})
				this.defaultSelect = 'preDate'
			}
			if (this.selectedDate === 'dateRange') {
				this.$store.commit('changeDateOnly', {
					index: this.currentContainer.i,
					value: [this.getPreDate(new Date()), this.getPreDate(new Date())],
					key: this.datemessage,
					type: this.selectedDate,
					formatType: 'date',
					dateType: 'preDate'
				})
				this.defaultSelect = 'preDate'
			}
		},
		// 改变对比日期控件类型
		changeCompType () {
			// 修改时间类型(日期/日期范围)
			this.$store.commit('changeDateType', {
				index: this.currentContainer.i,
				value: this.selectedDate, //类型
				key: this.datemessage,
			})
			// 切换类型时 初始化默认值为前一天
			if (this.selectedDate === 'dateTime') {
				this.$store.commit('changeDateOnly', {
					index: this.currentContainer.i,
					value: this.getPreDateLastYear(new Date()),
					key: this.datemessage,
					type: this.selectedDate,
					formatType: 'date',
					dateType: 'preDate'
				})
				this.defaultSelect = 'preDate'
			}
			if (this.selectedDate === 'dateRange') {
				this.$store.commit('changeDateOnly', {
					index: this.currentContainer.i,
					value: [this.getPreDateLastYear(new Date()), this.getPreDateLastYear(new Date())],
					key: this.datemessage,
					type: this.selectedDate,
					formatType: 'date',
					dateType: 'preDate'
				})
				this.defaultSelect = 'preDate'
			}
		},
		// 改变日期范围数据
		changeDateRang() {
			this.$store.commit('changeDateRang', {
				index: this.currentContainer.i,
				value: this.dateRang,
				key: this.datemessage,
				type: this.selectedDate
			})
		},
		// 改变日期数据
		changDateOnly() {
			this.$store.commit('changeDateOnly', {
				index: this.currentContainer.i,
				value: this.dateOnly,
				key: this.datemessage,
				type: this.selectedDate,
				formatType: ''
			})
		},
		// 改变默认数据
		changeDefaultData () {
			const date = new Date
			let sendDate = ''
			let startDate = ''
			let endDate = ''
			let dateRangData = []
			// 添加判断当前选项
			// 日期
			if (this.selectedDate === 'dateTime') {
				if (this.defaultSelect === 'nowDate') {
					// 当天(日期类型)
					this.$store.commit('changeDateOnly', {
						index: this.currentContainer.i,
						value: this.getFullTime(new Date(), 'day'),
						key: this.datemessage,
						type: this.selectedDate,
						formatType: 'date',
						dateType: 'nowDate'
					})
				} else if (this.defaultSelect === 'preDate') { 
					// 前一天
					this.$store.commit('changeDateOnly', {
						index: this.currentContainer.i,
						value: this.getPreDate(new Date()),
						key: this.datemessage,
						type: this.selectedDate,
						formatType: 'date',
						dateType: 'preDate'
					})	
				} else if (this.defaultSelect === 'nowMonth') {
					// 当月
					this.$store.commit('changeDateOnly', {
						index: this.currentContainer.i,
						value: this.getFullTime(new Date(), 'month'),
						key: this.datemessage,
						type: this.selectedDate,
						formatType: 'month',
						dateType: 'nowMonth'
					})	
				} else 	{
					// 前一月
					this.$store.commit('changeDateOnly', {
						index: this.currentContainer.i,
						value: this.getPreMonth(new Date()),
						key: this.datemessage,
						type: this.selectedDate,
						formatType: 'month',
						dateType: 'lastMonth'
					})	
				}
			} 
			// 日期范围
			if (this.selectedDate === 'dateRange') {
				if (this.defaultSelect === 'nowDate') {
					// 当天(日期类型)
					this.$store.commit('changeDateOnly', {
						index: this.currentContainer.i,
						value: [this.getFullTime(new Date(), 'day'), this.getFullTime(new Date(), 'day')],
						key: this.datemessage,
						type: this.selectedDate,
						formatType: 'date',
						dateType: 'nowDate'
					})
				} else if (this.defaultSelect === 'preDate') { 
					// 前一天
					this.$store.commit('changeDateOnly', {
						index: this.currentContainer.i,
						value: [this.getPreDate(new Date()), this.getPreDate(new Date())],
						key: this.datemessage,
						type: this.selectedDate,
						formatType: 'date',
						dateType: 'preDate'
					})
				} else if (this.defaultSelect === 'nowMonth') {
					// 当月
					this.$store.commit('changeDateOnly', {
						index: this.currentContainer.i,
						value: [this.getFullTime(new Date(), 'month'), this.getFullTime(new Date(), 'month')],
						key: this.datemessage,
						type: this.selectedDate,
						formatType: 'month',
						dateType: 'nowMonth'
					})
				} else 	{
					// 前一月
					this.$store.commit('changeDateOnly', {
						index: this.currentContainer.i,
						value: [this.getPreMonth(new Date()), this.getPreMonth(new Date())],
						key: this.datemessage,
						type: this.selectedDate,
						formatType: 'month',
						dateType: 'lastMonth'
					})
				}
			} 
		},
		// 修改对比日期默认数据
		changeLYDefaultData () {
			const date = new Date
			let sendDate = ''
			let startDate = ''
			let endDate = ''
			let dateRangData = []
			// 添加判断当前选项
			// 日期
			if (this.selectedDate === 'dateTime') {
				if (this.defaultSelect === 'nowDate') {
					// 去年当天(日期类型)
					this.$store.commit('changeDateOnly', {
						index: this.currentContainer.i,
						value: this.getDateLastYear(new Date()),
						key: this.datemessage,
						type: this.selectedDate,
						formatType: 'date',
						dateType: 'nowDate'
					})
				} else if (this.defaultSelect === 'preDate') { 
					// 去年前日
					this.$store.commit('changeDateOnly', {
						index: this.currentContainer.i,
						value: this.getPreDateLastYear(new Date()),
						key: this.datemessage,
						type: this.selectedDate,
						formatType: 'date',
						dateType: 'preDate'
					})	
				} else if (this.defaultSelect === 'nowMonth') {
					// 去年当月
					this.$store.commit('changeDateOnly', {
						index: this.currentContainer.i,
						value: this.getMonthLastYear(new Date()),
						key: this.datemessage,
						type: this.selectedDate,
						formatType: 'month',
						dateType: 'nowMonth'
					})	
				} else 	{
					// 去年前月
						this.$store.commit('changeDateOnly', {
						index: this.currentContainer.i,
						value: this.getPreMonthLastYear(new Date()),
						key: this.datemessage,
						type: this.selectedDate,
						formatType: 'month',
						dateType: 'lastMonth'
					})	
				}
			} 
			// 日期范围
			if (this.selectedDate === 'dateRange') {
				if (this.defaultSelect === 'nowDate') {
					// 去年当天(日期类型)
					this.$store.commit('changeDateOnly', {
						index: this.currentContainer.i,
						value: [this.getDateLastYear(new Date()), this.getDateLastYear(new Date())],
						key: this.datemessage,
						type: this.selectedDate,
						formatType: 'date',
						dateType: 'nowDate'
					})
				} else if (this.defaultSelect === 'preDate') { 
					// 去年前日
					this.$store.commit('changeDateOnly', {
						index: this.currentContainer.i,
						value: [this.getPreDateLastYear(new Date()), this.getPreDateLastYear(new Date())],
						key: this.datemessage,
						type: this.selectedDate,
						formatType: 'date',
						dateType: 'preDate'
					})
				} else if (this.defaultSelect === 'nowMonth') {
					// 去年当月
					this.$store.commit('changeDateOnly', {
						index: this.currentContainer.i,
						value: [this.getMonthLastYear(new Date()), this.getMonthLastYear(new Date())],
						key: this.datemessage,
						type: this.selectedDate,
						formatType: 'month',
						dateType: 'nowMonth'
					})
				} else 	{
					// 去年前月
					this.$store.commit('changeDateOnly', {
						index: this.currentContainer.i,
						value: [this.getPreMonthLastYear(new Date()), this.getPreMonthLastYear(new Date())],
						key: this.datemessage,
						type: this.selectedDate,
						formatType: 'month',
						dateType: 'lastMonth'
					})
				}
			} 
		}
	}
}
</script>

<style lang="less">
	.right-Component {
		.date-content {
			.el-collapse-item__header {
				border: 1px solid rgba(0,0,0,0.15);
				background-color: #F1F3F5;
    		border-radius: 4px;
				padding-left: 10px;
				height: 32px;
				line-height: 32px;
				.el-collapse-item__arrow {
					line-height: 32px;
				}
			}
			.el-collapse-item__wrap {
				width:100%;
				border-bottom: none;
				.el-collapse-item__content {
					margin-top: 10px;
					padding-bottom: 0px;
				}
			}
			.common {
				margin-top: 8px;
				margin-bottom: 8px;
				span {
					width: 28px;
					margin-right: 6px;
					// height: 20px;
				}
				.dateTime-select {
					display: inline-block;
					width: 140px;
					height: 32px; 
				}
			}
			
		}
	}
</style>
