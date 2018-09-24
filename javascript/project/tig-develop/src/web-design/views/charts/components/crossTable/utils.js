// import bus from '../../utils/eventBus'
const currentMetric = (metricList) => {
	const currentMetricLists = metricList.map(v => {
		let feature = v.feature
		if (feature.value2
			|| feature.value3
			|| feature.value4
			|| feature.value5
			|| feature.value6
			|| feature.value7
			|| feature.value8
			|| feature.value9) {
			return v
		} else {
			return ''
		}
	})
	return currentMetricLists
}
export {
	currentMetric
}