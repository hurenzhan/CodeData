#!/usr/bin/env python
# coding=UTF-8
class Init:
    def __init__(self,name,age,sex):
        self.name = name
        self.age = age
        self.sex = sex
    def __repr__(self):
        return '{cls}({name},{age},{sex},{skill})'.format(cls=__class__.__name__,
                                                  name=self.name,
                                                  age=self.age,
                                                  sex=self.sex,
                                                  skill=self.skill)
    def fight(self):
        raise NotImplementedError('目前无行为')

class C(Init):
    def __init__(self,name,age,sex,skill):
        Init.__init__(self,name,age,sex)
        self.skill = skill
    def fight(self):
        print('我会'+self.skill+'做底层开发')

class JAVA(Init):
    def __init__(self,name,age,sex,skill):
        Init.__init__(self,name,age,sex)
        self.skill = skill
    def fight(self):
        print('我会'+self.skill+'做大数据')

class PYTHON(Init):
    def __init__(self,name,age,sex,skill):
        Init.__init__(self,name,age,sex)
        self.skill = skill
    def fight(self):
        print('我会'+self.skill+'做云计算')

class all(PYTHON):
    def __init__(self,name,age,sex,skill):
        PYTHON.__init__(self,name,age,sex,skill)
    def fight(self,*all):
        print('我是'+self.skill)

def draw_fight(role,*arg):
    print(role,end='')
    role.fight(*arg)

c = C('小明','18','男','C')
java = JAVA('小红', '16', '女', 'java')
python = PYTHON('小发', '11', '男', 'python')
a = all('大牛','25','男','全栈')
draw_fight(c)
draw_fight(java)
draw_fight(python)
draw_fight(a,c.fight(),java.fight(),python.fight())



