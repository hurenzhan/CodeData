<!-- <style scoped lang="less">
@import 'handsontable/src/css/handsontable.css';
</style> -->
<style lang="less">
@import './tableCommon.less';
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
.precise-positioning{
  position: relative;
  width: 200px;
  height: 32px;
  float: right;
  margin-bottom: 16px;
}
.precise-positioning-input, .precise-positioning-input input{
  height: 32px;
  line-height: 32px;
}
.precise-positioning-list{
  background-color: white;
  z-index: 100;
  position: absolute;
  right: 0;
  top: 36px;
  padding: 6px 32px 6px 12px;
  min-width: 550px;
  min-height: 200px;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 12px 0 rgba(0,0,0,.3);
}
.precise-positioning-list-scroller{
  min-width: 500px;
  min-height: 200px;
  max-width: 1000px;
  overflow-x: auto;
}
.precise-positioning-list table{
  width: 100%;
}
.precise-positioning-list .el-icon-close{
  cursor: pointer;
  position: absolute;
  right: 5px;
  top: 5px;
  border: 1px solid #ccc;
}
.precise-positioning-list table{
  min-width: 500px;
  empty-cells:show;
  border-collapse:collapse;
  border:1px solid #ccc;
}
.precise-positioning-list table th{
  background-color: #ececec;
}
.precise-positioning-list table th, .precise-positioning-list table td{
  padding: 6px 0;
  text-align: center;
  border:1px solid #ccc;
}
.icon-precise-positioning{
  cursor: pointer;
  display: inline-block;
  width: 20px;
  height: 14px;
  background: url("/static/charts/images/precise-positioning.svg") no-repeat center center;
}
.el-pagination{
  text-align: center;
  margin-top: 5px;
}
.search-text{
  color: red;
}
.moreWrap{
  width: 100%;
  float: left;
}
</style>
<template>
	<div class="tableWrapper" v-noData="{noDataLayer, containerHasTitle}"
		:class="tableWrapperIndex" @mouseenter="showExportBtn(index)" @mouseleave="hideExportBtn(index)">
		<!-- contextmenu -->
		<v-contextmenu ref="contextmenu"
		  @contextmenu="contextmenuShow"
      id="contextmenu"
		  @click.native.stop>
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
      		@click="numberOrbarClick('bar')"
      		>
      		<span>当前列显示条形图</span>
      		<i v-show="numberOrbar==='bar'" class="el-icon-check"></i>
      	</v-contextmenu-item>
      	<v-contextmenu-item
      		:auto-hide="false"
      		@click="numberOrbarClick('addnewcolumn')"
      		>
      		<span>新增列显示条形图</span>
      		<i v-show="numberOrbar==='addnewcolumn'" class="el-icon-check"></i>
      	</v-contextmenu-item>
    	</v-contextmenu-submenu>

      <v-contextmenu-submenu
				title="设置对齐方式"
        v-show="alignShow"
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
    		title="列的超链接跳转"
    		v-show="showMerage === 1 && isProduct">
    		<v-contextmenu-item
    			:auto-hide="false"
    			@click="superUrlChange(false)">
    			<span>无</span>
      		<i v-show="superUrl === false" class="el-icon-check"></i>
    		</v-contextmenu-item>
    		<v-contextmenu-item
    			:auto-hide="false"
    			@click="superUrlChange(true)">
    			<span>启用</span>
      		<i v-show="superUrl === true" class="el-icon-check"></i>
    		</v-contextmenu-item>
    	</v-contextmenu-submenu>
			<v-contextmenu-submenu
				title="下钻"
				id="menuItem"
				v-show="showMerage === 1 && selectType === 0"
				>
      	<v-contextmenu-item
      		:auto-hide="false"
      		>
      		<div>
      			<div class="select-dim">
      				<span>启用下钻</span>
      				<el-switch
							  v-model="selectDill"
								@change="selectDillCancel"
								:disabled="selectDillDisabled"
							 >
							</el-switch>
      			</div>
						<div>{{ selectName }}</div>
      		</div>
      	</v-contextmenu-item>
      	<v-contextmenu-item
      		class="select-route-wrapper"
      		:auto-hide="false"
      		>
      		<div class="select-route">
	      		<div class="select-dim">配置路径</div>
						<el-select
							v-model="modelRoute"
							placeholder="请选择"
							:disabled="!selectDill"
              :popper-append-to-body="false"
							@change="setDrillRouter">
							<el-option
					      v-for="item in dillList"
					      :key="item.routeCode"
					      :label="item.routeNm"
					      :value="item.routeCode">
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
							  v-model="showLine"
                :disabled="!selectDill"
							 >
							</el-switch>
      			</div>
						<div>
              <el-input :disabled="!selectDill||!showLine" size="mini" class="show-line-number" v-model="selectNumber" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" v-on:input="setSelectNumber" type="number" min="1"></el-input>
            </div>
      		</div>
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
				v-show="showMerage === 1 && selectId !=='operate'">
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
				v-show="showMerage === 1 && selectType === 1"
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
				@click="trendChange"
				v-show="showMerage === 1 && selectType === 1 && selectId.slice(-2) !== '_x'"
				:auto-hide="false"
				>
				<span>趋势标记</span>
      	<i v-show="trend === true" class="el-icon-check"></i>
			</v-contextmenu-item>

			<v-contextmenu-item
				v-show="hoverShow"
				@click="hoverChange"
				:auto-hide="false">
				<span>悬浮内容</span>
      	<i v-show="hover === true" class="el-icon-check"></i>
			</v-contextmenu-item>

<!-- 	<v-contextmenu-submenu
				:auto-hide="false"
				v-show="showMerage === 1 && selectType === 0 && dimList.length >= 1 && metricListFlat.length >= 1 && false"
				class="hover-item"
				title="悬浮表格"
				>
      	<i v-show="hover === true" class="el-icon-check"></i>
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
      			<div>度量</div>
            <Select
							:disabled="!selectHover"
							v-model="hoverMetricSelect"
							@on-change="selectHoverMetrics"
							placeholder="请选择">
							<Option
					      v-for="item in metricList"
	      				:key="item.metricCode"
	      				:label="item.metricName"
	      				:value="item.metricCode">
				    	</Option>
					  </Select>
					</div>
					<div class="hover-table-select">
            <div>条形图</div>
            <Select
							:disabled="!selectHover"
							v-model="hoverBarSelect"
							@on-change="hoverBarChange"
							placeholder="请选择">
							<Option
					      v-for="item in hoverBar"
	      				:key="item.metricCode"
	      				:label="item.metricName"
	      				:value="item.metricCode">
				    	</Option>
					  </Select>
					</div>
      	</v-contextmenu-item>
      	<v-contextmenu-item
      		:auto-hide="false"
      		class="div-relative">
      		<span>维度</span>
          <div class="">
            <Select
							:disabled="!selectHover"
							v-model="hoverDim"
							@on-change="selectHoverDim"
							placeholder="请选择">
							<Option
					      v-for="item in hoverDimList"
	      				:key="item.dimCode"
	      				:label="item.dimName"
	      				:value="item.dimCode">
				    	</Option>
					  </Select>
          </div>

          <el-button type="primary"
          	@click="hoverSure"
          	v-if="selectHover"
          	size="small"
          	>确定</el-button>
        	<el-button
        		disabled
        		size="small"
        		v-if="!selectHover"
        		>确定</el-button>
      	</v-contextmenu-item>
			</v-contextmenu-submenu> -->

			<v-contextmenu-item
				@click="sortChange"
				v-show="sortShow"
				:auto-hide="false"
			   >
				<span>排序</span>
      	<i v-show="isSort === true" class="el-icon-check"></i>
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

			<v-contextmenu-item
				:auto-hide="false"
				v-show="showMerage === 2"
				>
				<div class="merge"
					v-show="mergeOrSplit === 'merge'"
					@click="hansonMerge">合并单元格</div>
				<div class="merge"
					v-show="mergeOrSplit === 'split'"
					@click="hansonMergeCancel">取消单元格</div>
			</v-contextmenu-item>
	  </v-contextmenu>
		<div class="moreWrap">
			<!-- moredim -->
			<div class="more-dim" :class="{'dim-and-metric': this.dimAndMetricSmall === true}" v-if="moreDim">
				<div class="el-select">
					<span>更多维度</span>
					<el-select
						v-model="moreDimListSelect"
						multiple
						placeholder="请选择维度"
						collapse-tags
						:disabled="moreDimSingle"
						@change="moreChange($event, 'dimList')"
						@remove-tag="moreDimListChange($event, 'remove')"
						@visible-change="moreDimListChange($event, 'change')">
						<el-option
							v-for="item in this.dimListAlias"
							:key="item.dimCode"
							:label="item.dimName"
							:value="item.dimCode">
						</el-option>
					</el-select>
				</div>
			</div>
			<!-- moremetric -->
			<div class="more-metric" :class="{'dim-and-metric': this.dimAndMetricSmall === true}" v-if="moreMetric">
				<div class="el-select">
					<span>更多指标</span>
					<el-select
						v-model="moreMetricListSelect"
						multiple
						placeholder="请选择指标"
						collapse-tags
						@change="moreChange($event, 'metricList')"
						@remove-tag="moreMetricListChange($event, 'remove')"
						@visible-change="moreMetricListChange($event, 'change')">
						<el-option
							v-for="item in this.metricListFlat"
							:key="item.metricCode"
							:label="item.metricName"
							:value="item.metricCode">
						</el-option>
					</el-select>
				</div>
			</div>
      <!-- 精准定位 -->
      <div class="precise-positioning" v-if="isPrecisePositioning">
        <el-input class="precise-positioning-input" v-model="precisePositioning" @input="querySearch" placeholder="请输入内容"></el-input>
        <div class="precise-positioning-list" v-if="precisePositioningShow && precisePositioningPaginationData.length > 0">
          <i @click="precisePositioningFocus('false')" class="el-icon-close"></i>
          <div class="precise-positioning-list-scroller">
            <table :ref="getMyAutoCompleteRef">
              <thead>
                <tr v-for="headerItem in header">
                  <th v-for="(headerValue) in headerItem">{{headerValue}}</th>
                  <th style="width: 70px;">定位</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="precisePositioningItem in precisePositioningPaginationData">
                  <td v-for="(precisePositioningValue, key) in precisePositioningItem"
                      v-if="(key && key === 'number' && showNumber && header[header.length-1].hasOwnProperty(key)) || key && key !== 'number' && header[header.length-1].hasOwnProperty(key)"
                      :style="{'width': columnMaxLengthObj[key] * 12 + 'px'}"
                      v-html="precisePositioningHighLight(precisePositioningValue)">
                  </td>
                  <td align="center">
                    <i @click="handleSelect(precisePositioningItem)" class="icon-precise-positioning"></i>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <el-pagination
            @size-change="precisePositioningSizeChange"
            @current-change="precisePositioningPagination"
            :current-page="precisePositioningCurrentPage"
            :page-sizes="[10, 20, 30]"
            :page-size="precisePositioningPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="precisePositioningResult.length">
          </el-pagination>
        </div>
      </div>
		</div>
	  <!-- dimradio -->
	  <div v-if="moreDimSingle" class="more-dim-single">
	  	<el-radio-group v-model="moreDimSingleSelect" size="small" @change="moredimRadio">
		    <el-radio-button
					v-for="item in this.dimListRadioAlias"
					:key="item.dimCode"
					:label="item.dimName"
					@click="moredimRadio(item.dimCode)">
		  	</el-radio-button>
		  </el-radio-group>
	  </div>
	  <el-tooltip class="item" effect="dark" content="表格导出" placement="top">
	    <span class="exportIcon" v-show="exportBtnArr[index] && isInSight" @click="showExportDialog"></span>
	  </el-tooltip>
	  <!-- hansontable -->
		<div v-contextmenu:contextmenu class="table-wrapper">
		  <div class="hansontablepro"
		   @mouseleave.stop.prevent="hoverBarHide"
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

		<!-- hover table -->
		<div class="hover-table my-slide-bar"
			:id="hoverTableIndex"
			@mouseenter.stop.prevent="hoverBarShow"
			v-show="hoverTable">
	  	<span class="hover-table-title">{{ hoverValue }}</span>
	  	<ul v-for="(item, index) in hoverData" :key="index">
	  		<li v-if="styleConfig['hoverDim']" class="hover-table-dim">
	  			{{ item[styleConfig['hoverDim']] && item[styleConfig['hoverDim']].substring(0, 10) }}
	  		</li>

	  		<li v-if="styleConfig['hoverBarSelect']">
  				<el-progress
  				:percentage="Number(item[styleConfig['hoverBarSelect']])"
  				:stroke-width="16"></el-progress>
	  		</li>

	  		<li v-if="styleConfig['hoverMetricSelect']">
	  			{{item[styleConfig['hoverMetricSelect']]}}
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
  import addbarColumn from './addbarcolumn'
  import search from '../../../../api/search'
  import renderColumn from './renderColumn'
  import computed from './computed'
  import clearSettings from './clearSettings'
  import mounted from './mounted'
  import init from './init'
  import tableSearch from './search'
	import hover from './hover'
	import bus from '../../utils/eventBus'
	import method from './method'
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
    mixins: [mixin, addbarColumn, search, renderColumn, computed, clearSettings, mounted, init, tableSearch, hover, method, aliasMap, noDataMixin],
		watch: {
			// 悬浮表格 watch
			hoverIndex(val) {
				this.hoverBarShowChange()
			},
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
      // 渲染表格的方法
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
	      		if (val.length !== 0) {
		      		bus.$emit(`hansonmerage`, {
                index: this.index,
                value: true
              })
		      	} else if (val.length === 0) {
		      		bus.$emit(`hansonmerage`, {
                index: this.index,
                value: false
              })
		      	}
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
      // 排名监听右侧面板变化
      panelSortType(val) {
        if (this.isRanking) {
          this.allDataRender(this.allData)
          this.tableDataRender()
        }
      }
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
	     		if (this.freeze.isFreeze) {
	          this.hot.updateSettings({
	            fixedColumnsLeft: Number(this.freeze.freezeCol),
	            fixedRowsTop: Number(this.freeze.freezeLine),
	          })
	        }
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

