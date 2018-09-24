import eventBus from '../../utils/eventBus'
export default{

	// 修改输入框url
	inputContentChange (state, {index, value}) {
        state.chartsOption[index].feature.content = value
    },
    // 修改iframe容器url
    iframeContentChange(state,{index,value}){
        state.chartsOption[index].feature.iframeContent = value
    }
}