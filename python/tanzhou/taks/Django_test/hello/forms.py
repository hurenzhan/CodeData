# -*- coding: utf-8 -*-
from .models import User_01
from .models import User
from django import forms

class RegisterForm(forms.Form):
    # headshot = forms.ImageField(label=u"头像", required=False)
    username = forms.CharField(label=u"用户名", required=True, max_length=50, min_length=8, error_messages={"required": u"用户名必须填写", "min_length": u"用户名最少8个字符"})
    password = forms.CharField(label=u"密码", required=True, max_length=50, min_length=8)
    # password1 = forms.CharField(label=u"重复密码", required=True, max_length=50, min_length=8)
    # gender = forms.CharField(label=u"性别", required=True)
    # age = forms.CharField(label=u"生日", required=False)

    # def clean_username(self):
    #     username = self.cleaned_data["username"]
    #     users = User_01.objects.filter(username=username)
    #     if users:
    #         # 如果只是单个错误，使用raise ValidationError
    #         raise forms.ValidationError(u"用户名已经存在")
    #     return username
    #
    # def clean(self):
    #     password = self.cleaned_data["password"]
    #     password1 = self.cleaned_data["password1"]
    #     if password != password1:
    #         # 如果这里判断有多个错误存在，则使用add_error方法
    #         self.add_error("password", u"密码不一致")
    #     if password.find(u"mmpmmpmmp") >=0 :
    #         self.add_error("password", u"密码存在敏感字符")
    #     return password
