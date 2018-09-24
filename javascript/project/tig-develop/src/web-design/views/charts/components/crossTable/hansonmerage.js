export default {
	methods: {
		hansonMerage() {
			if (this.handsonMerge.length !== 0 && this.showNumber) {
				this.handsonMerge.forEach((v, i) => {
					v.col += 1
				})
			
			}
			if (this.handsonMerge.length !== 0 && !this.showNumber) {
				this.handsonMerge.forEach((v, i) => {
					v.col -= 1
				})
			
			}	 
		}
	}
}