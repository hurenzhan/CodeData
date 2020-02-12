function Vue (options) {
  this._init(options)
}

// 公共方法
function initState (vm) {
  let opts = vm.$options
  if (opts.data) {
    initDate()
  }
  if (opts.computed) {
    computed()
  }
  if (opts.watch) {
    watch()
  }
}

// 公共方法
function observe (data) {
  if (typeof data !== 'object' || data == null) {
    return
  }
  return new Observer(data)
}

function defineReactive (data, key, value) {  // 定义响应式的数据变化
  // 如果value是一个对象的话，再深度观察
  observe(value) //递归观察
  Object.defineProperty(data, key, {
    get () {
      return value
    },
    set (newValue) {
      if (newValue === value) return
      observe(newValue) // 如果值是一个对象，应该监控新增对象
      value = newValue
    }
  })
}

class Observer {
  constructor (data) {  // data就是用户定义的vm._data
    // 通过object.defineproperty重新定义
    if (Array.isArray(data)) {  // 如果是数组，重写
      data.__proto__ = arrayMethods // 新建数组方法，监听数组操作
    } else {
      this.walk(data)
    }
  }
  walk (data) {
    let keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let value = data[keys[i]]
      defineReactive(data, key, value)
    }
  }
}

function proxy(vm, source, key) {  // 代理数据 vm.msg = vm._data.msg
  Object.defineProperty(vm, key, {
    get () {
      return vm[source][key]
    },
    set (newValue) {
      vm[source][key] = newValue
    }
  })
}

function initDate () {  // 将用户插入的数据，通过object。defineproperty重新定义
  let data = vm.$options.data // 用户传入的data
  data = vm._data === typeof data === 'function' ? data.call(vm) : data || {}

  for (let key in data) {
    proxy(vm, '_data', key)
  }

  observe(vm._data)
}
function computed () {
  
}
function watch () {
  
}

Vue.prototype._init = function (options) {
  let vm = this
  vm.$options = options
  // MVVM原理
  initState(vm)
  Object.defineProperty
}