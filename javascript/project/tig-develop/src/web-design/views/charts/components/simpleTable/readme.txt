1.此表格用的hansontable插件
2.tableData中如果还有&dilldata 就是下钻的数据 分页根据这个逻辑来 下钻的数据不参与分页 &last 没有下钻箭头
3.tableData中如果还有*dillUp 就应该是收缩图标
4.$dill符 针对指标列 根据标识渲染td颜色
5.注意计算合计时 指标列可能含有$dill符 合计不包括下钻数据值
6.下钻有缩进 放在&dilldata值的最后
7.#compare用来做趋势标记 注意$dill后面也有可能跟趋势标记(下钻的数据)
8.下钻的padding值放在'&dilldata'后面 &dilldata加当前路径加下钻层级数
addbarcolumn 新增条形图
clearSetting 清除配置
hansonmerage 处理拆分后的表格的合并单元格配置
hover 悬浮表格
method 右击菜单的一些方法
mixin 整个表格数据组织方法
renderColumn 渲染表格的主方法
search 表格调用接口的封装
splitDim 表格拆分
tableStyle 右侧面板样式栏
