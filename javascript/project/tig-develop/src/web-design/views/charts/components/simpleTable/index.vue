<style lang="less">
// @import './table.less';
@import '../table/tableCommon.less';
::-webkit-scrollbar{
  height: 8px;
  width: 8px;
  background-color: #f5f5f5;
  box-shadow: none!important;
}
::-webkit-scrollbar-track{
  height: 5px;
  background: #e8e8e8;
  border: 1px solid #ccc;
  box-shadow: none!important;
  border-radius: 50px;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #f5f5f5;
  border: 1px solid #aaa;
  box-shadow: none!important;
}
::-webkit-scrollbar-thumb:hover {
  background: #fff;
}
::-webkit-scrollbar-thumb:active {
  background: #fff;
}
.el-select-dropdown{
	z-index: 2801 !important;
}
.showSelectDropdown{
	.v-contextmenu{
		display: block !important;
	}
}
.el-tooltip__popper{
	z-index: 3000 !important;
}
.el-tooltip__popper.is-dark{
	background: rgba(0,0,0,0.75);
	max-width: 200px;
	&>div{
		line-height: 1.6;
	}
}
</style>
<template>
	<div class="tableWrapper" v-noData="{noDataLayer, containerHasTitle}"
		:class="tableWrapperIndex" @mouseenter="showExportBtn(index)" @mouseleave="hideExportBtn(index)">
		<el-tooltip class="item" effect="dark" content="表格导出" placement="top">
	    <span class="exportIcon" v-show="exportBtnArr[index] && isInSight" @click="showExportDialog"></span>
	  </el-tooltip>
		<!-- 右键菜单 -->
		<v-contextmenu ref="contextmenu"
		  	@contextmenu="contextmenuShow"
				@click.native.stop>
		  	<!-- 标记类型 -->
			<v-contextmenu-submenu
				title="标记类型"
				v-show="showMerage === 1 && selectType === 1"
    		>
      	<v-contextmenu-item
      		:auto-hide="false"
      		@click="numberOrbarClick('number')">
      		<span>数值</span>
      		<i v-show="numberOrbar==='number'" class="el-icon-check"></i>
      	</v-contextmenu-item>
    		<v-contextmenu-item
      		:auto-hide="false"
      		@click="numberOrbarClick('bar')">
    			<span>当前列显示条形图</span>
    			<i v-show="numberOrbar==='bar'" class="el-icon-check"></i>
    		</v-contextmenu-item>
      	<v-contextmenu-item
      		:auto-hide="false"
      		@click="numberOrbarClick('addnewcolumn')">
      		<span>新增列显示条形图</span>
      		<i v-show="numberOrbar==='addnewcolumn'" class="el-icon-check"></i>
      	</v-contextmenu-item>
    	</v-contextmenu-submenu>
			<!-- 对齐方式 -->
	    <v-contextmenu-submenu
				title="设置对齐方式"
      	v-show="showMerage === 1 && selectId !== 'operate'">
      	<v-contextmenu-item
      		:auto-hide="false"
      		@click="setAlignClick('left')">
      		<span>左对齐</span>
      		<i v-show="alignFlag==='left'" class="el-icon-check"></i>
      	</v-contextmenu-item>
      	<v-contextmenu-item
      		:auto-hide="false"
      		@click="setAlignClick('center')">
      		<span>居中</span>
      		<i v-show="alignFlag==='center'" class="el-icon-check"></i>
      	</v-contextmenu-item>
      	<v-contextmenu-item
      		:auto-hide="false"
      		@click="setAlignClick('right')">
      		<span>右对齐</span>
      		<i v-show="alignFlag==='right'" class="el-icon-check"></i>
      	</v-contextmenu-item>
    	</v-contextmenu-submenu>
			<!-- 数值格式 -->
			<v-contextmenu-submenu
				title="数值格式"
				v-show="showMerage === 1 && selectType === 1 && isNumberDisabled === false">
				<v-contextmenu-item
					:auto-hide="false"
					@click="numberTypeChange(0)">
  				<span>#,##0</span>
  				<i v-show="numberType===0" class="el-icon-check"></i>
				</v-contextmenu-item>
		    <v-contextmenu-item
		      :auto-hide="false"
					@click="numberTypeChange(1)">
		      <span>#,##0.0</span>
		      <i v-show="numberType===1" class="el-icon-check"></i>
		    </v-contextmenu-item>
		    <v-contextmenu-item
		      :auto-hide="false"
					@click="numberTypeChange(2)">
      		<span>#,##0.00</span>
      		<i v-show="numberType===2" class="el-icon-check"></i>
      	</v-contextmenu-item>
		    <v-contextmenu-item
		      :auto-hide="false"
					@click="numberTypeChange(3)">
		      <span>#,##0.000</span>
		      <i v-show="numberType===3" class="el-icon-check"></i>
		    </v-contextmenu-item>
		    <v-contextmenu-item
		      :auto-hide="false"
					@click="numberTypeChange(4)">
      		<span>#,##0.0000</span>
      		<i v-show="numberType===4" class="el-icon-check"></i>
      	</v-contextmenu-item>
		    <v-contextmenu-item
		      :auto-hide="false"
					@click="numberTypeChange('percent')">
      		<span>百分比</span>
      		<i v-show="numberTypePercent===true" class="el-icon-check"></i>
      	</v-contextmenu-item>
		    <v-contextmenu-item
		      :auto-hide="false"
					@click="numberTypeChange('thousands')">
      		<span>千分位</span>
      		<i v-show="numberTypeThousands===true" class="el-icon-check"></i>
      	</v-contextmenu-item>
			</v-contextmenu-submenu>
			<!-- 趋势标记 -->
			<v-contextmenu-item
				@click="trendChange"
				v-show="showMerage === 1 && selectType === 1 && selectId.slice(-2) !== '_x'"
				:auto-hide="false"
				>
				<span>趋势标记</span>
      	<i v-show="trend === true" class="el-icon-check"></i>
			</v-contextmenu-item>
			<!-- 悬浮内容 -->
			<v-contextmenu-item
				v-show="showMerage === 1 && selectId !== 'operate'"
				@click="hoverChange"
				:auto-hide="false">
				<span>悬浮内容</span>
      	<i v-show="hover === true" class="el-icon-check"></i>
			</v-contextmenu-item>
      <!-- 悬浮表格 -->
      <v-contextmenu-submenu
				:auto-hide="false"
				v-show="showMerage === 1 && selectType === 0 && dimList.length >= 1 && metricListFlat.length >= 1"
				class="hover-item"
				title="悬浮表格"
				>
      	<v-contextmenu-item
      		:auto-hide="false">
      		<span>启用悬浮</span>
      		<el-switch
					  v-model="selectHover"
            @change="selectHoverCancel"
						:disabled="disabledHover"
					 >
			    </el-switch>
      	</v-contextmenu-item>
      	<v-contextmenu-item
      		:auto-hide="false"
      		class="div-relative"
      		>
      		<div class="hover-table-select">
      			<div>指标</div>
            <el-select
							:disabled="!selectHover"
							v-model="hoverMetricSelect"
							@change="selectHoverMetrics"
							:popper-append-to-body="false"
							placeholder="请选择">
							<el-option
					      v-for="item in metricList"
	      				:key="item.metricCode"
	      				:label="item.metricName"
	      				:value="item.metricCode">
				    	</el-option>
					  </el-select>
					</div>
      	</v-contextmenu-item>
        <v-contextmenu-item
      		:auto-hide="false"
      		class="div-relative"
      		>
      		<div class="hover-table-select">
      			<div>维度</div>
            <el-select
							:disabled="!selectHover"
							v-model="hoverDim"
							@change="selectHoverDim"
							:popper-append-to-body="false"
							placeholder="请选择">
							<el-option
					      v-for="item in hoverDimList"
	      				:key="item.dimCode"
	      				:label="item.dimName"
	      				:value="item.dimCode">
				    	</el-option>
					  </el-select>
					</div>
      	</v-contextmenu-item>
        <v-contextmenu-item
      		:auto-hide="false"
      		class="div-relative"
      		>
      		<div class="hover-table-select">
      			<span>展示行数</span>
            <el-switch
              v-model="hoverAndLine.showLine"
              :disabled="!selectHover"
							@change="isShowHoverLine"
            >
            </el-switch>
					</div>
      	</v-contextmenu-item>
      	<v-contextmenu-item
      		:auto-hide="false"
      		class="div-relative">
          <div style="margin-bottom:5px">
            <el-input  size="mini" class="show-line-number" :disabled="!selectHover||!hoverAndLine.showLine" v-model="hoverAndLine.selectNumber" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" v-on:input="chooseHoverLine" type="number" min="1"></el-input>
          </div>
          <el-button type="primary"
          	@click="hoverSure()"
          	v-if="selectHover"
          	size="small"
          	>确定</el-button>
        	<el-button
        		disabled
        		size="small"
        		v-if="!selectHover"
        		>确定</el-button>
      	</v-contextmenu-item>
			</v-contextmenu-submenu>
			<!-- 排序 -->
			<v-contextmenu-item
				@click="sortChange"
				v-show="showMerage === 1 &&
	        selectId !=='number' &&
	        selectId !=='operate' &&
	        selectId.slice(-2) !== '_x' &&
					selectId.slice(-2) !== '_8' &&
	        selectId.slice(-2) !== '_7'"
				:auto-hide="false"
				:disabled="selectType === 3
				|| selectId === 'number'
				|| selectId.slice(-2) === '_7'
				|| selectId.slice(-2) === '_8' || selectId === 'operate'">
				<span>排序</span>
      	<i v-show="isSort === true" class="el-icon-check"></i>
			</v-contextmenu-item>
			<v-contextmenu-submenu
				title="列字体颜色配置"
				v-show="showMerage === 1">
				<v-contextmenu-item
					:auto-hide="false"
					@click="fontColorChange('fon1')">
      			<span class="color-plan color-blod font-color1">Aa</span>
      			<i v-show="fontColor ==='fon1'" class="el-icon-check"></i>
				</v-contextmenu-item>
      	<v-contextmenu-item
      		:auto-hide="false"
      		@click="fontColorChange('fon2')">
      			<span class="color-plan color-blod font-color2">Aa</span>
      			<i v-show="fontColor ==='fon2'" class="el-icon-check"></i>
      	</v-contextmenu-item>
      	<v-contextmenu-item
      		:auto-hide="false"
      		@click="fontColorChange('fon3')">
      			<span class="color-plan color-blod font-color3">Aa</span>
      			<i v-show="fontColor ==='fon3'" class="el-icon-check"></i>
      	</v-contextmenu-item>
			</v-contextmenu-submenu>
			<!-- 自定义维度下钻 -->
			<v-contextmenu-submenu
				title="下钻"
				id="menuItem"
				v-show="showMerage === 1 && selectType === 0 && selectId !== 'dasp_date'">
				<v-contextmenu-item
					:auto-hide="false">
    			<div class="select-dim">
    				<span>启用下钻</span>
    				<el-switch
						  v-model="selectDill"
							@change="selectDillChange"
							:disabled="selectDillDisabled"
						>
						</el-switch>
    			</div>
					<div>{{ selectName }}</div>
				</v-contextmenu-item>
				<v-contextmenu-item
      		class="select-route-wrappe"
      		:auto-hide="false"
      		>
      		<div class="select-route">
	      		<div class="select-dim">选择维度</div>
						<el-select
							v-model="dillDim"
							placeholder="请选择"
							:disabled="!selectDill"
							:popper-append-to-body="false"
							@change="setDillDim">
							<el-option
					      v-for="item in dillDimList"
					      :key="item.dimCode"
					      :label="item.dimName"
					      :value="item.dimCode">
				    	</el-option>
				  	</el-select>
					</div>
      	</v-contextmenu-item>
      	<v-contextmenu-item
      		:auto-hide="false"
      		>
      		<div>
      			<div class="select-dim">
      				<span>展示行数</span>
      				<el-switch
							  v-model="dillAndLine.showLine"
                :disabled="!selectDill"
                @change="showLineChange"
							 >
							</el-switch>
      			</div>
						<div>
              <el-input :disabled="!selectDill||!dillAndLine.showLine" size="mini" class="show-line-number" v-model="dillAndLine && dillAndLine.selectNumber" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" v-on:input="setSelectNumber" type="number" min="1"></el-input>
            </div>
      		</div>
      	</v-contextmenu-item>
			</v-contextmenu-submenu>
			<v-contextmenu-submenu
        title="维值展示设置"
        class="show-dim-value"
        v-show="showMerage === 1 && selectType === 0"
        >
        <v-contextmenu-item
          :auto-hide="false"
          @click="showDimValue('dimAndCode')">
          <span>同时显示名称和编码</span>
          <i v-show="howDimValueShow === 'dimAndCode'" class="el-icon-check"></i>
        </v-contextmenu-item>
        <v-contextmenu-item
          :auto-hide="false"
          @click="showDimValue('code')">
          <span>只显示编码</span>
          <i v-show="howDimValueShow === 'code'" class="el-icon-check"></i>
        </v-contextmenu-item>
        <v-contextmenu-item
          :auto-hide="false"
          @click="showDimValue('dim')">
          <span>只显示名称</span>
          <i v-show="howDimValueShow === 'dim'" class="el-icon-check"></i>
        </v-contextmenu-item>
      </v-contextmenu-submenu>
	  </v-contextmenu>
	  	<!-- 显示TOP -->
  	<div class="show-top" v-if="isShowTop">
  		<div class="el-select">
		  	<el-select
		  		v-model="selectedTopValue"
		  		clearable
		  		@change="topChange"
		  		placeholder="请选择">
			    <el-option
		      	v-for="item in topList"
		      	:key="item.value"
		      	:label="item.label"
		      	:value="item.value">
			    </el-option>
				</el-select>
			</div>
  	</div>
	  <!-- hansontable -->
		<div v-contextmenu:contextmenu class="table-wrapper">
		  <div class="hansontablepro"
		   @mouseleave.stop.prevent="hoverBarHide"
		  :id="hansontableProId"
		  :class="{'table-border-none': this.tableBorder === false}"></div>
		</div>
		<!-- pagination -->
		<div class="paginationWrapper"
			v-show="tableData.length !== 0
			&& totalPages !== 1
			&& metricListFlat.length !== 0
			&& tableData.length !== row">
			<p class="metric-dialog-pagination">
        <span>总共{{this.total}}条</span>
        <span class="arrow-left" @click="prePage"></span>
        <input
        	size="mini"
        	@keyup.enter="enterPage"
        	v-model="currentPage" />
        <span class="metric-dialog-pagination-separator">/</span>
        <span>{{this.totalPages}}</span>
        <span class="arrow-right" @click="nextPage"></span>
  		</p>
		</div>
    <!-- hover table -->
		<div class="hover-table my-slide-bar"
		  tabindex="1"
		  @mouseenter.stop.prevent="hoverBarShow"
		  v-loading="loading"
			:class="{'loading-style':loading}"
			:id="hoverTableIndex"
			element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
			element-loading-background="#fff"
			v-if="hoverTable">
	  	<span v-if="hoverData.length !==0 " class="hover-table-title">{{ hoverTitle  }}</span>
	  	<ul v-for="(item, index) in hoverData" :key="index">
	  		<li v-if="styleConfig['hoverDim']" class="hover-table-dim" :style="{ width: hoverDimLength + 'px' }">
	  			<span>{{ item[styleConfig['hoverDim']] | clearDimName }}</span>
	  		</li>
	  		<li v-if="styleConfig['hoverMetricSelect']" class="hover-table-percentage">
					<el-progress :percentage="Number(item.percentage.toFixed(2))" :stroke-width="16"></el-progress>
	  		</li>
	  		<li v-if="styleConfig['hoverMetricSelect']" class="hover-table-number">
	  				<span>{{item[styleConfig['hoverMetricSelect']] | splitByComma}}</span>
	  		</li>
	  	</ul>
	  </div>
	  <el-dialog title="导出表格文件" id="exportReportModel" :visible.sync="exportDialogVisible" width="375px">
      <el-form :model="exportTask">
        <el-form-item label="文件名称" :label-width="formLabelWidth">
          <el-input size="small" v-model="exportTask.exportName" auto-complete="off" ref="exportNameInput">
          	<template slot="append">{{exportTime}}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="文件格式" :label-width="formLabelWidth">
          <el-radio v-model="exportTask.fileType" label="1">csv</el-radio>
          <el-radio v-model="exportTask.fileType" label="2">excel</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="exportDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="exportReport">确 定</el-button>
      </div>
    </el-dialog>
	</div>
</template>
<script>
	import Handsontable from 'handsontable'
	import { Pagination, Radio} from 'element-ui'
	import _uniqBy from 'lodash.uniqby'
	import contentmenu from 'v-contextmenu'
	import 'v-contextmenu/dist/index.css'
	import Vue from 'vue'
	import 'handsontable/src/css/handsontable.css';
	import mixin from './mixin'
	import search from '../../../../api/search'
	import renderColumn from './renderColumn'
	import computed from './computed'
	import clearSettings from './clearSettings'
	import mounted from './mounted'
	import init from './init'
	import tableSearch from './search'
  import addbarColumn from './addbarcolumn'
	import hover from './hover'
	import bus from '../../utils/eventBus'
	import method from './method'
	import aliasMap from '../mixins/aliasChange/aliasMap'
  import { sendLinkInfo } from '../../utils/utils'
	import _debounce from 'lodash.debounce'
	// import utils from './utils'
  import noDataMixin from '../mixins/noData/noDataMixin'
	Vue.use(contentmenu)
	export default {
    name: 'Table',
	  props: {
      index: {
        default: 0
      }
    },
    mixins: [mixin, search, renderColumn, computed, clearSettings, mounted, init, tableSearch, hover, method, aliasMap, addbarColumn, noDataMixin],
		watch: {
			linkedContainers(val) {
				if (val.length === 0) {
					this.linkPointer = false
				} else {
					this.linkPointer = true
				}
				this.renderColumns()
			},
			previewToggle(val){
				const tableId = document.querySelector(`#${this.hansontableProId}`)
				if(val){
					this.$nextTick(() => {
            tableId.style.margin = '0 auto'
          })
				}else{
					this.$nextTick(() => {
            tableId.style.margin = 'none'
          })
				}
			},
			tableData(val) {
				this.$nextTick(() => {
				 	if (this.hot && this.handsonMerge && this.handsonMerge.length !== 0) {
		        this.hot.updateSettings({
		            mergeCells: this.handsonMerge
		        })
      		}
				})
			},
			tablerenderer: {
				handler(val) {
					if (val.length !== 0 && this.hot) {
            this.hot.updateSettings({
              columns: val
            })
	        }else {
	          this.syncTable()
	        }
	        this.$nextTick(() => {
	        	this.hot && this.hot.render()
	        })
				},
				deep: true
			},
			// 排名监听右侧面板变化
      panelSortType(val) {
        if (this.isRanking) {
          this.allDataRender(this.allData)
          this.tableDataRender()
        }
      }
		},
		methods: {
			// 维值联动
			linkHandle: _debounce(function () {
				const dimName = this.tableData[this.selectedCell[0]][this.selectId].split('###')[0]
				const dimValue = this.tableData[this.selectedCell[0]][this.selectId].split('###')[1]
				let isLinkedDim = false
				this.chartsOption[this.index].linkedContainers.map((item,index)=>{
					if(item.dimCode === this.selectId){
						return isLinkedDim = true
					}
				})
				if(dimName !== '合计' && isLinkedDim){
					const contextMenu = document.querySelector(`.v-contextmenu`)
					if (contextMenu && contextMenu.style.display === 'none') {
						sendLinkInfo(this.chartsOption, this.index, {
		          dimCode: this.selectId,
		          dimValue: dimName,
              dimName: dimValue,
		          nearUpdateTime: this.chartsOption[this.index].nearUpdateTime
		        })
					}
				}
	    }, 1000),
			// 渲染hansontable的主方法
			syncTable() {
				const handsontableDom = document.getElementById(this.hansontableProId)
				if (!handsontableDom) return false
				if (this.hot) {
		      this.hot.destroy()
		    }
		    let updateSettings = {
	      	data: this.tableData,
	        columns: this.tablerenderer,
	        rowHeights: 22,
	        autoColumnSize: true,
	        autoRowSize: true,
	        viewportRowRenderingOffset: 5000,
	        viewportColumnRenderingOffset: 20,
	        fillHandle: {
				    autoInsertRow: false,
					},
			    stretchH: 'all',
			    rowHeaders: false,
			    rowHeaderWidth: 0,
		    	afterSelection: () => {
	         	this.selectedCell = this.hot.getSelected()
	         	// 维值联动
          	this.showColumn.forEach((v, i) => {
	          	if (this.selectedCell && i === this.selectedCell[1]) {
	          		this.selectId = v.id // 选中的列id
	          		this.selectType = v.type
	          		this.selectName = v.name
	          		if (v.type === 0) {
	          			this.linkHandle()
	          		}
	          	}
            })
      		},
	        beforeChange: (changes) => {
	        	// 预览 查看不能修改表格头
	        	if (this.isDisDraggable) {
	        		return false
	        	}
	        	const header = this.tableData.slice(0, this.row)
        		// 保存表格头
				    this.$store.commit('simpleSaveConfig',  {
			        index: this.index,
			        name: 'header',
			        header: header
				    })
	        },
	      }
      	const hot = new Handsontable(handsontableDom, updateSettings)
      	this.hot = hot
	      const queryId = '.' + this.tableWrapperIndex
	      // 监听点击右侧区域
        document.querySelector(queryId).addEventListener('click', function(e){
	      	if (this.$refs.contextmenu) {
	        	this.$refs.contextmenu.hide()
	      	}
	    	}.bind(this))
        // 监听点击其他地方消失
       	if (document.querySelector('.right')) {
       		document.querySelector('.right').addEventListener('click', function(e){
		      	if (this.$refs.contextmenu) {
		        	this.$refs.contextmenu.hide()
		      	}
			    }.bind(this))
		    }
		    this.calTableScroll()
				this.calTableHeight()
			},
		},
		filters: {
			// 三位数字用，号隔开
      splitByComma (value) {
        if (isNaN(parseInt(value))) return ' - '
        return Number(value).toLocaleString()
			},
			 // 截取维值'#'
      clearDimName (value) {
				const filtervalue = value.indexOf('###') !== -1 ? value.split('###')[1] : value
        return filtervalue.substring(0, 12)
      }
		}
	}
</script>

