/*
 * @Author: Jacob
 * @Date: 2018-03-21 15:06:48
 * @description: 关系图组件，技术栈使用antv/g6来实现，用户可以自己添加删除节点，形成树状结构图，目前支持三种节点，单指标，双指标和关系指标
 * @Last Modified by: Jacob
 * @Last Modified time: 2018-07-13 14:39:15
 */
<template>
  <div :id="mountNode" class="relation" style="width: 100%;"></div>
</template>

<script>

import searchMixin from '../../../../api/search'
import { toThousands } from '../../utils/utils'
import bus from '../../utils/eventBus'
import G6 from '@antv/g6'
import { NEW_NODE, NODE, EDGE } from '../../constants/relation'
import aliasMap from '../mixins/aliasChange/aliasMap'

export default {
  name: 'relation',
  mixins: [searchMixin, aliasMap],
  // 传过来的当前容器的索引
  props: {
    index: {
      default: 0
    }
  },
  data () {
    return {
      nodes: [],  // 节点集合
      edges: [],  // 边集合
      nodeNum: 1, // 节点id，id是不断增加的，删除掉也增加
      edgeNum: 1, // 边id
      nodeNo: 1, // 记录节点的编号
      nodeId: '', // 当前复制节点的根节点
      record: [], // 复制节点时记录节点位置
      activeNode: [], // 单击选中的node
      nodeData: [], // 整理后的data,
      copyData: [], // 添加维度后获取的数据
      selectedNode: 0, // 选中的节点
      metricsNodes: [], // 存放计算配置维度后再添加查询条件更新数据的指标节点
      activeFlag: false, // 如果右击菜单存在了，就不再弹出
      metricNo: 0 //指标编号
    }
  },
  computed: {
    // 关系图挂载的容器id，针对不同的面板窗口索引挂载不同的ID
    mountNode() {
      return `mountNode-${this.index}`
    },
    // 当前面板索引请求接口后获得的汇总指标数据
    gatherData() {
      return this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config.gatherData
    },

    // 获取指标编号下拉列表
    nodeTypeList () {
      return this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config.nodeTypeList
    },

    // 当前面板索引请求接口后获得的明细指标数据
    detailData() {
      return this.$store.state.charts.chartsOption[this.index].feature.styleConfig.config.detailData
    },

    // 获取当前面板索引的样式面板的属性
    feature() {
      return this.$store.state.charts.chartsOption[this.index].feature
    },
    // 获取vuex公共数据,展示联动
    currentContainer () {
      return this.$store.state.charts.chartsOption[this.index]
    },

    preview () {
      return this.$store.state.charts.previewToggle
    }
  },
  async mounted () {
      G6.track(false)

      // 重新进来时
      // 第一次进来的时候先去获取一下数据
      await this.getAllData()
      if (this.gatherData.length !== 0 ) {
        this.nodeData = this.getData(this.gatherData)
      }
      // 更新数据触发事件
      bus.$on(`updateData_${this.index}`, async (obj) => {
        await this.getAllData()
        this.$store.commit('updateNodeNo', {
          index: this.index,
          updateAll: true
        })
        if (this.gatherData.length !== 0) {
          this.nodeData = this.getData(this.gatherData)  // 更新数据后重新获取一遍数据，这里length是判断当前是不带维度的数据，如果带维度不处理
          this.updateData(this.gatherData, true) // 更新数据后及时更新现有节点模板上的数据
          this.isVisiual()
        }
      })

      // 查询面板触发的事件过滤条件请求接口
      bus.$on(`updateQuery_${this.index}`, (obj) => {
        (async () => {
          if (this.feature.dimList.length > 1) {
            this.$message.error('只能选择一个维度哦！')
          } else {
            // 先过滤一下,如果带了指标和维度查询暂时不考虑
            if (obj.metricsListData.length === 0) { // 如果指标筛选项为空
              if (obj.dimListData.length === 0) { // 如果维度下拉框选择为空
                await this.getAllData(obj)
                if (this.gatherData.length !== 0) {
                  // 再来判断是不是带了维度，if 带维度， else不带维度
                  if (this.feature.dimList.length === 1) {
                    this.nodeData = this.getData(this.gatherData)  // 把汇总指标的数据处理一下存入nodeData
                    this.nodeData2 = this.getData(this.detailData, true) // 把明细指标的数据处理一下存入nodeData2
                    this.updateData(this.gatherData) // 更新数据后及时更新现有节点模板上的数据
                  } else {
                    this.nodeData = this.getData(this.gatherData)  // 把汇总指标的数据处理一下存入nodeData
                    this.updateData(this.gatherData)
                  }
                }
              }
            }
          }
        })()
      })

      // // 监听拖拽
      bus.$on(`resizeOrMove_${this.index}`, () => {
        // 自适应先注释掉
        let fitView = 'tc' // autoZoom
        // if (this.net.getNodes().length <= 3) {
        //   fitView = 'tc'
        // }

        let item = document.getElementById(this.mountNode)
        let width = item.offsetWidth
        let height = item.offsetHeight - 20

        let maxXClient = 0
        let maxYClient = 0


        // 每次窗口变化时计算节点当中的最大的x坐标位置和y坐标位置，并把最大的位置保存下来
        G6.Util.each(this.net.getNodes(), node => {
          if (node.getModel().x > maxXClient) {
            maxXClient = node.getModel().x
          }
          if (node.getModel().y > maxYClient) {
            maxYClient = node.getModel().y
          }
        })

        let nodeLength = this.net.getNodes().length


        const saveData = this.net.save()
        const json = JSON.stringify(saveData, null, 2); // 存储数据时格式化一下
        let data = JSON.parse(json)
        this.net.destroy()
        this.init(false, fitView)

        // 必须在重新渲染之前和上一次销毁之后改变模式才行
        if (this.preview || this.$route.path === '/visual') {
          this.net.changeMode('none')
          if (nodeLength !== 1) {
            this.net.changeSize(maxXClient * 1.1 + 80, maxYClient * 1.2 + 120) // 将节点当中最大的x坐标和y坐标位置作为画布宽高改变
          }
        } else {
          this.net.changeSize(width, height)
          this.net.changeMode('default')
        }


        // // 在render之前添加toolTip，否则会失效
        // // 添加tooltip
        // this.net.tooltip({
        //   title: '标题', // @type {String} 标题
        //   split: ':',  // @type {String} 分割符号
        //   dx: 0,       // @type {Number} 水平偏移
        //   dy: -30        // @type {Number} 竖直偏移
        // });

        // this.net.node().tooltip(['name', 'name2'])

        // 自适应先注释掉
        this.net.read(data) // 读取数据
        this.net.render()
        // this.adapt()

        // 预览模式和查看模式下隐藏叉号和加号
        if (this.preview || this.$route.path === '/visual') {
          let nodes = document.getElementById(this.mountNode).getElementsByClassName('node-container-content')
          G6.Util.each(nodes, node => {
            node.getElementsByClassName('node-add')[0].style.display = 'none'
            node.getElementsByClassName('node-delete')[0].style.display = 'none'
          })
          this.activeFlag = true
        } else {
          this.activeFlag = false
        }
      })

      bus.$on('beforeSave', () => {
        this.saveData()
      })

      // 初始化三种节点样式
      this.initType('customNode') // 单指标
      this.initType('shape-double') // 双指标
      this.initType('shape-relation') // 关系指标

      this.init(true) // 初始化G6


      /**@augments
       * 更新配置触发事件
       * 判断维度数量是不是1个，如果不是一个不复制节点
       */
      bus.$on('updateOption', (obj) => {
        if (this.feature.dimList.length !== 1) {
          this.$message.error('要选择一个维度哦！')
          // 把下拉列表选中的还原
          this.$store.commit('updateNodeNo', {
            index: this.index,
            updateFail: true
          })
        } else {
          this.selectedNode = obj.value
          this.setDimension(obj.value)
        }
      })

      // 通知查询面板准备完毕
      this.$store.commit('chartsReady', {
        index: this.index
      })
  },
  methods: {

    // 判断是不是查看模式
    isVisiual() {
      // 经过多次实践发现进入查看状态时有时候会触发这个事件，有时候不会触发，所以这里要再写一次
      if (this.$route.path === '/visual') {
        let maxXClient = 0
        let maxYClient = 0


        // 每次窗口变化时计算节点当中的最大的x坐标位置和y坐标位置，并把最大的位置保存下来
        G6.Util.each(this.net.getNodes(), node => {
          if (node.getModel().x > maxXClient) {
            maxXClient = node.getModel().x
          }
          if (node.getModel().y > maxYClient) {
            maxYClient = node.getModel().y
          }
        })

        this.net.changeMode('none')
        this.net.changeSize(maxXClient * 1.2 + 120, maxYClient * 1.2 + 120) // 将节点当中最大的x坐标和y坐标位置作为画布宽高改变
        let nodes = document.getElementById(this.mountNode).getElementsByClassName('node-container-content')
        G6.Util.each(nodes, node => {
          node.getElementsByClassName('node-add')[0].style.display = 'none'
          node.getElementsByClassName('node-delete')[0].style.display = 'none'
        })
        this.activeFlag = true
      }
    },

    //适配，更改字体大小和关系图箭头大小以及节点宽高
    adapt() {
      setTimeout(() => {
        let containers = document.getElementById(this.mountNode).getElementsByClassName('g6-html-node-container')
        Array.prototype.slice.call(containers, 0).forEach((container, index) => {
          container.getElementsByClassName('node-container-content')[0].style.width = container.style.width
          container.getElementsByClassName('node-container-content')[0].style.height = container.style.height
          if (container.getElementsByClassName('arrow-up')[0]) {
            container.getElementsByClassName('arrow-up')[0].style.width = parseInt(container.style.width.substring(0, container.style.width.length - 2)) / 8 + 'px'
            container.getElementsByClassName('arrow-up')[0].style.height = parseInt(container.style.width.substring(0, container.style.width.length - 2)) / 8 + 'px'
          }
          if(container.getElementsByClassName('content').length > 1) {
            container.getElementsByTagName('h3')[0].style.fontSize = parseInt(container.style.width.substring(0, container.style.width.length - 2)) / 9.5 * 1.5 + 'px'
            container.getElementsByTagName('h3')[1].style.fontSize = parseInt(container.style.width.substring(0, container.style.width.length - 2)) / 9.5 * 1.5 + 'px'
          } else {
            container.getElementsByTagName('h3')[0].style.fontSize = parseInt(container.style.width.substring(0, container.style.width.length - 2)) / 12 + 'px'
          }
        })
      }, 20);
    },

    // 合计数据，当带维度查询的时候把汇总数据也拿到
    async getAllData(obj) {
      const index = this.index
      const type = 1
      const autoSum = true
      let dataSum = []
      if (obj) {
        const rateType = obj.dateData.length === 2 ? 4 : 0
        const queryInfo = obj
        dataSum = await this.updateDataPre({index, type, autoSum, rateType, queryInfo})
      } else {
        dataSum = await this.updateDataPre({index, type, autoSum})
      }
        this.$store.commit('saveAllData', {
          index: this.index,
          data: dataSum
        })
    },

    /**@augments
     * 获取数据的方法
     * 先判断当前的选中指标数量不为0，当前数据时不带维度的数据
     * 然后开始遍历指标数组，获取到指标编码和指标名称，然后根据指标编码去数据里查询价格等字段
     * hasDim是判断是否带维度查询
     */
    getData (resData, hasDim = false) {
      let data = []
      // 此处加判断是否选择了配置维度的节点， 之所以带维度的查询这么复杂是因为只能更新配置维度的节点和子节点，其他没复制的节点不做更新
      if (hasDim && this.nodeId !== '') {
        // 计算当前配置维度的指标及其子节点的指标
        // 默认从当前下拉框选择的指标开始计算
        let currentNode = this.net.find(this.nodeId)
        if (currentNode) {
          this.metricsNodes.push(currentNode)
          this.getChildMetricsCode(currentNode) // 把配置维度节点的子节点放到数组里去

          let arr = []  // 存放指标编码的数组
          // 把需要配置维度的节点的指标编码全部放到数组里
          this.metricsNodes.forEach(item => {
            if (item._attrs.model.nodeType === 'double' && item._attrs.model.shape !== 'shape-relation') {
              arr.push(item._attrs.model.metricCode)
              arr.push(item._attrs.model.metricCode2)
            } else if (item._attrs.model.nodeType === 'single' || item._attrs.model.shape === 'shape-relation') {
              arr.push(item._attrs.model.metricCode)
            }
          })


          // 循环所有的指标编码，然后把需要的数据整理成一条条对象放入数组
          for (let i = 0; i < resData.length; i++) {
            arr.forEach((item, index) => {
              let obj = {}
              obj.name = resData[i][this.feature.dimList[0].dimCode]
              obj.name2 = resData[i + 1] ? resData[i + 1][this.feature.dimList[0].dimCode] : ''
              obj.comparePrice = resData[i][item] ? resData[i][item]  : ''
              obj.comparePrice2 = resData[i + 1] ? resData[i + 1][item]  : ''
              obj.precent = resData[i][item + '_6'] ? (resData[i][item + '_6'] * 100).toFixed(2) : ''
              obj.precent2 = resData[i + 1] ? (resData[i + 1][item + '_6'] * 100).toFixed(2) : ''
              data.push(obj)
            })
          }
          this.metricsNodes = [] // 查询完之后就清空
        }
      } else {
        // 如果不是带维度的查询，则这么写
        // 指标重命名
        let metricList = JSON.parse(JSON.stringify(this.feature.metricList)).map(metric => {
          // 指标别名的应用
          const alias= this.getAliasByMetricCode(metric.metricCode)
          metric.metricName = alias === false ? metric.metricName : alias
          return metric
        })
        metricList.length !== 0  && metricList.forEach((item, index) => {
          let obj = {}
          obj.metricCode = item.metricCode
          obj.metricName = item.metricName
          obj.price = resData[0][item.metricCode] ? resData[0][item.metricCode] : ''
          obj.comparePrice = resData[0][item.metricCode] ? resData[0][item.metricCode] : ''  // 展示本期值
          obj.precent = resData[0][item.metricCode + '_6'] ? (resData[0][item.metricCode + '_6'] * 100).toFixed(2) : '' // _6代表对比率
          data.push(obj)
        })
      }
      return data
    },

    init (changeSizeFlag, fitView = 'tc') {
      const chartHeight = document.getElementById(this.mountNode).offsetHeight
      // 新建画布
      this.net = new G6.Net({
        id: this.mountNode,
        height: chartHeight, // 默认采用当前窗口的高度
        fitView: fitView,  // 对齐方式采用top-center的布局
        grid: null, // 网格背景取消
        // modes: {               // 模式集
        //   // 自定义模式，可覆盖原有的模式
        //   default: [
        //     'dragNode', 'dragEdge', 'dragBlank', 'clickBlankClearActive', 'resizeEdge', 'resizeNode'
        //   ]
        // },
        mode: 'default' // 有编辑、none等模式，采用默认的模式
      })



      this.net.removeBehaviour(['wheelZoom', 'clickActive']) // 去除鼠标滚动行为
      // 单击选中事件，单击时变成选中样式，同时把单击节点的信息存入数组，再次单击时取消选中样式，同时把节点从数组中删除
      this.net.on('click', ev => {
        let g6tooltip = document.getElementById(this.mountNode).getElementsByClassName('graph-container')[0].getElementsByClassName('g6-tooltip')[0]
        g6tooltip.style.visibility = 'hidden'
        let nodeContainers = document.getElementById(this.mountNode).getElementsByClassName('g6-html-node-container')
        // 单击画布，如果点击+的菜单存在就删除掉
        Array.prototype.slice.call(nodeContainers).forEach(nodeContainer => {
          let li = nodeContainer.querySelector('.g6-category-list')
          if (li) {
            li.parentNode.removeChild(li)
          }
        })


        // 判断当前状态是不是在预览模式和查看状态下，如果不是才能进行点击操作
        if (!this.preview && this.$route.path !== '/visual') {
          const item = ev.item
          // 默认点击空白处后删除list
          let length = categoryList.length

          // 因为当前点击事件包含节点和边，我只要处理节点的情况，点击连接线的时候不做处理
          if (item && item._attrs.type === 'node') {
            let containers = document.getElementById(this.mountNode).getElementsByClassName('node-container-content')
            // 事先在节点里埋了节点的id，所以判断当前点击的是dom节点，然后添加一个选中的样式
            Array.prototype.slice.call(containers, 0).forEach((container, index) => {
              if (container.getElementsByClassName('hide')[0].innerHTML === item._attrs.id.toString() && !container.classList.contains('active')) {
                container.classList.add('active')
              } else if (container.getElementsByClassName('hide')[0].innerHTML === item._attrs.id.toString() && container.classList.contains('active')) {
                container.classList.remove('active')  // 如果已经选中了，再次点击就取消选中样式
              }
            })
          }
        }
      })


      // Array.prototype.slice.call(buttons, 0).forEach((button, index) => {
      //   console.log(button)
      //   button.addEventListener('click', () => {
      //     console.log(button.getParentNode('node-container-content').getElementsByClassName('hide')[0].innerHTML)
      //   })
      // })

      document.oncontextmenu = e => false // 禁用默认鼠标右键点击事件

      // 鼠标右击事件
      this.net.on('contextmenu', ev => {
        const item = ev.item
        // 点击时会有两种情况，node或edge都会调用事件，如果是在node节点上就执行
        if (item && item._attrs.type === 'node') {
          let itemId = item._attrs.id // 当前点击节点的ID
          // 这里要在g6下获取active的类名，否则会获取到document中其他带active的类名节点
          let containers = document.getElementById(this.mountNode).getElementsByClassName('graph-container-html-Elements')[0].getElementsByClassName('active')
          /**
           * 判断是否是在选中的节点上右击，如果不是，则不弹出菜单
           */
          let flag = false // 定义是否是在选中的节点上右击
          let nodeHeight = [] // 存放所有节点的y轴坐标
          let yWidth = 0  // 存放所有节点的最大的y轴坐标
          let xWidth = 0  // 存放所有节点的平均x轴坐标
          let nodeType = 'single' // 判断是否有双指标，因为双指标和单指标对y坐标的要求是不一样的
          /**
           * 因为containers不是真正的数组，所以要用Array.prototype.slice.call()转换一下
           * 此处遍历选中节点数组中是否有id是否等于右击的节点id
           * 判断右击事件是否是在已选中的节点上发生的，如果不是则不弹出事件
           */

          this.activeNode = [] // 每次右击时清空activeNode

          containers.length > 0 && Array.prototype.slice.call(containers, 0).forEach(container => {
            let nodeid = container.getElementsByClassName('hide')[0].innerHTML
            if ( nodeid === itemId.toString()) flag = true
            this.activeNode.push(this.net.find(nodeid))
          })

          // 计算x坐标，逻辑是把所有的节点x坐标加起来去平均数
          this.activeNode.forEach(node => {
            xWidth = xWidth + node._attrs.model.x
            nodeHeight.push(node._attrs.model.y)
            if (node._attrs.model.nodeType === 'double') nodeType = 'double'
          })
          // 获取最大的y轴坐标
          for (let i in nodeHeight) {
            if (nodeHeight[i] > yWidth) {
              yWidth = nodeHeight[i]
            }
          }

          // 编写右击事件
          if (containers.length !== 0 && flag) {
            let contextList = document.getElementById(this.mountNode).getElementsByClassName('graph-container')[0].getElementsByClassName('context-menu-list')[0]
            let list = contextList.getElementsByTagName('li')[0]
            contextList.style.left = ev.domX + 'px'// 获取到鼠标的X坐标
            contextList.style.top = ev.domY + 'px' // 获取鼠标的Y坐标


            // 判断是否已经弹出列表，如果有了就不弹出
            if (!this.activeFlag) {
              contextList.style.visibility = 'visible'
            }

            this.activeFlag = true

            // 如果存在list左键点击空白处就删除节点
            this.net.on('click', ev => {
              contextList.style.visibility = 'hidden'
              this.activeFlag = false
            })



            // 右键弹窗单击事件
            list.onclick = () => {

              let newNode = JSON.parse(JSON.stringify(NODE))
              newNode['id'] = 'node' + Number(this.nodeNum + 1)
              newNode['name'] = this.nodeData[this.metricNo] ? this.nodeData[this.metricNo].metricName : ''
              newNode['count'] = this.nodeData[this.metricNo] ? this.nodeData[this.metricNo].price : '没有数据了'
              newNode['metricCode'] = this.nodeData[this.metricNo] ? this.nodeData[this.metricNo].metricCode : ''
              newNode['metricName'] = this.nodeData[this.metricNo] ? this.nodeData[this.metricNo].metricName : ''
              newNode['x'] = xWidth / this.activeNode.length
              newNode['y'] = yWidth + (nodeType === 'double' ? 180 : 120)
              newNode['no'] = this.nodeNo + 1
              newNode['isRelation'] = true

              this.net.add('node', newNode)
              this.activeNode.forEach(node => {
                let newEdge = Object.assign({}, EDGE)
                newEdge['source'] = node._attrs.model.id
                newEdge['target'] = 'node' + Number(this.nodeNum + 1)
                newEdge['id'] = 'edge' + this.edgeNum
                newEdge['controlPoints'] = [
                  {
                    'x': node._attrs.model.x,
                    'y': node._attrs.model.y
                  },
                  {
                    'x': node._attrs.model.x,
                    'y': node._attrs.model.y + 100
                  }
                ]

                this.net.add('edge', newEdge)
                this.edgeNum++
              })
              // 添加关联指标结束后要把选中的状态去除
              Array.prototype.slice.call(containers, 0).forEach(container => {
                container.classList.remove('active')
              })
              this.nodeNum++
              this.nodeNo++
              this.metricNo++
              contextList.style.visibility = 'hidden'
              this.activeFlag = false
              /**@augments
               * 及时情况选中的数组，相应的x,y坐标
               */
              this.activeNode = []
              nodeHeight = []
              yWidth = 0
              xWidth = 0
              // this.adapt() // 添加完关联关系后及时适配
            }
          }
        }
      })



      // 读取数据
      this.readData(changeSizeFlag)

      // // 添加tooltip
      // this.net.tooltip({
      //   title: '标题', // @type {String} 标题
      //   split: ':',  // @type {String} 分割符号
      //   dx: 0,       // @type {Number} 水平偏移
      //   dy: -30        // @type {Number} 竖直偏移
      // })

      // this.net.node().tooltip(['name', 'name2'])

      this.net.edge().shape('VHV') // 默认连接线以这种·水平-竖直-水平的方式来连接节点

      //自定义tooltip
      let graphNode = document.getElementById(this.mountNode).getElementsByClassName('graph-container')[0]
      let tooltip =  G6.Util.createDOM(`
        <div class="g6-tooltip">
          <ul class="g6-tooltip-list">
            <li></li>
            <li></li>
          </ul>
        </div>
      `)
      // 鼠标移入tooltip就隐藏
      tooltip.onmouseenter = () => {
        tooltip.style.visibility = 'hidden'
      }

      // 添加g6-category-list右键菜单
      let categoryList = G6.Util.createDOM(`
          <ul class="g6-category-list context-menu-list">
            <li>添加关联指标</li>
          </ul>
      `)

      graphNode.appendChild(tooltip)
      graphNode.appendChild(categoryList)


      this.net.on('mouseenter', ev => {
        const item = ev.item
        let g6tooltip = document.getElementById(this.mountNode).getElementsByClassName('graph-container')[0].getElementsByClassName('g6-tooltip')[0]
        if (item && item._attrs.type === 'node') {
          let li = g6tooltip.getElementsByTagName('li')[0]
          let li2 = g6tooltip.getElementsByTagName('li')[1]
          g6tooltip.style.left = ev.domX + 'px'
          g6tooltip.style.top = ev.domY + 'px'
          g6tooltip.style.visibility = 'visible'
          if (item.getModel().nodeType === 'double' && item.getModel.shape !== 'shape-relation') {
            li.innerHTML = item.getModel().name ? item.getModel().name : '没有数据'
            li2.innerHTML = item.getModel().name2 ? item.getModel().name2 : '没有数据'
          } else {
            li.innerHTML = item.getModel().name ? item.getModel().name : '没有数据'
            li2.innerHTML = ''
          }
        }
      })
      this.net.on('mouseleave', ev => {
        const item = ev.item
        let g6tooltip = document.getElementById(this.mountNode).getElementsByClassName('graph-container')[0].getElementsByClassName('g6-tooltip')[0]
        if (item && item._attrs.type === 'node') {
          g6tooltip.style.visibility = 'hidden'
        }
      })


    },

    // 重新渲染
    reRender () {
      this.net.clear()
      let data = {
        'source': {
          'nodes': this.nodes,
          'edges': this.edges
        }
      }
      this.net.read(data)
      this.net.render() // 渲染画布
    },

    // 读取数据
    readData (changeSizeFlag) {
      if (changeSizeFlag) {
         // 如果存在数据就读取
        if (JSON.stringify(this.feature.styleConfig.config.data) !== '{}') {
          this.net.clear()
          let data = JSON.parse(this.feature.styleConfig.config.data)
          this.net.read(data) // 读取数据
          this.nodeNum = this.feature.styleConfig.config.nodeNum // 如果有数据及时把nodeNum更新成最新的
          this.nodeNo = data.source.nodes.length  // 如果有数据及时把nodeNo更新成最新的
          this.nodeId = `node${this.feature.styleConfig.config.nodeNo}`
          this.edgeNum = this.feature.styleConfig.config.edgeNum  // 如果有数据及时把edgeNum更新成最新的
          this.metricNo = this.feature.styleConfig.config.metricNo // 当前的指标编号等于保存数据时记录的指标编号
          this.net.render()
          this.isVisiual()
        } else {
          // this.nodeData = this.getData(this.data) // 把数据整合成需要的格式，一开始先把数据保存好
          let firstNode = NEW_NODE
          firstNode.count =  this.nodeData[this.metricNo] ? this.nodeData[this.metricNo].price : '' // 把查询到的数据找到对应的指标编码然后把价格渲染上去
          // 把第一条对应指标编码的名称渲染到节点上
          firstNode.name = this.nodeData[this.metricNo] ? this.nodeData[this.metricNo].metricName : ''

          firstNode.x = document.getElementById(this.mountNode).offsetWidth

          firstNode.precent = null

          firstNode.children = []
          firstNode.children2 = []

          this.nodes.push(firstNode)  // 把第一个节点放到节点数组里

          // 再次进入时清空nodeTypeList
          this.$store.commit('emptyNodeList', {
            index: this.index
          })

          // 通过vuex数据联动，把自己样式面板里的节点数量改变，后面配置维度需要用到
          this.$store.commit('addNodeNo', {
            index: this.index,
            type: {'type':'single'}
          })



          // 指标编号，代表有多少个指标，因为有的双节点需要用到两个指标，所以不能使用节点的编号，会对应不上
          this.metricNo++
          this.reRender()
        }

      }
    },

    // 点击自定义的保存按钮保存数据到vuex里面
    saveData () {
      const saveData = this.net.save()
      const json = JSON.stringify(saveData, null, 2); // 存储数据时格式化一下

      //把vuex的nodeTypeList更新
      // this.$store.commit('delNodeNo', {
      //   index: this.index,
      //   delNo: this.nodeNo,
      //   type: true
      // })
      // 提交到vuex里保存
      this.$store.commit('saveData', {
        index: this.index,
        json,
        metricNo: this.metricNo,
        nodeNum: this.nodeNum,
        edgeNum: this.edgeNum
      })
    },

    // 初始化三种节点样式
    initType (type) {
      // 锚点的配置
      const invalidCfg = {
        style: {
          fill: 'red',
          fillOpacity: 0.7
        },
        hoverStyle: {
          stroke: null
        },
        linkable: true
      }

      G6.registerNode(type, {
        cssSize: true, // 不使用内部 size 作为节点尺寸
        // 常规锚点
        getAnchorPoints () {
          return [
            // [0, 0.5],   // 左边中点 索引为 0
            // [1, 0.5]    // 右边中点 索引为 1
            [0.5, 0, invalidCfg], // 上边中点 索引为 0
            [0.5, 1, invalidCfg] // 下边中点 索引为 1
          ]
        },
        getHtml: (cfg) => {
          const model = cfg.model
          let container = null
          let domNode = null
          // 根据模板类型来创建对应的节点布局
          if (type === 'shape-double') {
            container = G6.Util.createDOM('<div class="node-container-content node-container-double"></div>')
            let status = ''
            if (model.precent !== null) {
              if (Number(model.precent) > 0) {
                status = 'up'
              } else if (Number(model.precent) < 0) {
                status = 'down'
              }
            }
            let status2 = ''
            if (model.precent2 !== null) {
              if (Number(model.precent2) > 0) {
                status = 'up'
              } else if (Number(model.precent2) < 0) {
                status = 'down'
              }
            }
            /**@augments
             * 对标题统一按下划线做截取功能
             * 百分比默认是null，只有在查询面板里查了数据才有
             * 注意双节点这里是有两个指标
             */
            domNode = `
              <div class="node-container-title node-container-success">
                <div class="hide">${model.id}</div>
                <div class="content">
                  <div class="node-no">${model.no}-1</div>
                  <p class="node-title">${model.name}</p>
                  <h3>${toThousands(model.count)}</h3>
                  <div class="tip">
                    <span>${model.precent === null ? '' : model.precent + '%'}</span>
                    <label class="node-status-${status}"></label>
                  </div>
                </div>
                <div class="line"></div>
                <div class="content">
                  <div class="node-no">${model.no}-2</div>
                  <p class="node-title">${model.name2}</p>
                  <h3>${toThousands(model.count2)}</h3>
                  <div class="tip">
                    <span>${model.precent2 === null ? '' : model.precent2 + '%'}</span>
                    <label class="node-status-${status2}"></label>
                  </div>
                </div>
              </div>`
          } else if (type === 'shape-relation') {
            let className = model.nodeType === 'single' ? 'node-container-single' : 'node-container-double'
            container = G6.Util.createDOM(`<div class="node-container-content ${className} node-container-shape"></div>`)
            let status = ''
            if (model.precent !== null) {
              if (Number(model.precent) > 0) {
                status = 'up'
              } else if (Number(model.precent) < 0) {
                status = 'down'
              }
            }
            domNode = `
              <div class="node-container-title node-container-success">
                <div class="hide">${model.id}</div>
                <div class="arrow-up"></div>
                <div class="content">
                  <div class="node-no">${model.no}</div>
                  <p class="node-title">${model.name}</p>
                  <h3>${toThousands(model.count)}</h3>
                  <div class="tip">
                    <span>${model.precent === null ? '' : model.precent + '%'}</span>
                    <label class="node-status-${status}"></label>
                  </div>
                </div>
              </div>`
          } else if (type === 'customNode') {
            container = G6.Util.createDOM('<div class="node-container-single node-container-content"></div>')
            let status = ''
            if (model.precent !== null) {
              if (Number(model.precent) > 0) {
                status = 'up'
              } else if (Number(model.precent) < 0) {
                status = 'down'
              }
            }
            domNode = `
              <div class="node-container-title node-container-success">
                <div class="hide">${model.id}</div>
                <div class="content">
                  <div class="node-no">${model.no}</div>
                  <p class="node-title">${model.name}</p>
                  <h3>${model.count ? toThousands(model.count) : '没有数据了' }</h3>
                  <div class="tip">
                    <span>${model.precent === null ? '' : model.precent + '%'}</span>
                    <label class="node-status-${status}"></label>
                  </div>
                </div>
              </div>`
          }
          const title = G6.Util.createDOM(domNode)
          // 删除按钮
          const botton = G6.Util.createDOM(`<button class="node-delete">×</button>`)
          // 添加按钮
          const addBtn = G6.Util.createDOM(`<button class="node-add">+</button>`)


          container.appendChild(title)
          container.appendChild(botton)
          container.appendChild(addBtn)

          botton.onclick = async () => {
            // 给根节点添加的，只有根节点有这个属性
            if (model.nodeNo === 1) {
              this.$message.error('不能删除根节点')
            } else {

              this.net.remove(this.net.find(model.id)) // 删除节点

              // 去nodeTypeList里根据model的no判断当前指标是否是明细指标，如果是汇总指标就更新数据，如果是明细指标不更新
              // 如果配过维度了，删除节点暂时不更新数据，当节点删完后又要还原
              if (this.feature.styleConfig.config.nodeNo === 0) {
                if (this.nodeTypeList[model.no - 1]) {
                  if (!this.nodeTypeList[model.no - 1].disabled) {
                    await this.updateData(this.gatherData) // 删除后更新节点数据
                  }
                }
              }

              // 更新节点编号之前删除nodeTypeList子项
              this.$store.commit('delNodeNo', {
                index: this.index,
                delNo: model.no - 1
              })



              // 更新节点编号
              this.net.getNodes().forEach(item => {
                if (item._attrs.model.no > model.no) {
                  this.net.update(item, {
                    'no': item._attrs.model.no - 1
                  })
                }
              })

              this.nodeNo--  // 把编号减少一个

              // 减少一个指标编号，判断是不是拆分后的指标，如果是拆分后的就不减少
              // 如果是拆分后的节点删除不更新编号
              if ((this.nodeTypeList[model.no - 1] && !this.nodeTypeList[model.no - 1].disabled) || this.nodeTypeList[model.no - 1] === undefined) {
                if (model.nodeType === 'double' && model.shape !== 'shape-relation') {
                  this.metricNo = this.metricNo - 2
                } else {
                  this.metricNo--
                }
              }
              if (this.net.find(model.parentId)) {
                this.net.find(model.parentId)._attrs.model.delItem.push({x: model.x, y: model.y}) // 把删除掉的节点位置保存一下
                if(model.nodeType === 'single' || model.shape === 'shape-relation') {
                  this.net.find(model.parentId)._attrs.model.children = this.net.find(model.parentId)._attrs.model.children.filter(item => {
                    return item.id !== model.id
                  }) // 删除后及时把父节点children里相应子节点删除
                } else {
                  this.net.find(model.parentId)._attrs.model.children2 = this.net.find(model.parentId)._attrs.model.children2.filter(item => {
                    return item.id !== model.id
                  }) // 删除后及时把父节点children里相应子节点删除
                }
              }

              // 如果删除只剩下一个节点了，就把metricNo重置为0
              if (this.net.getNodes().length === 1) {
                this.metricNo = 1
                this.net.getNodes().getModel().children = []
                this.net.getNodes().getModel().children2 = []
              }
              // 暂时不做
              // if (this.net.getNodes().length && this.net.getNodes().length > 5) {
              //   this.adapt() // 删完节点后及时适配
              // }

              // 删除节点后隐藏tooltip
              let g6tooltip = document.getElementById(this.mountNode).getElementsByClassName('graph-container')[0].getElementsByClassName('g6-tooltip')[0]
              g6tooltip.style.visibility = 'hidden'

              this.net.refresh()  // 画布刷新
            }
          }

          // 点击+弹出的list
          const list = G6.Util.createDOM(`
            <ul class="g6-category-list">
              <li>添加单指标</li>
              <li>添加双指标</li>
              <li>添加关系指标</li>
            </ul>
          `)

          addBtn.onclick =  () => {
            container.appendChild(list)
            // 点击加号后隐藏tooltip
            let g6tooltip = document.getElementById(this.mountNode).getElementsByClassName('graph-container')[0].getElementsByClassName('g6-tooltip')[0]
            g6tooltip.style.visibility = 'hidden'
            event.stopPropagation() // 阻止事件冒泡
          }


          list.getElementsByTagName('li')[0].onclick = async (event) => {
            let offset = 120 // 定义多指标和单指标的间距常量
            if (type === 'shape-double') {
              offset = 180
            }
            console.log(this.metricNo, '===')
            // 必须要写在里面，否则this.nodeNum 不能更新
            let newNode = JSON.parse(JSON.stringify(NODE))
            newNode['id'] = 'node' + Number(this.nodeNum + 1)
            newNode['name'] = this.nodeData[this.metricNo] ? this.nodeData[this.metricNo].metricName : ''
            newNode['count'] = this.nodeData[this.metricNo] ? this.nodeData[this.metricNo].price : '没有数据了'
            newNode['metricCode'] = this.nodeData[this.metricNo] ? this.nodeData[this.metricNo].metricCode : ''
            newNode['metricName'] = this.nodeData[this.metricNo] ? this.nodeData[this.metricNo].metricName : ''
            newNode['x'] = model.x
            newNode['y'] = model.y + offset
            newNode['no'] = this.nodeNo + 1

            let newEdge = Object.assign({}, EDGE)
            newEdge['source'] = model.id
            newEdge['target'] = 'node' + Number(this.nodeNum + 1)
            newEdge['id'] = 'edge' + this.edgeNum
            newEdge['controlPoints'] = [
              {
                'x': model.x,
                'y': model.y
              },
              {
                'x': model.x,
                'y': model.y + offset
              }
            ]
            // 判断当前点击节点是否存在已删除的节点，如果存在就把新节点的位置放在删除节点的位置，放完后同时更新delItem数组
            if (model.children.length === 0 && model.children2.length === 0) {
              newNode.x = await this.calCoordinate(newNode, model)
              model.delItem = []
            } else {
              if (model.delItem && model.delItem.length !== 0) {
                newNode.x = model.delItem[0].x
                newNode.y = model.delItem[0].y
                model.delItem.shift()
              } else {
                newNode.x = await this.calCoordinate(newNode, model)
              }
            }

            this.nodeNum++
            this.edgeNum++
            this.nodeNo++
            this.metricNo++
            newNode.parentId = model.id
            model.children.push(newNode)
            this.net.add('node', newNode)
            this.net.add('edge', newEdge)
            this.$store.commit('addNodeNo', {
              index: this.index,
              type: {'type':'single'}
            })
            // console.log(this.net, 'net')
            container.removeChild(list)
            this.net.refresh()
          }
          list.getElementsByTagName('li')[1].onclick = async (event) => {
            let offset = 169 // 定义多指标和单指标的间距常量
            if (type === 'shape-double') {
              offset = 240
            }
            // 必须要写在里面，否则this.nodeNum 不能更新
            let newNode = JSON.parse(JSON.stringify(NODE))

            newNode['id'] = 'node' + Number(this.nodeNum + 1)
            newNode['name'] = this.nodeData[this.metricNo] ? this.nodeData[this.metricNo].metricName : ''
            newNode['count'] = this.nodeData[this.metricNo] ? this.nodeData[this.metricNo].price : '没有数据了'
            newNode['metricCode'] = this.nodeData[this.metricNo] ? this.nodeData[this.metricNo].metricCode : ''
            newNode['metricName'] = this.nodeData[this.metricNo] ? this.nodeData[this.metricNo].metricName : ''
            newNode['shape'] = 'shape-double'
            newNode['name2'] = this.nodeData[this.metricNo + 1] ? this.nodeData[this.metricNo + 1].metricName : ''
            newNode['count2'] = this.nodeData[this.metricNo + 1] ? this.nodeData[this.metricNo + 1].price : '没有数据了'
            newNode['metricCode2'] = this.nodeData[this.metricNo + 1] ? this.nodeData[this.metricNo + 1].metricCode : ''
            newNode['metricName2'] = this.nodeData[this.metricNo + 1] ? this.nodeData[this.metricNo + 1].metricName : ''
            newNode['x'] = model.x
            newNode['y'] = model.y + offset
            newNode['no'] = this.nodeNo + 1
            newNode['nodeType'] = 'double'


            let newEdge = Object.assign({}, EDGE)
            newEdge['source'] = model.id
            newEdge['target'] = 'node' + Number(this.nodeNum + 1)
            newEdge['id'] = 'edge' + this.edgeNum
            newEdge['controlPoints'] = [
              {
                'x': model.x,
                'y': model.y
              },
              {
                'x': model.x,
                'y': model.y + offset
              }
            ]

            /**
             * 1、判断当前点击节点是否存在已删除的节点，如果存在就把新节点的位置放在删除节点的位置，放完后同时更新delItem数组
             * 2、如果不存在已删除的节点，就根据目前已经存在的节点给新节点放一个位置
             * 3、具体逻辑是按奇偶性来判断，第一个默认是原来节点的正下方位置，底下偶数个就放在左边位置，如果是奇数个就放在右边位置
             * 4、由于节点类型不一样，单指标节点和双指标节点的宽度不一样，所以单独存放，children存放单节点信息，children2存放双节点信息
             * 5、这只是一个大概的位置表示方法，由于节点添加没有规律，场景较多，节点类型不一，所以多的时候会有误差，但是可以自己拖动位置，以拖动为主
            */
           if (model.children.length === 0 && model.children2.length === 0) {
              newNode.x = await this.calCoordinate(newNode, model)
              model.delItem = []
            } else {
              if (model.delItem && model.delItem.length !== 0) {
                newNode.x = model.delItem[0].x
                newNode.y = model.delItem[0].y
                model.delItem.shift()
              } else {
                newNode.x = await this.calCoordinate(newNode, model)
              }
            }

            this.nodeNum++
            this.edgeNum++
            this.nodeNo++
            this.metricNo = this.metricNo + 2
            newNode.parentId = model.id // 把父节点的信息保存一下
            model.children2.push(newNode)
            this.$store.commit('addNodeNo', {
              index: this.index,
              type: {'type':'double'}
            })
            this.net.add('node', newNode) // 添加节点
            this.net.add('edge', newEdge) // 添加边
            container.removeChild(list) // 加完之后删除list
            this.net.refresh()
          }
          list.getElementsByTagName('li')[2].onclick = async (event) => {
            // 必须要写在里面，否则this.nodeNum 不能更新
            let newNode = JSON.parse(JSON.stringify(NODE))
            newNode['id'] = 'node' + Number(this.nodeNum + 1)
            newNode['name'] = this.nodeData[this.metricNo] ? this.nodeData[this.metricNo].metricName : ''
            newNode['count'] = this.nodeData[this.metricNo] ? this.nodeData[this.metricNo].price : '没有数据了'
            newNode['metricCode'] = this.nodeData[this.metricNo] ? this.nodeData[this.metricNo].metricCode : ''
            newNode['metricName'] = this.nodeData[this.metricNo] ? this.nodeData[this.metricNo].metricName : ''
            newNode['shape'] = 'shape-relation',
            newNode['x'] = model.x
            newNode['y'] = model.y + ((model.nodeType === 'double') && (model.shape !== 'shape-relation') ? 180 : 130)
            newNode['no'] = this.nodeNo + 1
            newNode['nodeType'] = model.nodeType

            let newEdge = Object.assign({}, EDGE)
            newEdge['source'] = model.id
            newEdge['target'] = 'node' + Number(this.nodeNum + 1)
            newEdge['id'] = 'edge' + this.edgeNum
            newEdge['controlPoints'] = [
              {
                'x': model.x,
                'y': model.y
              },
              {
                'x': model.x,
                'y': model.y + 240
              }
            ]

            // 判断当前点击节点是否存在已删除的节点，如果存在就把新节点的位置放在删除节点的位置，放完后同时更新delItem数组
            if (model.children.length === 0 && model.children2.length === 0) {
              newNode.x = await this.calCoordinate(newNode, model)
              model.delItem = []
            } else {
              if (model.delItem && model.delItem.length !== 0) {
                newNode.x = model.delItem[0].x
                newNode.y = model.delItem[0].y
                model.delItem.shift()
              }else {
                // 根据当前已经添加的节点个数判断新增节点应该放在什么位置
                newNode.x = await this.calCoordinate(newNode, model)
              }
            }
            this.nodeNum++
            this.edgeNum++
            this.nodeNo++
            this.metricNo++
            newNode.parentId = model.id
            model.children.push(newNode)
            this.$store.commit('addNodeNo', {
              index: this.index,
              type: {'type':'single'}
            })
            this.net.add('node', newNode)
            this.net.add('edge', newEdge)
            container.removeChild(list)
            this.net.refresh()
          }

          return container
        },
        afterDraw: async (cfg, group, keyShape) => {
          if (this.net.find(cfg.model.id) && type === 'shape-relation') {
            let edges = await this.net.find(cfg.model.id).getEdges() // 是异步请求，不然获取会有延迟
            edges[0] && edges[0].hide() // 隐藏原来的连接线
          }
        }
      }, 'html')
    },

    /**@augments
     * res: 根据指标查出来的数据，包括查询面板筛选出来的数据，汇总指标的数据
     * res2: 明细指标的数据
     * 方法说明：更新节点数据的方法
     * 要判断数据里是否带有对比字段，如果有的话要更新成对比数据和对比率
     * 同时要判断节点是双节点还是单节点，双节点的时候要注意一个节点包含两个指标的数据
     * 所以在遍历的时候没有用自身的index，而是新建了一个arrayIndex作为索引，双节点要加2，其他加1
     *
     */
    updateData(res, updateAll = false) {
      let nodes = this.net.getNodes()
      let arrIndex = 0 // 记录明细指标更新节点的个数索引
      let arrIndex2 = 0 // 记录汇总指标更新节点的个数索引
      res && nodes.forEach((item, index) => {
        if (updateAll) {
          // 不是明细指标，删除节点的时候更新数据
          if (this.nodeData[arrIndex2]) {
            // 如果是双指标
            if (item._attrs.model.nodeType === 'double' && item._attrs.model.shape !== 'shape-relation') {
              this.net.update(item, {
                name: this.nodeData[arrIndex2].metricName ? this.nodeData[arrIndex2].metricName : '',
                count: this.nodeData[arrIndex2].comparePrice ? this.nodeData[arrIndex2].comparePrice : '没有数据了',
                precent: this.nodeData[arrIndex2].precent ? this.nodeData[arrIndex2].precent : null,
                metricName: this.nodeData[arrIndex2].metricName ? this.nodeData[arrIndex2].metricName : '',
                metricCode: this.nodeData[arrIndex2].metricCode ? this.nodeData[arrIndex2].metricCode : '',

                name2: this.nodeData[arrIndex2 + 1] ? (this.nodeData[arrIndex2 + 1].metricName ? this.nodeData[arrIndex2 + 1].metricName : '') : '',
                count2: this.nodeData[arrIndex2 + 1] ? (this.nodeData[arrIndex2 + 1].comparePrice ? this.nodeData[arrIndex2 + 1].comparePrice : '没有数据了') : '没有数据了',
                precent2: this.nodeData[arrIndex2 + 1] ? (this.nodeData[arrIndex2 + 1].precent ? this.nodeData[arrIndex2 + 1].precent : null) : null,
                metricName2: this.nodeData[arrIndex2 + 1] ? (this.nodeData[arrIndex2 + 1].metricName ? this.nodeData[arrIndex2 + 1].precent : '') : '',
                metricCode2: this.nodeData[arrIndex2 + 1] ? (this.nodeData[arrIndex2 + 1].metricCode ? this.nodeData[arrIndex2 + 1].precent : '') : '',
              })
              arrIndex2 = arrIndex2 + 2
            } else {
              this.net.update(item, {
                name: this.nodeData[arrIndex2].metricName ? this.nodeData[arrIndex2].metricName : '',
                count: this.nodeData[arrIndex2].comparePrice ? this.nodeData[arrIndex2].comparePrice : this.nodeData[arrIndex2].price ,
                precent: this.nodeData[arrIndex2].precent ? this.nodeData[arrIndex2].precent : null,
                metricName: this.nodeData[arrIndex2].metricName ? this.nodeData[arrIndex2].metricName : '',
                metricCode: this.nodeData[arrIndex2].metricCode ? this.nodeData[arrIndex2].metricCode : '',
              })
              arrIndex2++
            }
          } else {
            this.net.update(item, {
              count: '没有数据了',
              precent: null,
              count2: '没有数据了',
              precent2: null,
              metricName:  '',
              metricCode:  '',
              metricName2:  '',
              metricCode2:  '',
            })
            arrIndex2++
          }
        } else {

          // 如果是复制出来的节点，也就是变成了明细指标了，才会更新数据
          if (this.nodeTypeList[index].isDetailNode) {
            if (this.nodeData2[arrIndex]) {
              // 如果是双指标
              if (item._attrs.model.nodeType === 'double' && item._attrs.model.shape !== 'shape-relation') {
                this.net.update(item, {
                  // name: this.nodeData[arrIndex].name ? this.nodeData[arrIndex].name +  this.nodeData[arrIndex].metricName : '',
                  count: this.nodeData2[arrIndex].comparePrice ? this.nodeData2[arrIndex].comparePrice : '没有数据了',
                  precent: this.nodeData2[arrIndex].precent ? this.nodeData2[arrIndex].precent : null,
                  metricName: this.nodeData2[arrIndex].metricName ? this.nodeData2[arrIndex].metricName : '',
                  metricCode: this.nodeData2[arrIndex].metricCode ? this.nodeData2[arrIndex].metricCode : '',

                  // name2: this.nodeData[arrIndex].name2 ? this.nodeData[arrIndex].name2 + this.nodeData[arrIndex].metricName2 : '',
                  count2: this.nodeData2[arrIndex + 1] ? (this.nodeData2[arrIndex + 1].comparePrice ? this.nodeData2[arrIndex + 1].comparePrice : '没有数据了') : '没有数据了',
                  precent2: this.nodeData2[arrIndex + 1] ? (this.nodeData2[arrIndex + 1].precent ? this.nodeData2[arrIndex + 1].precent : null) : null,
                  metricName2: this.nodeData2[arrIndex + 1].metricName2 ? this.nodeData2[arrIndex + 1].precent : '',
                  metricCode2: this.nodeData2[arrIndex + 1].metricCode2 ? this.nodeData2[arrIndex + 1].precent : '',
                })
                arrIndex = arrIndex + 2
              } else {
                this.net.update(item, {
                  // name: this.nodeData[arrIndex].name ? this.nodeData[arrIndex].name + this.nodeData[arrIndex].metricName : '',
                  count: this.nodeData2[arrIndex].comparePrice ? this.nodeData2[arrIndex].comparePrice : this.nodeData2[arrIndex].price ,
                  precent: this.nodeData2[arrIndex].precent ? this.nodeData2[arrIndex].precent : null,
                  // metricName: this.nodeData2[arrIndex].metricName ? this.nodeData2[arrIndex].metricName : '',
                  // metricCode: this.nodeData2[arrIndex].metricCode ? this.nodeData2[arrIndex].metricCode : '',
                })
                arrIndex++
              }
            } else {
              this.net.update(item, {
                count: '没有数据了',
                precent: null,
                count2: '没有数据了',
                precent2: null,
                metricName:  '',
                metricCode:  '',
                metricName2:  '',
                metricCode2:  '',
              })
              arrIndex++
            }
          } else {
            // 不是明细指标，删除节点的时候更新数据
            if (this.nodeData[arrIndex2]) {
              // 如果是双指标
              if (item._attrs.model.nodeType === 'double' && item._attrs.model.shape !== 'shape-relation') {
                this.net.update(item, {
                  name: this.nodeData[arrIndex2].metricName ? this.nodeData[arrIndex2].metricName : '',
                  count: this.nodeData[arrIndex2].comparePrice ? this.nodeData[arrIndex2].comparePrice : '没有数据了',
                  precent: this.nodeData[arrIndex2].precent ? this.nodeData[arrIndex2].precent : null,
                  metricName: this.nodeData[arrIndex2].metricName ? this.nodeData[arrIndex2].metricName : '',
                  metricCode: this.nodeData[arrIndex2].metricCode ? this.nodeData[arrIndex2].metricCode : '',

                  name2: this.nodeData[arrIndex2 + 1] ? (this.nodeData[arrIndex2 + 1].metricName ? this.nodeData[arrIndex2 + 1].metricName : '') : '',
                  count2: this.nodeData[arrIndex2 + 1] ? (this.nodeData[arrIndex2 + 1].comparePrice ? this.nodeData[arrIndex2 + 1].comparePrice : '没有数据了') : '没有数据了',
                  precent2: this.nodeData[arrIndex2 + 1] ? (this.nodeData[arrIndex2 + 1].precent ? this.nodeData[arrIndex2 + 1].precent : null) : null,
                  metricName2: this.nodeData[arrIndex2 + 1] ? (this.nodeData[arrIndex2 + 1].metricName ? this.nodeData[arrIndex2 + 1].metricName : '')  : '',
                  metricCode2: this.nodeData[arrIndex2 + 1] ? (this.nodeData[arrIndex2 + 1].metricCode ? this.nodeData[arrIndex2 + 1].metricCode : '') : '',
                })
                arrIndex2 = arrIndex2 + 2
              } else {
                this.net.update(item, {
                  name: this.nodeData[arrIndex2].metricName ? this.nodeData[arrIndex2].metricName : '',
                  count: this.nodeData[arrIndex2].comparePrice ? this.nodeData[arrIndex2].comparePrice : this.nodeData[arrIndex2].price ,
                  precent: this.nodeData[arrIndex2].precent ? this.nodeData[arrIndex2].precent : null,
                  metricName: this.nodeData[arrIndex2].metricName ? this.nodeData[arrIndex2].metricName : '',
                  metricCode: this.nodeData[arrIndex2].metricCode ? this.nodeData[arrIndex2].metricCode : '',
                })
                arrIndex2++
              }
            } else {
              this.net.update(item, {
                count: '没有数据了',
                precent: null,
                count2: '没有数据了',
                precent2: null,
                metricName:  '',
                metricCode:  '',
                metricName2:  '',
                metricCode2:  '',
              })
              arrIndex2++
            }
          }
        }
      })
    },
    /**@augments
     * 这个方法是用来更新节点数据的，用于复制节点时候用，因为配置维度后要把配置维度的这个节点开始所有的子节点要重新更新数据
     * 更新数据只能采用this.net.update()方法
     * copyInde:更新节点的编号，默认是第一条
     * currentNode: 当前需要更新的节点
     */
    upDateNodes (copyIndex, currentNode) {
      let currentNodeModel = currentNode._attrs.model
      this.net.update(currentNode, {
        name: this.detailData[copyIndex][this.feature.dimList[0].dimCode] === '' ? '当前维值为空' : (this.detailData[copyIndex][this.feature.dimList[0].dimCode] + currentNodeModel.metricName),
        count: this.detailData[copyIndex][currentNodeModel.metricCode] ? this.detailData[copyIndex][currentNodeModel.metricCode] : '没有数据了',
        name2: this.detailData[copyIndex][this.feature.dimList[0].dimCode] === '' ? '当前维值为空' : (this.detailData[copyIndex][this.feature.dimList[0].dimCode] + currentNodeModel.metricName2),
        count2: this.detailData[copyIndex][currentNodeModel.metricCode2] ? this.detailData[copyIndex][currentNodeModel.metricCode2] : '没有数据了',
        precent: null,
        precent2: null // 前面定义了，只有是null才不会显示
      });
    },
    // 准备拷贝
    startCopyNodes (currentNode, parentNode, copyIndex) {
      this.copyNodes(currentNode, parentNode, true, copyIndex) // 先复制当前选中的节点
      currentNode.getLinkNodes().length !== 1 && this.getChildNodes(currentNode, copyIndex)
    },
    // 配置维度
    setDimension (value) {
      // 判断select选项是否为空，如果为空则不操作
      if (parseInt(value)) {
        G6.Util.each(this.net.getNodes(), node => {
          if (node.getModel().no === value) {
            this.nodeId = node.getModel().id
          }
        })
        let currentNode = this.net.find(this.nodeId) // 当前节点
        let currentNodeModel = currentNode._attrs.model
        let parentNode = this.net.find(currentNodeModel.parentId) // 当前节点的父节点


        if (currentNodeModel.name === '') {
          this.$message.error('当前节点没数据，不能配置维度哦');
        } else {
         // 把所有节点置灰
          // this.$store.commit('disableAllNo', {
          //   index: this.index
          // })

           /**@augments
           * 此处判断维值是否大于3，默认只复制3遍，太多的话会很难看
           */
          if (this.detailData.length > 3){
            for(let i = 0; i < 3; i++) {
              this.startCopyNodes(currentNode, parentNode, i)
            }
          } else {
            for (let i = 0; i < this.detailData.length; i++) {
              this.startCopyNodes(currentNode, parentNode, i)
            }
          }
        }
      }
    },

    /**@augments
     * 复制节点方法
     * 1、判断当前节点是否有子节点，获取关联节点只能获取一层，也就是只能获取到父节点或子节点，无法获取孙子节点
     * 2、父节点默认放在数组的第一个，数组里不包括自己
     * 3、为了偷懒，新节点直接复制的当前节点，但是此处有坑，用Object.assign()进行复制，但不能深度复制，不能简单的使用let newNode = currentNodeModel，否则会改变原节点的信息
     * 4、同样复制的节点需要进行简单的位置定位，默认采用之前的方法进行位置设定
     */
    copyNodes (currentNode, parentNode, flag, copyIndex) {
      let currentNodeModel = currentNode._attrs.model // 当前选中的节点model，里面可以直接取数据
      let parentNodeModel = parentNode._attrs.model // 当前节点的父节点的model
      let newNode = Object.assign({}, currentNodeModel)
      // 更新一个后及时把id加1
      newNode.id = 'node' + Number(this.nodeNum + 1)
      newNode.no = this.nodeNo + 1
      // 复制边
      let newEdge = Object.assign({}, currentNode.getEdges()[0]._attrs.model)
      newEdge.source = newNode.parentId
      newEdge.target = newNode.id
      newEdge.id = 'edge' + this.edgeNum
      // 把子节点清空，否则会复制过来
      newNode.children = []
      newNode.children2 = []
      newNode.delItem = []
      // 如果是第一次复制，也就是将配置维度的节点更新掉数据，这个节点是已经存在的，而不是新增的
      if (copyIndex === 0) {
        // 更新完之后就变成了明细指标，就不能再对它配维度了
        this.$store.commit('updateNodeNo', {
          index: this.index,
          num: currentNodeModel.no
        })
        this.upDateNodes(copyIndex, currentNode) // 当第一个维值的数据才需要更新，把原来节点数据更新成第一个维值的，其他复制的节点不需要更新
        return
      }
      // flag是判断是不是复制的根节点
      if (flag) {
        newNode.x = this.calCoordinate(newNode, parentNodeModel)
        // 如果是单节点或者是关联指标，就往children里存放子节点，否则往children2里存放子节点，是放的双指标，必须要分开存放，因为单指标和双指标大小不一样，会影响计算维值
        currentNodeModel.nodeType === 'single' || currentNodeModel.shape === 'shape-relation' ? parentNodeModel.children.push(newNode) : parentNodeModel.children2.push(newNode)
      } else {
        // 如果不是关联关系的节点才去寻找父节点，否则找不到，因为关联关系的节点并没有配置父子关系
        let nodeRoot = !newNode.isRelation ? this.getParentNode(currentNodeModel, parentNodeModel) : null
        // 判断当前复制的节点是不是下拉框选中节点的直接子节点
        if (this.record.length === 0) {
          let copyParentNodeModel = ''
          if (currentNodeModel.nodeType === 'single' || currentNodeModel.shape === 'shape-relation') {
            copyParentNodeModel = (parentNodeModel.nodeType === 'single' || parentNodeModel.shape === 'shape-relation') ? nodeRoot.children[nodeRoot.children.length - 1] : nodeRoot.children2[nodeRoot.children2.length - 1]
            newNode.x = this.calCoordinate(newNode, copyParentNodeModel) // 计算x坐标，y轴坐标不需要计算
            copyParentNodeModel.children.push(newNode)  // 及时放入复制节点父节点的下面，children搞错的话底下判断父子关系会有问题

          } else {
            copyParentNodeModel = (parentNodeModel.nodeType === 'single' || parentNodeModel.shape === 'shape-relation') ? nodeRoot.children[nodeRoot.children.length - 1] : nodeRoot.children2[nodeRoot.children2.length - 1]
            newNode.x = this.calCoordinate(newNode, copyParentNodeModel)
            copyParentNodeModel.children2.push(newNode)
          }
          newEdge.source = copyParentNodeModel.id
          newNode.parentId = copyParentNodeModel.id
        } else {
          // 这里是当前复制的节点不是下拉框配置维度节点的直接子节点，可能是孙子节点
            if (!newNode.isRelation) {
              let model = (this.net.find(this.nodeId)._attrs.model.nodeType === 'single' || this.net.find(this.nodeId)._attrs.model.shape === 'shape-relation') ? nodeRoot.children[nodeRoot.children.length - 1] : nodeRoot.children2[nodeRoot.children2.length - 1]
              for(let i = this.record.length -1; i>=0; i--) {
                model = this.getCopyParentNode(i, model)  // 获取父节点, 获取父节点的逻辑是当前下拉框的配置维度的父节点开始一级一级找到的当前复制节点的父节点
              }
              newEdge.source = model.id
              newNode.parentId = model.id

              newNode.x = this.calCoordinate(newNode, model)
              this.record = []  // 复制完一个节点后清空数据

              // push  children的时候要在计算坐标之后，不然计算会有偏差
              if (newNode.nodeType === 'single' || newNode.shape === 'shape-relation') {
                model.children.push(newNode)
              } else {
                model.children2.push(newNode)
              }
          }
        }
      }
      // 配置新复制节点的数据，用维值拼上原来节点的名称

      // 判断维值是否为空，如果为空时就把名称改为空
      if (this.detailData[copyIndex][this.feature.dimList[0].dimCode] === '') {
        newNode.name = '当前维值为空'
      } else {
        newNode.name =  this.detailData[copyIndex][this.feature.dimList[0].dimCode]  + newNode.metricName
      }
      newNode.count = this.detailData[copyIndex][newNode.metricCode] ? this.detailData[copyIndex][newNode.metricCode] : '没有数据了'
      newNode.name2 = newNode.name2 ? (this.detailData[copyIndex][this.feature.dimList[0].dimCode]  + newNode.metricName2) : ''
      newNode.count2 = newNode.count2 === '没有数据了' ? '没有数据了' : this.detailData[copyIndex][newNode.metricCode2]

      // 如果是有对比日期的情况下配维度要把对比率等数据清除掉，因为没有对比率数据
      newNode.precent = null
      newNode.precent2 = null

      this.nodeNum++
      this.edgeNum++
      this.nodeNo++


      // 复制节点的时候同步增加指标编号
      // if (newNode.nodeType === 'double' && newNode.shape !== 'shape-relation') {
      //   this.metricNo = this.metricNo + 2
      // } else {
      //   this.metricNo++
      // }

      // 加了节点后同步改变下拉框中节点的数量
      this.$store.commit('addNodeNo', {
        index: this.index,
        type: {'type': currentNodeModel.nodeType},
        disabled: true,
        isDetailNode: true
      })
      this.net.add('node', newNode)
      this.net.add('edge', newEdge)
      this.net.refresh()
    },

    // 查询面板更新对比数据时判断子节点的指标编码
    getChildMetricsCode (currentNode) {
      if (currentNode && currentNode.getLinkNodes().length !== 1) {
        currentNode.getLinkNodes().forEach((item, index) => {
          if (index !== 0 && !item._attrs.model.isRelation) { // 判断当前节点不是自己的父节点，并且不是关联关系的节点
            this.metricsNodes.push(item)
            if (item.getLinkNodes().length !== 1) {
              this.getChildMetricsCode(item)
            }
          }
        })
      }
    },


    // 循环判断是否有子节点
    getChildNodes (currentNode, copyIndex) {
      currentNode.getLinkNodes().forEach((item, index) => {
        if (index !== 0 && !item._attrs.model.isRelation) { // 判断当前节点不是自己的父节点，并且不是关联关系的节点
          this.copyNodes(item, this.net.find(item._attrs.model.parentId), false, copyIndex)
          if (item.getLinkNodes().length === 1) {
            this.record = []  // 如果没有子节点了就清楚存放的信息
          } else {
            this.getChildNodes(item, copyIndex)
          }
        }
      })
    },

    // 寻找复制节点的父节点
    // 用record来存放当前要复制节点的父节点开始的位置，比如父节点的索引，类型和形状要存放起来，越往后存放的是越高的祖父节点
    getParentNode (currentNodeModel, parentNodeModel) {
      if (parentNodeModel.id === this.nodeId) {
        let nodeRoot = this.net.find(this.net.find(this.nodeId)._attrs.model.parentId)._attrs.model  // 找到最顶层的根节点
        return nodeRoot
      } else {
        let pnm = this.net.find(parentNodeModel.parentId)._attrs.model
        // 根据判断是单节点还是双节点来决定在children里找还是在children2里找
        if (parentNodeModel.nodeType === 'single' || parentNodeModel.shape === 'shape-relation') {
          pnm.children.forEach((item, index) => {
            if (item.id === parentNodeModel.id) {
              this.record.push({'type': parentNodeModel.nodeType, 'loc': index, 'shape': parentNodeModel.shape})
            }
          })
        } else {
          pnm.children2.forEach((item, index) => {
            if (item.id === parentNodeModel.id) {
              this.record.push({'type': parentNodeModel.nodeType, 'loc': index, 'shape': parentNodeModel.shape})
            }
          })
        }
        return this.getParentNode(parentNodeModel, pnm) // 如果没到当前下拉框配置维度的直接子节点就继续寻找，直到找到为止
      }
    },

    // 计算坐标
    // 逻辑还是一样，根据节点类型来判断，写一个单节点的坐标，一个双节点的，总体还是奇偶判断
    calCoordinate (currentNodeModel, parentNodeModel) {
      if (currentNodeModel.nodeType === 'single' || currentNodeModel.shape === 'shape-relation') {
        if ((Math.floor(parentNodeModel.children2.length / 2) + parentNodeModel.children.length + 1) % 2 === 0) {
            return parentNodeModel.x - 230 * (Math.floor(parentNodeModel.children2.length / 2) + parentNodeModel.children.length + 1) / 2
          } else if ((Math.floor(parentNodeModel.children2.length / 2) + parentNodeModel.children.length) % 2 === 0 ) {
            return parentNodeModel.x + 230 * (Math.floor(parentNodeModel.children2.length / 2) + parentNodeModel.children.length) / 2
          }
      } else if (currentNodeModel.nodeType === 'double') {
          if ((Math.floor(parentNodeModel.children2.length / 2) + parentNodeModel.children.length + 1) % 2 === 0 || parentNodeModel.children2.length === 0) {
            let xLength = 0
            let base = 58
            if ((parentNodeModel.children2.length + (parentNodeModel.children.length * 2)) % 2 === 0 && parentNodeModel.children2.length !== 0) {
              xLength = Math.ceil((parentNodeModel.children2.length + 3) / 2)
              base = 160
            } else if ((parentNodeModel.children2.length + (parentNodeModel.children.length * 2)) % 2 !== 0 && parentNodeModel.children2.length !== 0) {
              xLength = Math.ceil(parentNodeModel.children2.length / 2)
              base = 102
            } else {
              if (parentNodeModel.children.length !== 0) {
                xLength = Math.ceil((parentNodeModel.children.length) / 2)
                base = parentNodeModel.children.length * 170
              }
            }
            return parentNodeModel.x - base * Math.ceil((xLength + parentNodeModel.children.length + 1) / 2)
          } else if ((Math.floor(parentNodeModel.children2.length / 2) + parentNodeModel.children.length) % 2 === 0) {
            let xLength = 1
            let base = 58
            if ((parentNodeModel.children2.length) % 2 === 0) {
              xLength = Math.ceil((parentNodeModel.children2.length + 3) / 2)
              base = 160
            } else if ((parentNodeModel.children2.length) % 2 !== 0 && parentNodeModel.children2.length !== 1) {
              xLength = Math.ceil(parentNodeModel.children2.length / 2)
              base = 102
            }
            return parentNodeModel.x + base * Math.ceil((xLength + parentNodeModel.children.length) / 2)
          }
      }
    },

    // 获取要复制节点的复制后节点的父节点，一层层往下找，直到找到要复制节点相应位置复制节点的父节点为止
    getCopyParentNode (i, nodeRoot) {
      let model = {}
      if (this.record[i].type === 'single' || this.record[i].shape === 'shape-relation') {
        model = nodeRoot.children[this.record[i].loc]
      } else {
        model = nodeRoot.children2[this.record[i].loc]
      }
      return model
    }
  },
  // 离开页面时及时把所有节点的children清空，否则添加节点时会有位置问题，同时把vuex里下拉框里的节点删掉
  async beforeDestroy () {
    this.net.getNodes().forEach((item, index) => {
      item._attrs.model.children = []
      item._attrs.model.children2 = []
    })
    // 释放监听
    bus.$off(`resizeOrMove_${this.index}`)
    bus.$off(`updateQuery_${this.index}`)
    bus.$off(`updateData_${this.index}`)
    bus.$off('updateOption')
    bus.$off('beforeSave')
  }
}
</script>

<style lang="less">
  body{
    margin: 0;
  }
  .g6-html-node-container{
    border:none !important;
    background: #E4F5FA !important;
  }

  .g6-tooltip{
    z-index: 7 !important;
    position: absolute;
    white-space: nowrap;
    border: none;
    border-radius: 4px;
    background: rgba(33, 33, 33, 0.7);
    color: white;
    font-size: 14px;
    margin: 0px;
    padding: 8px 16px;
    visibility: hidden;
    top: 0;
    left: 0;
  }

  .context-menu-list{
    top: 0;
    left: 0;
    visibility: hidden;
  }

  .g6-category-list{
    margin: 0;
    padding: 0;
    position: absolute;
    z-index: 18;
    border-radius: 4px 4px 0 0;
    box-shadow: 0px 2px 2px #ddd;
    background-color: #fff;
    li{
      list-style: none;
      line-height: 2;
      padding: 3px 10px;
      cursor: pointer;
      font-family: '微软雅黑';
      color: #000;
      font-size: 14px;
      &:hover{
        background: rgba(81,166,255,0.10);
      }
    }
  }

  .relation{
    .arrow{
      margin-left: 5px;
      width: 8px;
      height: 10px;
      background-size: cover;
    }

    .node-container, .node-container-double, .node-container-single{
      width: 220px;
      height: 80px;
      overflow: hidden;
      .g6-category-list {
        right: -95px;
        bottom:-95px;
      }
      .hide{
        display: none;
      }
    }

    // .node-container-shape{
    //   height: 90px !important;
    // }

    .node-container-double{
      width: 110px;
      height: 180px;
      .content {
        height: 60px;
        line-height: 1;
      }
      h3{
        font-size: 16px !important;
      }
    }

    .node-container-content.active{
      border: 1px solid #51A6FF ;
      box-shadow: 0px 1px 4px #51A6FF;
    }

    .node-container .node-container-title, .node-container-double .node-container-title, .node-container-single .node-container-title{
      color: white;
      text-align: center;
      padding: 5px 0;
      .content{
        position: relative;
        font-size: 12px;
        h3 {
          font-size: 18px;
        }
        .node-no{
          background: rgba(0,0,0,0.15);
          color: #fff;
          position: absolute;
          line-height: 1.5;
          left: 6px;
          top: -10px;
          border-radius: 50%;
          padding: 2px;
        }
      }

      h3{
        color: #30B7EA;
        line-height: 1.8;
      }
      .node-title{
        color:#333333;
        height: 18px;
        padding: 0 22px;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .tip{
        display: flex;
        justify-content: center;
        color: #333333;
        .node-status-up{
          background-image: url('/static/design/up.svg');
          .arrow
        }
        .node-status-down{
          background-image: url('/static/design/down.svg');
          .arrow
        }
      }
    }

    .node-container-double .node-container-title, .node-container-single .node-container-title{
      line-height: 1.2;
      .arrow-up{
        position: absolute;
        top: -35px;
        left: 40px;
        background-image: url('/static/design/relation.svg');
        background-size: cover;
        width: 20px;
        height: 22px;
      }
      .content{
        margin: 12px 0 8px 0;
        line-height: 1.5;
      }
      .line{
        border-top: 1px solid #999;
        width: 80%;
        margin: 0 auto;
      }
    }

    .node-container-single .node-container-title{
      .content{
        margin: 0;
        .node-no{
          top: 0px;
          width: 20px;
          height: 20px;
          left: 6px;
        }
      }
      .arrow-up{
        left: 50%;
        top: -40%;
      }
    }

    .node-container-double.node-container-shape .node-container-title{
      .content{
        .node-no{
          top: -12px;
          width: 20px;
          height: 20px;
        }
      }
    }

    .node-container .node-container-list, .node-container-double .node-container-list{
      background: white;
      padding-left: 10px;
      height: 40px;
      line-height: 40px;
    }
    .btn{
      position: absolute;
      right: 4px;
      width: 20px;
      font-size: 14px;
      cursor: pointer;
      outline: none;
      z-index: 10; /* 使得该元素z层级大于最上层canvas */

    }
    .node-container .node-delete, .node-container-double .node-delete, .node-container-single .node-delete{
      top: -5px;
      background:none;
      border:none;
      color: #999;
      &:hover{
        color:#4FA3FA;
      }
      .btn;
      font-size: 20px;
      width: 15px;
    }
    .node-container .node-add, .node-container-double .node-add, .node-container-single .node-add{
      font-weight: bold;
      bottom: 4px;
      height: 20px;
      font-size: 17px;
      background: rgba(30,30,30,0.40);
      color: #fff;
      border-radius: 50%;
      padding-bottom: 2px;
      padding-left: 1px;
      line-height: 0;
      border: none;
      &:hover{
        background:#4FA3FA;
      }
      .btn
    }
  }


</style>
