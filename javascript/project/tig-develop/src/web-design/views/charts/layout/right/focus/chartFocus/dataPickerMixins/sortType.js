export default{
  computed: {
    sortTypeValue: {
      get () {
        return this.selectedOption.sortType
      },
      set (value) {
        this.$store.commit('sortTypeChange', {
          index: this.index,
          value
        })
      }
    },
    // 根据什么排序,0维度 1指标
    sortByWhich: {
      get () {
        return this.selectedOption.sortByWhich === 1
      },
      set (value) {
        this.$store.commit('sortByWhichChange', {
          index: this.index,
          value: Number(value)
        })
      }
    }
  }
}
