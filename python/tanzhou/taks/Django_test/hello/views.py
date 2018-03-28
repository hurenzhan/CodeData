# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse
from django.views import View
from .models import Article
import datetime

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

class ModelOper(View):  #render跳转filter_02
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