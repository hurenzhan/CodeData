import redis

# 如果没有设置密码 password 不需要写
conn = redis.Redis(host="127.0.0.1", port="6379")

# conn.set('key', 'value')  set key value
conn.set('name', '中文')
# conn.get('key')  get key  虚拟环境
# print(conn.get('name')) # bytes
# print(conn.get('name').decode('utf8'))

# 原生设置多个字符串  mset k1 v1 k2 v2
conn.mset(name='which', p2='pp2') # 区别 同时设置多个
# conn.mset('p1', 'pp1', 'p2', 'pp2') #### 错误
# print(conn.get('read_count'))
# conn.decr('read_count', amount=10) # 区别
# conn.incr('read_count', amount=10) # 区别
# print(conn.get('read_count'))
# conn.expire('p2', 10)
# print(conn.ttl('p2'))
# print(conn.mget('name', 'marry'))

"""
add ==> 针对 集合  sadd zadd 
get ==> 获取
mxxx ==> 设置多个
"""
# hset key xx  xxx
# website = {"google":"www.google.com"}
# conn.hset('website', 'google', 'www.google.com')
### 不同 设置多个hash
# conn.hset('p_hash', 'google', 'www.google.com')
# print(conn.hgetall('p_hash'))

###  hset key xx xx
# conn.hmset('website', {"baidu":"www.baidu.com", "taobao":"www.taobao.com"})
# print(conn.hgetall('website'))
print(conn.type('website'))

"""
not only sql

key => value  'xx'
 

name = "which"
get name

mset name which age 10
mget key1 key2 key3...
del key

user = {
	"name" : "which",
	age : 10
}


hget user name
hmset user name which age 10
hmget user name age a
hdel user  name
hgelall 获取全部value
hkeys user# 全部的field
hvals user # 全部的值


有序集合 有顺序的集合

1 a 				1 a  2 b 3 d 4 c
2 b 
1000 c
3 d



user = {
	"name":"which",
	"age":18
} 
 
设置过期时间  获取key 的过期时间 是针对key
 和 value 无关 

 1 2 3 4 5

小泼老师

web 19号直接上web课程    
 	web已经会了  ==> 框架  

忘仙老师

爬虫 16号开班 不讲知识点  并发   


redis 五种数据类型  一定要记住
"""