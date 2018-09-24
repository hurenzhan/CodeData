<!-- <style scoped lang="less">
	@import './table.less';
</style> -->
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
		<!-- contextmenu -->
		<v-contextmenu ref="contextmenu"
		  @contextmenu="contextmenuShow"
		  @click.native.stop>
      <v-contextmenu-submenu
				title="设置对齐方式"
        :disabled="selectId === 'number' || selectId === 'operate'"
        v-show="showMerage === 1"
				>
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
			<v-contextmenu-submenu
				title="列颜色配置"
				v-show="showMerage === 1">
				<v-contextmenu-item
					:auto-hide="false"
					@click="colColorChange('color1')">
      			<span class="color-plan color-plan1">Aa</span>
      			<i v-show="colColor==='color1'" class="el-icon-check"></i>
				</v-contextmenu-item>
      	<v-contextmenu-item
      		:auto-hide="false"
      		@click="colColorChange('color2')">
      			<span class="color-plan color-plan2">Aa</span>
      			<i v-show="colColor==='color2'" class="el-icon-check"></i>
      	</v-contextmenu-item>
			</v-contextmenu-submenu>
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
			<v-contextmenu-submenu
				title="数值格式"
				v-show="showMerage === 1 && isNumberDisabled === false && (selectType === 1 || selectType === 3)"
				>
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
			<v-contextmenu-item
				@click="showGrowthChange"
				v-show="showMerage === 1 && isShowGrowth(selectId)"
				:auto-hide="false">
				<span>显示增长趋势</span>
      	<i v-show="showGrowth === true" class="el-icon-check"></i>
			</v-contextmenu-item>
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
	  <el-tooltip class="item" effect="dark" content="表格导出" placement="top">
	    <span class="exportIcon" v-show="exportBtnArr[index] && isInSight" @click="showExportDialog"></span>
	  </el-tooltip>
	  <!-- hansontable -->
		<div v-contextmenu:contextmenu class="table-wrapper">
		  <div class="hansontablepro"
		   :class="{'table-border-none': this.tableBorder === false}"
		   :id="hansontableProId"></div>
		</div>
		<!-- pagination -->
		<div class="paginationWrapper"
			v-show="tableData.length !== 0 && totalPages !== 1 && moreMetricList.length !== 0 && tableData.length !== row">
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
  import splitDim from './splitDim'
  // import hansonMerage from './hansonmerage'
  import init from './init'
  import tableSearch from './search'
	import bus from '../../utils/eventBus'
	import method from './method'
	import { rateTypeByMetricCode } from '../../utils/utils'
	import aliasMap from '../mixins/aliasChange/aliasMap'
  import noDataMixin from '../mixins/noData/noDataMixin'

	Vue.use(contentmenu)

	export default {
    name: 'Table',
	  props: {
      index: {
        default: 0
      }
    },
    mixins: [mixin, search, renderColumn, computed, clearSettings, mounted, splitDim, init, tableSearch, method, aliasMap, noDataMixin],
		watch: {
			selectedCell(val) {
				// 查看和预览状态下禁用掉选中
				if (this.isDisDraggable) {
					this.hot.deselectCell()
	      	return
				}
				// 渲染时右击菜单消失?
				if (this.$refs.contextmenu && val[2] !== (this.tableData.length - 1)) {
        	this.$refs.contextmenu.hide()
		    }
			},
			tableData(val) {
				this.$nextTick(() => {
				 	if (this.hot && this.handsonMerge && this.handsonMerge.length !== 0 && this.showHeader) {
	          this.hot.updateSettings({
	            mergeCells: this.handsonMerge
	          })
	        }
	        // 不显示表格头
	        if (!this.showHeader && this.hot) {
	          this.hot.updateSettings({
	            mergeCells: []
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
	        } else {
	          this.syncTable()
	        }
				},
				deep: true
			},
			// 监听mergeCells变化，重新实例化handsontable
	    handsonMerge: {
	      handler(val) {
	      	this.$nextTick(() => {
	      		// if (val.length !== 0 && !this.isSingleSplit && !this.isManySplit) {
		      	// 	// bus.$emit(`hansonmerage${this.index}`, true)
		      	// } else if (val.length === 0 && !this.isSingleSplit && !this.isManySplit) {
		      	// 	// bus.$emit(`hansonmerage${this.index}`, false)
		      	// }
		      	this.$store.commit('saveConfig',  {
		          index: this.index,
		          name: 'handsonMerge',
		          handsonMerge: val
		        })
		        if (val && val.length == 0 && this.hot && this.showHeader) {
		          this.hot.updateSettings({
		            mergeCells: []
		          })
		        }

		        if (val && val.length !== 0 && this.hot && this.showHeader) {
		          this.hot.updateSettings({
		            mergeCells: val
		          })
		          // 处理显示表格头时数值显示的问题
		          if (this.isSplit) {
								this.saveTableHeader()
		          }
		        }
		        // 不显示表头合并单元格配置没有
		        if (!this.showHeader && this.hot) {
		        	this.hot.updateSettings({
		            mergeCells: []
		          })
		        }
	      	})
	      },
	      deep: true
	    },
		},
		methods: {
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
	        // mergeCells: this.handsonMerge,
			    stretchH: 'all',
			    rowHeaders: true,
			    rowHeaderWidth: 0,
			    afterSelection: () => {
						this.selectedCell = this.hot.getSelected()
	          this.showColumn.forEach((v, i) => {
	          	if (this.selectedCell && i === this.selectedCell[1]) {
	          		this.selectId = v.id // 选中的列id
	          		this.selectType = v.type
								this.selectName = v.name
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
			      this.$store.commit('saveConfig',  {
			        index: this.index,
			        name: 'header',
			        header: header
			      })
	        },
	      }
	      this.$nextTick(() => {
	      	const hot = new Handsontable(handsontableDom, updateSettings)
	      	this.hot = hot
	        if (this.showHeader) {
	        	this.hot.updateSettings({
	            mergeCells: this.handsonMerge
	          })
	        }
	      })
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
		}
	}
</script>