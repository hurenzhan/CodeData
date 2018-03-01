#!/usr/bin/env python
# coding=UTF-8
class help:
    dict = {
        '__init__()': '会在类实例化后自动被被调用',
        '__del__()': '当对象被销毁时调用',
        '__str__()': '对象执行后会被调用',
        '__repr__()': 'shell模式下对象执行后会被调用',
        'getattr()': '获取对象属性值，如过不存在可以设置默认加上',
        'hasattr()': '检查是否含有改属性，返回布尔值',
        'setattr()': '设置属性值，如过不存在自动加上',
        'delattr()': '删除属性值',
        '__name__': '类 函数 方法或生成器的名字',
        '__class__': '一个实例所属的类对象',
        '__doc__': '文档字符串',
        '__dict__': '储存了对象属性的字典'
    };
    def __str__(self):
        print(self.dict)
        str = ''
        for key in self.dict:
            str += '{key}:{val}\n'.format(key=key,val=self.dict[key]);
        else:
            return str
    def __repr__(self):
        return  '123';

print(help())
