# TablePaging

> 基于 iview  表格和分页
> 支持 3 种 类型分页 ，1 本地数据分页， 2 远程分页，3 远程数据本地分页


## Table props

属性 | 默认值 | 说明
--- | --- | ---
type | 1 (数字) |  表格类型， 1 data 本地模拟数据分页  2 ajax 远程分页 3 ajax 获取数据，本地分页
radio | { use: false, key: 'id' } | 是否启用单选,唯一键是什么
data | [] | 模拟数据
ajax | {} | axios 请求配置（注意 limit 和 offset 内置在 get params 中，无需自己处理）
columns | [] | 表单列表配置
paging | { show: true, opts: [10, 20] // 条数切换 } | 是否分页，切换条数配置

## Table event

事件名 | 返回值 | 说明
--- | --- | ---
@limit | (limit 条数) | 每页条数切换时触发
@page| (page  页码) | 页码切换时候返回当前页码
@on-select-change | (selection  选中值 Array) | 多选结果（配置了多选时候，不可与radio共用）
@on-radio | (id 选中的结果) | 返回单选选中的结果，支持自己配置的唯一键名
@dataLoaded | true | 数据加载完成

## ref

- 再次请求表格数据

1. 定义 table-paging 组件的 ref="tablePaging"
2. 调用内置的数据请求方法 ： this.$refs.tablePaging.judgeType()

## 样式

![](https://images-cdn.shimo.im/YciskMvPSPUg0rOb/72F50A90-4F71-4E74-B640-C90BDD89AA26.png!thumbnail)
![](https://images-cdn.shimo.im/DST5jEIYH6g3spNZ/image.png!thumbnail)
