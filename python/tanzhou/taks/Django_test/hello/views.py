# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse
from django.views import View
from .models import Article, ClassNum, Class, Teacher, Student
import datetime
from django.db.models import Avg, Max, Min, Count, Sum

from django.shortcuts import render, redirect, reverse

# Create your views here.

class Hello(View):
    def get(self, request):
        message = 'hello Django'
        return HttpResponse(message)

class Phone(View):
    def get(self, request):
        message = '我是手机号url'
        return HttpResponse(message)

class Oddoff(View):  #单个非命名
    def get(self, request, num):
        message = '单个非命名'
        return HttpResponse(message)

class Alloff(View):  #多个非命名
    def get(self, request, one, tow, three):
        message = '多个非命名'
        return HttpResponse(message)

class Oddon(View):  #单个命名
    def get(self, request, num='zeor'):
        message = '单个命名'
        return HttpResponse(message)

class Allon(View):  #多个命名
    def get(self, request, one=1, tow=2, three=3):
        message = '多个命名'
        return HttpResponse(message)

class RedicectPage(View):  #重定向
    def get(self, request, k):
        # return redirect(reverse('dg', args=('1', '2', '3'))) #非命名参数
        return redirect(reverse('hello:mm', kwargs={'one':'q', 'tow':'w', 'three':'e'})) #命名参数跳转

class render_test_01(View):  #render跳转01
    def get(self, request):
        data_01 = {
            'name': 'huren',
            'age': 18,
            'skill': 'python'
        }
        now = datetime.datetime.now()
        data_02 = {
            'val_01': 'javascript',
            'val_02': 'JAVASCRIPT',
            'val_03': now,
            'val_04': 'Python WEB'
        }
        return render(request, 'render/test_01.html', locals())

class render_test_02(View):  #render跳转01
    def get(self, request):
        return render(request, 'render/test_02.html')

class filter_test_01(View):  #render跳转filter_01
    def get(self, request):
        name = 'HTML 5'
        return render(request, 'render/filter_test01.html', locals())

class filter_test_02(View):  #render跳转filter_02
    def get(self, request):
        return render(request, 'render/filter_test02.html')

class ModelOper(View):  #render跳转models_test01
    def get(self, request):
        articles = Article.objects.all()
        num = len(articles)
        article = Article()
        article.title = "标题{}".format(num)
        article.content = "我们的第{}个".format(num)
        article.save()
        # Article.objects.filter(id=10).delete()
        Article.objects.extra(where=["id %% 2 = 0"]).delete()
        # Article.objects.filter(id=15).update(title="我是id15")
        return render(request, 'render/models_test01.html', locals())

class School(View):  #render跳转models_test01
    def get(self, request):
        # classNum = ClassNum()
        # classNum.num = 03
        # classNum.save()
        classNums = ClassNum.objects.all()

        # cls = Class()
        # cls.name = "django框架班03"
        # cls.num_id = 3
        # cls.save()
        clss = Class.objects.all()

        # teacher = Teacher()
        # cls = Class.objects.get(pk=3)
        # teacher.name = '阿仁老师'
        # teacher.age = 26
        # teacher.gender = 1
        # teacher.cls_id = 14
        # teacher.save()
        teachers = Teacher.objects.all()

        # student = Student()
        # student.name = '公孙鞅'
        # student.age = '33'
        # student.cls_id = '14'
        # student.gender = '1'
        # student.save()
        student = Student.objects.get(pk=3)
        # teacher_ar = Teacher.objects.get(pk=9)
        # teacher_bd = Teacher.objects.get(pk=5)
        # student.teacher.add(teacher_ar, teacher_bd)
        # student.save()
        students = Student.objects.all()

        gender_m = Student.objects.filter(gender=1)    # 查询性别为男的学生
        age_20up = Student.objects.extra(where=["age>20"])    # 查询性别为男的学生
        age_order = Student.objects.order_by('age')     #年龄排序
        wm_except = Student.objects.extra(where=["gender!=0"])     #除了女同学
        std_all = Student.objects.count()  #学生总数
        cls_last = Class.objects.last()  #最后创建的班级
        st_age_max = Student.objects.aggregate(age=Max('age'))  #年龄最大的学生
        st_age_min = Student.objects.aggregate(age=Min('age'))  #年龄最小的学生
        st_age_avg = Student.objects.aggregate(avg=Avg('age'))  #学生平均年龄
        st_age_count = Student.objects.values('age').annotate(num=Count('id'))  #每个年龄的学生数量
        return render(request, 'render/models_test02.html', locals())