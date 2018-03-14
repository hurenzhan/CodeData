import re

class regex:
    def __init__(self):
        self.str = input('请输入电话或者邮箱：')
        self.res()
    def res(self):
        if self.str.isdigit():
            self.phone()
        else:
            self.Email()
    def phone(self):
        res = re.findall(r'^1[3|4|5|7|8]\d{9}$',self.str)
        if len(res)>0:
            print('输入手机号码正确')
        else:
            self.str = input('输入有误，请重新输入电话或者邮箱：')
            self.res()
    def Email(self):
        res = re.findall(r'^([a-zA-Z][\w|_]{4,15}@\w+\.(com|cn))$',self.str)
        if len(res)>0:
            print('输入邮箱正确')
        else:
            self.str = input('输入有误，请重新输入电话或者邮箱：')
            self.res()
regex()