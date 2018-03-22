# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse
from django.views import View

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