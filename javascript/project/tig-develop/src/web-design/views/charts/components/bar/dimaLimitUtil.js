
export default {
  methods: {
   handelPaveData(data) {
      const metricList = this.feature.metricListFlat ? this.feature.metricListFlat : this.feature.metricList
      const length = metricList.length
      const indexPaveDataList = []
      if (data && data.length > 0) {
         const paveData = data[0]
          if (paveData && length !== undefined) {
            for (let i = 0; i < length; i++) {
              const obj = {}
              const metricCode = metricList[i].metricCode
              obj[metricList[i].metricCode] = paveData[metricCode]
              obj.metricName = metricList[i].metricName
              indexPaveDataList.push(obj)
            }

          }
      }
      return indexPaveDataList
   }
  }
}
