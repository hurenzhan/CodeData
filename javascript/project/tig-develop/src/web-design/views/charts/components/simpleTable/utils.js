import { getDimValueByType } from '../../utils/utils'
export default {
	methods: {
		getDimValue (dimCode, dimName) {
			let value = getDimValueByType(this.chartsOption[this.index], dimCode, dimName)
			return value
		}
	}
}