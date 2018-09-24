import eventBus from '../../utils/eventBus'
export default {
  // 初始化清空指标值
  clearTitle (state, {index}) {
    state.chartsOption[index].feature.dataMetricData.forEach((item,index) => {
      item.title = ""
    })
  },
   /**
   * 标题 mutations
   */
  // 查询面板标题修改方法
  searchChangeName (state, {index, value}) {
    state.chartsOption[index].feature.title = value
  },
  // 是否显示标题
  changeIsShow (state, {index, value}) {
    state.chartsOption[index].feature.isShowTitle = value
	},
  // 组件添加(1.文本区域, 2.时间选择框, 3.维度下拉框, 4.数据指标)
  /**
   * 文本 mutations
   */
  // 添加文本下拉框
  searchAddText (state, {index, value}) {
    state.chartsOption[index].feature.textCategory.push({
      name: 'text',
      value,
      isBorder: true
    })
  },
  // 修改文本区域内容
  changeTextArea (state, {index, value, key}) {
    state.chartsOption[index].feature.textCategory[key].value = value
  },
  // 是否显示文本边框
  changeTextBorder (state, {index, value, key}) {
    state.chartsOption[index].feature.textCategory[key].isBorder = value
  },
  // 删除相应索引下标的文本区域
  delTextArea (state, {index, value}) {
    state.chartsOption[index].feature.textCategory.splice(value,1)
  },

  /**
   * 时间范围 mutations
  **/

  // 添加时间选择框
  searchAddDateTime (state, {index, value, title, type, dateData, formatType, dateType}) {
    state.chartsOption[index].feature.dateCategory.push({
      name:'dateTime',
      value,
      title,
      type,
      dateData,
      formatType,
      dateType
    })
  },
  // 删除相应下标的时间组件
  delDateTime (state, {index, value}) {
    state.chartsOption[index].feature.dateCategory.splice(value,1)
  },
  // 修改日期组件输入框标题
  dateChangeTitle (state, {index, value, key}) {
    state.chartsOption[index].feature.dateCategory[key].title = value
  },
  // 修改日期类型
  changeDateType (state, {index, value, key}) {
    state.chartsOption[index].feature.dateCategory[key].type = value
  },
  // 修改日期组件日期范围数据
  changeDateRang (state, {index, value, key, type}) {
    state.chartsOption[index].feature.dateCategory[key].dateData = value
    // state.chartsOption[index].feature.dateCategory[key].type = type
  },
  // 修改日期组件日期数据
  changeDateOnly (state, {index, value, key, type, formatType,dateType}) {
    state.chartsOption[index].feature.dateCategory[key].dateData = value
    state.chartsOption[index].feature.dateCategory[key].formatType = formatType
    state.chartsOption[index].feature.dateCategory[key].dateType = dateType
  },

  /**
   * 数据维度 (下拉框) mutations
   */

  // 设置维度启用范围
  changePublicDim (state, {index, value}) {
    state.chartsOption[index].feature.isPublicDim = value
    // 删除当前选择下拉维度值
    let length = state.chartsOption[index].feature.dropDownData.length
    state.chartsOption[index].feature.dropDownData.splice(0, length)
    // 清空级联
    this.commit('clearDimCascade', {index})
  },
  // 添加下拉框(维度)
  searchAddDropDown (state, {index, value}) {
    state.chartsOption[index].feature.dropDownCategory.push({
      name:'dropDown',
      value
    })
  },
  // 删除相应下标的维度下拉组件
  delDropDown (state, {index, value}) {
    state.chartsOption[index].feature.dropDownCategory.splice(0,1)
    state.chartsOption[index].feature.dropDownData = []
    state.chartsOption[index].feature.dropDownListTitle = ''
    // state.chartsOption[index].feature.dataMetricListTitle = ''
    // dropDownListTitle
  },
  // 修改右侧面板title，动态改变左侧title栏
  changedropDownListTitle (state, {index, value}) {
    state.chartsOption[index].feature.dropDownListTitle = value
  },
  // 修改左侧操作符
  changeDimOper (state, {index, value, key}) {
    state.chartsOption[index].feature.dropDownData[key].selectedOper = value
  },
  // 修改左侧维值下拉框数据 (根据key)
  changeDimSelectList (state, {index, value, name, key}) {
    state.chartsOption[index].feature.dropDownData[key].dimSelectedList = value
    state.chartsOption[index].feature.dropDownData[key].dimSelectedNameList = name
  },
  // 修改左侧维值下拉框数据 (根据dimCode)
  setSelectedValueBydimCode (state, {index, dimCode, value, name}) {
    let dropDownData = state.chartsOption[index].feature.dropDownData
    dropDownData.forEach(item => {
      if (item.dimCode === dimCode) {
        item.dimSelectedList = value
        item.dimSelectedNameList = name
        // 自定义维度时 value值即name值 同时适用于从url中获取自定义维度的value值场景
        if (item.type) {
          item.dimSelectedList = name
        }
      }
    })
  },
  // 根据目标维度清空 select框选项
  clearDimSelectList (state, {index, dimCode}) {
    let dropDownData = state.chartsOption[index].feature.dropDownData
    dropDownData.forEach(item => {
      if (item.dimCode === dimCode) {
        item.dimSelectedList = []
        item.dimSelectedNameList = []
      }
    })
  },
  // 删除维度下已选中的维值
  deleteDimSelectedValue (state, {index, dimIndex, valueIndex}) {
    let dropDownData = state.chartsOption[index].feature.dropDownData
    let dimSelectedList = dropDownData[dimIndex].dimSelectedList
    let dimSelectedNameList = dropDownData[dimIndex].dimSelectedNameList
    dimSelectedList.splice(valueIndex, 1)
    dimSelectedNameList.splice(valueIndex, 1)
  },
  // 点击右侧维度，左侧动态添加维度
  addDropDownList (state, {index, dimCode, dimName, controlType, key, isActive, selectedOper, dimSelectedList, dimSelectedNameList, dimSelected, father, children, Operator}) {
    let hasNoValueId = false
    // 是否自定义维度
    if (dimCode.indexOf('DASP') !== -1) {
      if (dimCode.split('_')[0] === 'DASP') {
        hasNoValueId = true
      }
    }
    // 自定义维度 自动生成输入类型
    controlType = hasNoValueId ? 2 : controlType
    // 保存数据
    state.chartsOption[index].feature.dropDownData.push({
      name:'dataDimcodeList',
      dimCode,                    // 当前维度编码
      dimName,                    // 当前维度名
      controlType,                // 控件类型 0: 单选 1: 多选 2: 输入型
      key,                        // 已弃用
      isActive,                   // 已弃用
      selectedOper,               // 已选的操作方式
      dimSelectedList,            // 已选维值id集合
      dimSelectedNameList,        // 已选维值名集合
      dimSelected,                // 可选的维值option集合
      father,                     // 该维度级联的父级
      children,                   // 该维度级联的子级
      Operator,                   // 可操作的选项 包含/不包含
      type: hasNoValueId          // 是否是自定义维度
    })
  },
  // 维度下相应维值查询
  saveDimListData (state, {index, dimList, dimCode, key}) {
    let dimIndex = index
    let dimKey = key
    // 通过key查询dropDownData数组中的数据，将请求过来的数据添加到该下标的数组中
    // console.log(state.chartsOption[dimIndex].feature.dropDownData.find(item=>item.key === key))
    state.chartsOption[dimIndex].feature.dropDownData.forEach((item,index) => {
      if (item.dimCode === dimCode) {
        // 添加数据
        item.dimSelected = dimList
      }
    })
  },
  // 初始化 数据维度控件 下拉选项数据
  initSaveDimListData (state, {index, dimList, dimCode}) {
    let dropDownData = state.chartsOption[index].feature.dropDownData
    dropDownData.forEach(item => {
      if (item.dimCode === dimCode) {
        item.dimSelected = dimList           // 添加数据
      }
    })
  },
  // 初始化数据维度 选中的维值
  initDropDownSelectedValue (state, {index}) {
    let dropDownData = state.chartsOption[index].feature.dropDownData
    dropDownData.forEach(item => {
      item.dimSelectedList = []
      item.dimSelectedNameList = []
    })
  },
  // 修改右侧维度点击时flag状态
  updateFlag (state, {index, flag, key}) {
    state.chartsOption[index].feature.dropDownData[key].isActive = !flag
  },
  // 修改控件类型
  setSelectType (state, {index, dimCode, value}) {
    let dropDownData = state.chartsOption[index].feature.dropDownData
    dropDownData.forEach(item => {
      if (item.dimCode === dimCode) {
        item.controlType = parseInt(value)
      }
    })
  },

  /**
   * 数据指标 mutations
  **/

  // 添加数据指标
  searchAddDataMetrics (state, {index, value, key, dataList}) {
    state.chartsOption[index].feature.dataMetricsCategory.push({
      name:'dataMetrics',
      value,
      key,
      dataList
    })
  },
  // 删除相应下标的数据指标组件
  delDataMtrics (state, {index, value, key}) {
    state.chartsOption[index].feature.dataMetricsCategory.splice(value,1)
    // 遍历删除相对应的数据
    var arrList = state.chartsOption[index].feature.dataMetricData
    state.chartsOption[index].feature.dataMetricData = arrList.filter(item => item.containerNum !== key )
    state.chartsOption[index].feature.dataMetricListTitle = ''
  },
  // 修改右侧面板title，动态改变左侧title栏
  changeDataMetricTitle (state, {index, value}) {
    state.chartsOption[index].feature.dataMetricListTitle = value
  },
  // 修改左侧操作符的值
  changeMetricOper (state, {index, value, key}) {
    state.chartsOption[index].feature.dataMetricData[key].selectedOper = value
  },
  // 修改左侧input框内的值
  changeInputTitle (state, {index, value, key}) {
    state.chartsOption[index].feature.dataMetricData[key].title = value
  },
  // 初始化指标值
  initDataMetricTitle (state, {index}) {
    state.chartsOption[index].feature.dataMetricData.forEach((item, index) => {
      item.title = ""
    })
  },
  // 点击右侧指标，左侧动态添加指标
  addDataMetrics (state, {index, metricCode, metricName, key, isActive, containerNum, metricIndex, title, selectedOper, Operator}) {
    // console.log('danga', key)
    // console.log(state.chartsOption[index].feature.dataMetricsCategory.filter(item=> item.key === key).dataList.push)
    state.chartsOption[index].feature.dataMetricData.push({
      name: 'dataMetricsList',
      metricCode,
      metricName,
      key,
      isActive,
      containerNum,
      metricIndex,
      title,
      selectedOper,
      Operator
    })
  },

  /**
   * 周期选择mutations
  */

  // 启用周期选择控件 配置数据项
  searchAddPeriodDate (state, { index, compared }) {
    let length = state.chartsOption[index].feature.periodData.length
    if (length >= 1) {
      return
    }
    // 当前未添加周期控件时
    state.chartsOption[index].feature.periodData.push({
      name: 'periodDate',
      // 时间数组，length 为1时: 只有本期值, 2时: 本期和对比期
      dateData: [{
        starTime: null,
        endTime: null
      }],
      // 是否是对比期
      compared: false,
      // 控件类型: month/daterange/week
      type: 'daterange',
      // 控件时间表现格式(显示在输入框中的格式)
      format: 'yyyy-MM-dd',
      // v-model绑定的时间格式
      valueFormat: 'yyyy-MM-dd',
      // 时间粒度
      timeUint: 'date',
      // 天周月切换选项
      selected: [
        {
          label: '实时',      // 时间控件类别名
          value: 0,           // 时间控件类别id
          disabled: false,    // 该类型控件是否启用
          type: 0,            // 该控件本期初始默认值
          compareType: 0,     // 该控件对比期初始默认值
          isRange: 1,         // 控件是否是范围 0: 时间点 1: 时间范围
          limitRange: ''      // 时间限制范围,仅在isRange为true时生效
        },
        {
          label: '时',
          value: 6,
          disabled: false,
          type: 0,
          compareType: 0,
          isRange: 1,
          limitRange: ''
        },
        {
          label: '日',
          value: 1,
          disabled: false,
          type: 0,
          compareType: 0,
          isRange: 1,
          limitRange: 30
        },
        {
          label: '周',
          value: 2,
          disabled: false,
          type: 0,
          compareType: 0,
          isRange: 0,
          limitRange: ''
        },
        {
          label: '月',
          value: 3,
          disabled: false,
          type: 0,
          compareType: 0,
          isRange: 0,
          limitRange: ''
        },
        {
          label: '季',
          value: 4,
          disabled: false,
          type: 0,
          compareType: 0,
          isRange: 0,
          limitRange: ''
        },
        {
          label: '年',
          value: 5,
          disabled: false,
          type: 0,
          compareType: 0,
          isRange: 0,
          limitRange: ''
        }
      ],
      // 当前选项的值
      selectedKey: 1,
      // 是否范围类型控件
      isRange: true
    })
  },
  // 切换 天/周/月
  selectedType (state, { index, key}) {
    let periodData = state.chartsOption[index].feature.periodData[0]
    let isRange = periodData.selected.filter(item => item.value === key)[0].isRange
    periodData.selectedKey = key
    if (key === 0) {
      periodData.type = 'daterange'
      periodData.format =  'yyyy-MM-dd'         // 显示在输入框中的格式
      periodData.valueFormat = 'yyyy-MM-dd'     // 绑定值的格式, 不指定则绑定值为 Date 对象
      periodData.timeUint = 'realTime'          // 控制时间粒度
    } else if (key === 1) {
      if (isRange) {
        // 范围控件配置
        periodData.type = 'daterange'
        periodData.isRange = true
      } else {
        // 时间点控件配置
        periodData.type = 'date'
        periodData.isRange = false
      }
      periodData.format =  'yyyy-MM-dd'
      periodData.valueFormat = 'yyyy-MM-dd'
      periodData.timeUint = 'date'              // 控制时间粒度
    } else if (key === 2) {
      periodData.type = 'week'
      periodData.format =  'yyyy 第 WW 周'
      periodData.valueFormat = ''               // 绑定值为 Date 对象
      periodData.timeUint = 'week'              // 控制时间粒度
    } else if (key === 3) {
      periodData.isRange = isRange ? true : false
      periodData.type = 'month'
      periodData.format = 'yyyy-MM'
      periodData.valueFormat = 'yyyy-MM'
      periodData.timeUint = 'month'             // 控制时间粒度
    } else if (key === 4) {                     // 季度是自定义控件,format、valueFormat设置无效
      periodData.type = 'quater'
      periodData.format = 'yyyy-MM-dd'
      periodData.valueFormat = 'yyyy-MM-dd'
      periodData.timeUint = 'quater'            // 控制时间粒度
    } else if (key === 5) {
      periodData.type = 'year'
      periodData.format = 'yyyy'
      periodData.valueFormat = 'yyyy'
      periodData.timeUint = 'year'              // 控制时间粒度
    } else if (key === 6) {
      periodData.type = 'datetimerange'         // 日期时间范围
      periodData.format = 'yyyy-MM-dd HH'
      periodData.valueFormat = ''
      periodData.timeUint = 'datetime-hour'     // 控制时间粒度
    }
    // // 切换类型清空一次dateData
    // this.commit('clearcurrentPeriodTime', {
    //   index,
    //   selectedKey: key
    // })
    // if (periodData.dateData.length > 1) {
    //   this.commit('claercompredPeriodTime', {
    //     index,
    //     selectedKey: key
    //   })
    // }
  },
  // 设置周期控件中 禁用的选项
  setDisabledPeriod (state, { index, keyArr}) {
    let periodData = state.chartsOption[index].feature.periodData[0]
    periodData.selected.forEach(item => {
      if (keyArr.some(value => value === item.value)) {
        item.disabled = false
      } else {
        item.disabled = true
      }
    })
    // 当前正使用key是弃用的类型 周期类型替换为下个可用的类型
    if (keyArr.length > 0 && !keyArr.some(value => value === periodData.selectedKey)) {
      // 切换控件类型
      this.commit('selectedType', {index, key: keyArr[0]})
      eventBus.$emit('switchTypeToPeriod', periodData.selectedKey)
      eventBus.$emit('switchTypeToCompare', periodData.selectedKey)
    }
  },
  // 是否显示对比期
  setCompared (state, { index, value}) {
    let periodData = state.chartsOption[index].feature.periodData[0]
    periodData.compared = value
    if (value) {
      periodData.dateData.push({
        starTime: null,
        endTime: null
      })
    } else {
      let length = periodData.dateData.length
      if (length > 1) {
        periodData.dateData.splice(length -1, 1)
      }
    }
  },
  // 设置本期时间
  currentPeriodTime (state, { index, selectedKey, value}) {
    let periodData = state.chartsOption[index].feature.periodData[0]

    // 实时时仅保存当天日期
    if (selectedKey === 0 && Array.isArray(value)) {
      periodData.dateData[0].starTime = value[0]
      periodData.dateData[0].endTime = value[1]
    }
    // 按天
    if (selectedKey === 1) {
      if (Array.isArray(value)) {
        periodData.dateData[0].starTime = value[0]
        periodData.dateData[0].endTime = value[1]
      } else {
        periodData.dateData[0].starTime = value
        periodData.dateData[0].endTime = value
      }
    }
    // 按周
    if (selectedKey === 2 && Array.isArray(value)) {
      periodData.dateData[0].starTime = value[0]
      periodData.dateData[0].endTime = value[1]
    }
    // 按月
    if (selectedKey === 3) {
      if (Array.isArray(value)) {
        periodData.dateData[0].starTime = value[0]
        periodData.dateData[0].endTime = value[1]
      } else {
        periodData.dateData[0].starTime = value
        periodData.dateData[0].endTime = value        
      }
    }
    // 按季
    if (selectedKey === 4 && Array.isArray(value)) {
      periodData.dateData[0].starTime = value[0]
      periodData.dateData[0].endTime = value[1]
    }
    // 按年
    if (selectedKey === 5) {
      periodData.dateData[0].starTime = value
      periodData.dateData[0].endTime = value
    }
    // 按时
    if (selectedKey === 6 && Array.isArray(value)) {
      periodData.dateData[0].starTime = value[0]
      periodData.dateData[0].endTime = value[1]
    }
  },
  // 设置对比期时间
  compredPeriodTime (state, { index, selectedKey, value}) {
    let periodData = state.chartsOption[index].feature.periodData[0]
    // 实时
    if (selectedKey === 0 && Array.isArray(value)) {
      periodData.dateData[1].starTime = value[0]
      periodData.dateData[1].endTime = value[1]
    }
    // 按天
    if (selectedKey === 1 && Array.isArray(value)) {
      if (Array.isArray(value)) {
        periodData.dateData[1].starTime = value[0]
        periodData.dateData[1].endTime = value[1]
      } else {
        periodData.dateData[1].starTime = value
        periodData.dateData[1].endTime = value
      }
    }
    // 按周
    if (selectedKey === 2 && Array.isArray(value)) {
      periodData.dateData[1].starTime = value[0]
      periodData.dateData[1].endTime = value[1]
    }
    // 按月
    if (selectedKey === 3) {
      if (Array.isArray(value)) {
        periodData.dateData[1].starTime = value[0]
        periodData.dateData[1].endTime = value[1]
      } else {
        periodData.dateData[1].starTime = value
        periodData.dateData[1].endTime = value
      }
    }
    // 按季
    if (selectedKey === 4 && Array.isArray(value)) {
      periodData.dateData[1].starTime = value[0]
      periodData.dateData[1].endTime = value[1]
    }
    // 按年
    if (selectedKey === 5) {
      periodData.dateData[1].starTime = value
      periodData.dateData[1].endTime = value
    }
    // 按时
    if (selectedKey === 6 && Array.isArray(value)) {
      periodData.dateData[1].starTime = value[0]
      periodData.dateData[1].endTime = value[1]
    }
  },
  // 清空本期时间
  clearcurrentPeriodTime (state, { index, selectedKey, value}) {
    let periodData = state.chartsOption[index].feature.periodData[0]
    // 按天
    if (selectedKey === 0) {
      periodData.dateData[0].starTime = null
      periodData.dateData[0].endTime = null
    }
    if (selectedKey === 1) {
      periodData.dateData[0].starTime = null
      periodData.dateData[0].endTime = null
    }
    // 按周
    if (selectedKey === 2) {
      periodData.dateData[0].starTime = null
      periodData.dateData[0].endTime = null
    }
    // 按月
    if (selectedKey === 3) {
      periodData.dateData[0].starTime = null
      periodData.dateData[0].endTime = null
    }
    // 按季
    if (selectedKey === 4) {
      periodData.dateData[0].starTime = null
      periodData.dateData[0].endTime = null
    }
    // 按年
    if (selectedKey === 5) {
      periodData.dateData[0].starTime = null
      periodData.dateData[0].endTime = null
    }
    // 按时
    if (selectedKey === 6) {
      periodData.dateData[0].starTime = null
      periodData.dateData[0].endTime = null
    }
  },
  // 清空对比期时间
  claercompredPeriodTime (state, { index, selectedKey, value}) {
    let periodData = state.chartsOption[index].feature.periodData[0]
    // 按天
    if (selectedKey === 0) {
      periodData.dateData[1].starTime = null
      periodData.dateData[1].endTime = null
    }
    if (selectedKey === 1) {
      periodData.dateData[1].starTime = null
      periodData.dateData[1].endTime = null
    }
    // 按周
    if (selectedKey === 2) {
      periodData.dateData[1].starTime = null
      periodData.dateData[1].endTime = null
    }
    // 按月
    if (selectedKey === 3) {
      periodData.dateData[1].starTime = null
      periodData.dateData[1].endTime = null
    }
    // 按季
    if (selectedKey === 4) {
      periodData.dateData[1].starTime = null
      periodData.dateData[1].endTime = null
    }
    // 按年
    if (selectedKey === 5) {
      periodData.dateData[1].starTime = null
      periodData.dateData[1].endTime = null
    }
    // 按时
    if (selectedKey === 6) {
      periodData.dateData[1].starTime = null
      periodData.dateData[1].endTime = null
    }
  },
  // 设置周期选择控件 限制范围
  setLimitRange (state, {index, limitRange, key}) {
    let periodData = state.chartsOption[index].feature.periodData[0]
    periodData.selected.forEach(item => {
      if (key === item.value) {
        item.limitRange = limitRange
      }
    })
  },
  // 切换控件 时间点或时间范围时
  isPeriodRange (state, {index, key, type}) {
    let periodData = state.chartsOption[index].feature.periodData[0]
    periodData.selected.forEach(item => {
      if (key === item.value) {
        item.isRange = type
      }
    })
    // 切换控件类型
    this.commit('selectedType', {index, key: periodData.selectedKey})
    eventBus.$emit('switchTypeToPeriod', periodData.selectedKey)
    if (periodData.compared) {
      eventBus.$emit('switchTypeToCompare', periodData.selectedKey)
    }
  },
  // 删除周期组件
  delPeriodDate (state, {index, value}) {
    let length = state.chartsOption[index].feature.periodData.length
    state.chartsOption[index].feature.periodData.splice(0, length)
  },
  // 切换默认值时
  changeSelectType (state, {index, value, key, tabName}) {
    let periodData = state.chartsOption[index].feature.periodData[0]
    periodData.selected.forEach(item => {
      if (key === item.value) {
        if (tabName === 'current') {
          item.type = value
        } else if (tabName === 'compare') {
          item.compareType = value
        } else {
          item.type = value
        }
      }
    })
    if (tabName === 'current') {
      eventBus.$emit('switchTypeToPeriod', periodData.selectedKey)
    } else {
      eventBus.$emit('switchTypeToCompare', periodData.selectedKey)
    }
  },

  /**
   *  实时更新
  */

  /*  添加实时更新控件 */
  addDataCycle (state, {index}) {
    if (state.chartsOption[index].feature.updateCycle.length === 0) {
      state.chartsOption[index].feature.updateCycle.push({
        name: 'updateCycle',
        type: '1'           // 控件时间类型 1: 表示分钟  2: 表示小时
      })
    }
  },
  /*  设置时间控件的周期类型 */
  setCycleType (state, {index,value}) {
    if (state.chartsOption[index].feature.updateCycle.length === 1) {
      state.chartsOption[index].feature.updateCycle[0].type = value
    }
  },
  /*  删除周期选择控件 */
  delDataCycle (state, {index}) {
    if (state.chartsOption[index].feature.updateCycle.length === 1) {
      state.chartsOption[index].feature.updateCycle.splice(0, 1)
    }
  },

  /**
  *  级联相关
  **/

  // 添加级联配置
  getDimCascade (state, {index, dimCode, dimName}) {
    state.chartsOption[index].feature.DimCascade.push({
      id: `${dimCode}-0`,       // 唯一识别符
      dimCode,
      dimName: dimName,
      disabled: true,
      children: []
    })
    this.dispatch('getDimRelative', {index, dimCode, dimName})
  },
  // 删除级联配置
  delDimCascade (state, {index, dimCode, dimName}) {
    let delIndex
    state.chartsOption[index].feature.DimCascade.forEach( (item, index) => {
      if (item.dimCode === dimCode) {
        delIndex = index
        return
      }
    })
    if (delIndex !== undefined) {
      state.chartsOption[index].feature.DimCascade.splice(delIndex, 1)
    }
  },
  // 清除所有级联数组
  clearDimCascade (state, {index}) {
    let length = state.chartsOption[index].feature.DimCascade.length
    state.chartsOption[index].feature.DimCascade.splice(0, length)
  },
  // 查找已选维度相关的级联维度   配置级联数组
  saveDimListDill (state, {index, dimCode, dimCascade}) {
    let cascade = state.chartsOption[index].feature.DimCascade
    cascade.forEach(item => {
      if (item.dimCode === dimCode) {
        item.children = dimCascade
        if (dimCascade.length > 0) {
          item.disabled = false
        }
        // 构造 唯一识别符
        item.children.forEach((child, index) => {
          child.id = `${item.id}-${index}`
        })
      }
    })
  },
  // 设置下拉框的级联相关维度
  setDropDownCascade (state, {index, dimCode, father}) {
    let dimList = state.chartsOption[index].feature.dropDownData
    // 对当前维度设置级联 的父级
    dimList.forEach(item => {
      // 找到对应的维度
      if (item.dimCode === dimCode) {
        // 该维度下 未关联该父级维度
        if (!item.father.some(subTtem => subTtem === father)) {
          item.father.push(father)
        }
      }
    })
    // 对应的父级设置级联的 子级
    dimList.forEach(item => {
      // 找到对应的维度
      if (item.dimCode === father) {
        // 该维度下 未关联该子级维度
        if (!item.children.some(subTtem => subTtem === dimCode)) {
          item.children.push(dimCode)
        }
      }
    })
    // console.log('setDropDownCascade', dimList)
  },
  // 设置下拉框的级联相关维度
  delDropDownCascade (state, {index, dimCode, father}) {
    let dimList = state.chartsOption[index].feature.dropDownData
    // 对当前维度设置级联 的父级
    let currentIndex
    let fatherIndex
    dimList.forEach((item, index) => {
      if (item.dimCode === dimCode) {
        currentIndex = index    // 当前维度index
      }
      if (item.dimCode === father) {
        fatherIndex = index     // 当前维度的父级维度index
      }
    })
    if (currentIndex !== undefined) {
      let i = dimList[currentIndex].father.indexOf(father)
      if (i >= 0) {
        dimList[currentIndex].father.splice(i, 1)
      }
    }
    if (fatherIndex !== undefined) {
      let i = dimList[fatherIndex].children.indexOf(dimCode)
      if (i >= 0) {
        dimList[fatherIndex].children.splice(i, 1)
      }
    }
    // console.log('delDropDownCascade', dimList)
  },
  // 基于父级维值下的维度查询
  queryDropDownCascade (state, {index, dimCode, dropIndex}) {
    let children = state.chartsOption[index].feature.dropDownData[dropIndex].children
    for (let i = 0; i < children.length; i++) {
      let dimCode = children[i]
      this.dispatch('queryDimByCascade', {
        index,
        dimCode,                         // 查询维度
        key: this.selectedDate[0],       // 当前维值下的查询
      })
    }
  },
  // 保存级联条件查询到的维值
  saveDimCascadeData (state, {index, dimCode, dimList}) {
    state.chartsOption[index].feature.dropDownData.forEach((item, index) => {
      if (item.dimCode === dimCode) {
        item.dimSelected = dimList
      }
    })
  },
  // 指标变化 过滤不符合当前维度集的级联维度
  checkDimCascadeOut (state, {index, dimList}) {
    if (!state.chartsOption[index].feature.DimCascade) {
      state.chartsOption[index].feature.DimCascade = []
    }

    let DimCascade = state.chartsOption[index].feature.DimCascade
    let filterCascade = DimCascade.filter(item => {
      if (dimList.some(subItem => {return subItem.dimCode === item.dimCode}) && dimList.length ) {
        return true
      } else {
        return false
      }
    })
    state.chartsOption[index].feature.DimCascade = filterCascade
  },
  // 保存级联id
  saveCascadeId (state, {index, dimCode, id, father}) {
    let cascadeIdArr = state.chartsOption[index].feature.cascadeIdArr
    cascadeIdArr.push(id)
    // 同一个dimCode 只支持一个父级
    let cascade = state.chartsOption[index].feature.DimCascade
    cascade.forEach(item => {
      if (item.dimCode !== father) {
        item.children.forEach(child => {
          if (child.dimCode === dimCode) {
            child.disabled = true
          }
        })
      }
    })
  },
  // 删除级联id
  delCascadeId (state, {index, dimCode, id, father}) {
    let cascadeIdArr = state.chartsOption[index].feature.cascadeIdArr
    cascadeIdArr.splice(cascadeIdArr.indexOf(id), 1)
    // 释放拥有相同dimCode的限制
    let cascade = state.chartsOption[index].feature.DimCascade
    cascade.forEach(item => {
      if (item.dimCode !== father) {
        item.children.forEach(child => {
          if (child.dimCode === dimCode && child.disabled) {
            child.disabled = false
          }
        })
      }
    })
  },
  /**
   * 将时间存到vuex上
   */
  syncSearchTime (state, {index, searchTime}) {
    state.chartsOption[index].searchTime = searchTime
  },

  /**
   * 高级
  **/

  tableSelected (state, {index, value}) {
    state.chartsOption[index].feature.tableSelectedList = value
  },
  // 查询面板关联相关
  checkedRelativeSearch (state, {index, value}) {
    state.chartsOption[index].feature.relativeSearch = value
  },
  // 指标变化 过滤掉不存在的指标属性
  checkMetricOut (state, {index, metricList}) {
    if (!state.chartsOption[index].feature.dataMetricData) {
      state.chartsOption[index].feature.dataMetricData = []
    }

    let dataMetricData = state.chartsOption[index].feature.dataMetricData
    state.chartsOption[index].feature.dataMetricData = dataMetricData.filter((item, index) => metricList.includes(item.metricCode))
  },
  // fix可用配置的维度及指标未根据配置在其他图表的维度及指标的变化而变化
  searchHandleMetricChange (state, {index, needDelArr}) {
    if (!state.chartsOption[index].feature.dataMetricData) {
      state.chartsOption[index].feature.dataMetricData = []
    }

    let dataMetricData = state.chartsOption[index].feature.dataMetricData
    state.chartsOption[index].feature.dataMetricData = dataMetricData.filter((item, i) => !needDelArr.includes(i))
  },
  searchHandleDimChange (state, {index, needDelArr}) {
    let dropDownData = state.chartsOption[index].feature.dropDownData
    state.chartsOption[index].feature.dropDownData = dropDownData.filter((item, i) => !needDelArr.includes(i))
  },
  // 图表组件mounted 完成
  chartsReady (state, {index}) {
    let chartsReady = state.chartsReady
    if (!chartsReady.some(chart => chart.id === index)) {
      state.chartsReady.push({
        id: index
      })
    }
  },
  // 已通知的图表
  setChartsReady (state, {chartIndex, searchIndex}) {
    let charts = state.chartsReady
    charts.forEach(item => {
      if (item.id === chartIndex) {
        item[`${searchIndex}-${chartIndex}`] = true
      }
    })
  },

  /**
   * 查询面板自适应
  **/
  // 更新 查询面板容器的高度
  setContainerHeight (state, {index, h}) {
    state.chartsOption[index].h = h
    eventBus.$emit('searchReset')
  },
  setLabelHeight (state, {index, h}) {
    state.chartsOption[index].h = h
  },
  // 右边面 > 高级 > 勾选同环比
  setDateCompareCheck (state, {index, type, value}) {
    state.chartsOption[index].feature = Object.assign({}, state.chartsOption[index].feature, { [`isChecked${type}Compare`]: value })
  },
  // 生成同环比日期
  generatorYoyAndMomDate (state, {index, value}) {
    state.chartsOption[index].feature = Object.assign({}, state.chartsOption[index].feature, {yoyAndMomDate: value})
  }
}
