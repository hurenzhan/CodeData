# `Redis`

## 什么是`Redis`

`redis`是一种`nosql`数据库,他的数据是保存在内存中，同时`redis`可以定时把内存数据同步到磁盘，即可以将数据持久化，还提供了多个语言的`API`，操作比较方便

## 安装`redis`

```
    sudo apt-get update
    sudo apt-get install redis-server

```

### 关系型数据库和非关系数据库的区别

**关系型数据库**
表和表之间存在的关系
**非关系型数据库**
不存在表的这种概念,`redis`是键值对数据库，通过`key`查找`value` 所以`key`是唯一的

## 操作`Redis`

对于操作`redis`有两种，一种是直接`redis-cli` ，还有一种就是使用编程语言 例`python`、`java`等等

### `redis-cli`原生操作`redis`

- 启动

  ```
  redis-cli 

  ```

#### `Redis`的基本数据类型

- `string` 字符串
- `list` 列表
- `hash` 哈希
- `set` 集合
- `sorted sets` 有序集合

#### 操作`String`

- 设置

  ```
  set key value
  例
  set name  which 

  ```

  不能用同一个

  ```
  key
  ```

   

  不然就会覆盖 默认设置的过期时间是永久

- 获取

  ```
  get key
  例
  get name

  ```

- 设置过期时间

  - ```
    key
    ```

     

    已经存在

    ```
    expire key seconds
    例
    expire name 20

    ```

  - ```
    key
    ```

     

    不存在

    ```
    set key value ex seconds
    或
    setex key seconds value

    ```

- 查看过期时间

  ```
  ttl key
  例：
  ttl name

  ```

- 追加

  ```
  append key value
  例
  append name  love

  ```

- 设置多个

  ```
  mset key value  key value..
  例子
  mset username which password 123

  ```

- 获取多个

  ```
  mget key key key ...
  例
  mget username password name 

  ```

##### `key`

- 删除

  ```
  del key
  例
  del name

  ```

- 查看所有的

  ```
  key
  ```

  ```
  keys *

  ```

- 查看

  ```
  key
  ```

  是否存在

  ```
  exists key 

  ```

- 查看

  ```
  key
  ```

  类型

  ```
  type key

  ```

##### 运算

- ```
  +
  ```

  1

  ```
  incr key

  ```

- ```
  -
  ```

  1

  ```
  decr key

  ```

- ```
  +
  ```

  整数

  ```
  incrby key increment

  ```

- ```
  -
  ```

  整数

  ```
  decrby key increment

  ```

#### 操作`list`

- 设置

  - ```
    lpush
    ```

     

    左添加

    ```
    lpush key value

    ```

  - ```
    rpush
    ```

     

    右添加

    ```
    rpush key value

    ```

- 查看

  ```
  lrange key start stop
  例 查看所有
  lrange key 0 -1

  ```

- 获得

  ```
  list
  ```

  的元素个数

  ```
  llen key 

  ```

- 查看位于

  ```
  index
  ```

  位置上的元素

  ```
  lindex key  index

  ```

- 删除

  - ```
    lpop
    ```

     

    删除左边第一个

    ```
    lpop key

    ```

  - ```
    rpop
    ```

     

    删除右边第一个

    ```
    rpop key

    ```

  - ```
    lrem
    ```

     

    删除指定

    ```
    lrem key count value

    ```

    - `count > 0` 从左往右 删除数量为`count`的`value`
    - `count = 0` 删除所有的 `value`
    - `count < 0` 从右往左 删除数量为`count`的`value`

#### 操作`hash`

- 设置

  ```
  hset key field value
  例
  hset user username  which

  ```

- 获取

  ```
  hget key field
  例
  hget user username

  ```

- 删除

  ```
  hdel key field
  例
  hdel user username

  ```

- 设置多个

  ```
  hmset key field value [field value]

  ```

- 获取多个

  ```
  hmget key field field

  ```

- 获取全部

  ```
  field value
  ```

  ```
  hgetall key 

  ```

- 获取所有的

  ```
  field
  ```

  ```
  hkeys key

  ```

- 获取所有的

  ```
  value
  ```

  ```
  hvals key 

  ```

- 获取

  ```
  field
  ```

  的个数

  ```
  hlen key

  ```

#### 操作`set`

- 设置

  ```
  sadd key value [value]

  ```

- 获取

  ```
  smembers key

  ```

- 删除

  - ```
    srem
    ```

    指定删除

    ```
    srem key member

    ```

  - ```
    spop
    ```

    随机删除

    ```
    spop  key

    ```

- 移动一个集合的值到另一个集合

  ```
  smove oldkey newkey member

  ```

- 判断集合存在某个值

  ```
  sismember key value

  ```

- 交集

  ```
  sinter key1 key2 ..

  ```

  把 key1 key2的交集合并到

  ```
  newkey
  ```

  ```
  sinterstore newkey key1 key2

  ```

- 并集

  ```
  sunion key1 key2 ...

  ```

  把 key1 key2的并集合并到

  ```
  newkey
  ```

  ```
  sunionstore newkey key1 key2

  ```

- 差集

  ```
  sdiff key1 key2

  ```

  把 key1 key2的差集合并到

  ```
  newkey
  ```

  ```
  sdiffstore newkey key1 key2

  ```

- 获取集合个数

  ```
  scard key

  ```

- 随机返回一个

  ```
  srandmember key

  ```

### 操作`zset`

- 设置

  ```
  zadd key score member

  ```

- 获取

  - ```
    zrange
    ```

     

    正序

    ```
    zrange key start stop

    ```

  - ```
    zrevrange
    ```

     

    倒序

    ```
    zrevrange key start stop

    ```

- 删除

  ```
  zrem key member

  ```

- 索引

  - ```
    zrank
    ```

     

    正序

    ```
    zrank key member

    ```

  - ```
    zrevrank
    ```

     

    反序

    ```
    zrevrank key member

    ```

- 查看有序集合元素数

  ```
  zcard key

  ```

- 返回值在

  ```
  min
  ```

  \-

  ```
  max
  ```

  之间的

  ```
  zcount key min max

  ```

- 查看

  ```
  score
  ```

  值

  ```
  zscore key member

  ```

#### 设置密码

找到配置文件下的`requirepass foobared` 修改之后重启服务

### `Python`操作`Redis`

### 先安装一个第三方库`redis`

```
    pip install redis

```

连接

```
cache = redis.Redis(host='',port='')
```