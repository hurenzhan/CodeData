export default {
  computed: {
    yoyAndMomDate() {
      return this.currentContainer.feature['yoyAndMomDate']
    },
    yoyAndMomDateFlag() {
      return this.yoyAndMomDate ? false : true
    },
    isCheckedYearMonthCompare() {
      return this.currentContainer.feature.isCheckedYearCompare || this.currentContainer.feature.isCheckedMonthCompare || false
    },
    isCheckedYearCompare() {
      return this.currentContainer.feature.isCheckedYearCompare || false
    },
    isCheckedMonthCompare() {
      return this.currentContainer.feature.isCheckedMonthCompare || false
    }
  }
}
