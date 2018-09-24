import eventBus from '../../utils/eventBus'
export default{
	// 查询面板标题修改方法
  textChangeName (state, {index, value}) {
    state.chartsOption[index].feature.title = value
	},
	// 是否显示标题
	textChangeShow(state, {index, value}) {
    state.chartsOption[index].feature.isShowTitle = value
	},
	// 修改文本内容区域
	textChangeContent (state, {index, value}) {
    state.chartsOption[index].feature.content = value
	},
	setTextContainerHeight (state, {index, h}) {
    state.chartsOption[index].h = h
    // 延时的目的是防止与查询面板同时使用时的报错 ==> 临时方案
    setTimeout(() => {
    	eventBus.$emit('searchReset')
    }, 100)
	}
}