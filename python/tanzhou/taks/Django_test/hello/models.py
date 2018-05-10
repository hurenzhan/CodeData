# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Article(models.Model):
    title = models.CharField(u"标题", max_length=50, null=False)                  # 定义一个标题
    content = models.TextField(u"内容", null=False)
    class Meta:
        db_table = "Article"
        managed = True
        ordering = ['-id']
        verbose_name = u"主题"
        verbose_name_plural = u"主题列表"

        permissions = (
            ("view_Article", u"查看书籍"),
            ("update_Article", u"修改书籍"),
            ("del_Article", u"删除书籍")
        )

class ClassNum(models.Model):  #班号
    num = models.CharField(u'班号', max_length=200)

class Class(models.Model):  #班级
    name = models.CharField(u'名称', max_length=200)
    num = models.OneToOneField(ClassNum)   #班号一对一
    crt_time = models.DateField(auto_now_add=True)
    up_time = models.DateField(auto_now=True)

class Teacher(models.Model):  #老师
    name = models.CharField(u'名称', max_length=200)
    age = models.CharField(u'年龄', max_length=200)
    gender = models.SmallIntegerField(u'性别')
    cls = models.ForeignKey(Class)  # 班级多对一

class Student(models.Model):  #学生
    name = models.CharField(u'名称', max_length=255)
    age = models.CharField(u'年龄', max_length=200)
    cls = models.ForeignKey(Class)  #班级多对一
    teacher = models.ManyToManyField(Teacher)   #老师多对多
    gender = models.SmallIntegerField(u'性别')

class User(models.Model):   #账号密码
    username = models.CharField(u"用户名", max_length=25)
    password = models.CharField(u"密码", max_length=50)

class User_01(models.Model):   #表单用户
    headshot = models.ImageField(u"头像", upload_to="upload/%Y/%m/%d", null=True)
    username = models.CharField(u"用户名", max_length=25)
    password = models.CharField(u"密码", max_length=50)
    password1 = models.CharField(u"重复密码", max_length=50)
    gender = models.CharField(u'性别', max_length=25)
    age = models.CharField(u'出生年月', max_length=25)
