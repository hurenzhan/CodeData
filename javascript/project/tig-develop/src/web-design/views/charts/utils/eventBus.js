import Vue from 'vue'
const eventBus = new Vue()

export default eventBus
// 查询数据点击‘更新’按钮，发射的事件
// updateData
// ------------------------------------------------------------
// 查询面板发射的事件
// updateQuery
/**
 * 	参数解释
 *  updateQuery(parmas)
 *  params:{
 *    titleData: 查询面板标题
 *  	textData: [  查询条件（文本）数据
 * 			{
 * 				name: 
 * 				value: 
 * 			}
 * 		]
 *  }
 */
// ---------------------------------------------------------------
// 图表联动时发射的事件
// updateLink
