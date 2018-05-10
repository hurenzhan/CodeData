# -*- coding: utf-8 -*-

"""Django_test URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from hello import views

urlpatterns = [
    url(r'^1[3|4|5|7|8]\d{9}/$', views.Phone.as_view()),    #正则
    url(r'^([0-9]{1})/$', views.Oddoff.as_view()),      #单个非命名
    url(r'^([0-9]{1})([0-9]{1})/([0-9]{1})$', views.Alloff.as_view(), name='dg'),      #多个非命名
    url(r'^(?P<num>[a-z]{1})$', views.Oddon.as_view()),      #单个命名
    url(r'^(?P<three>[a-z]{1})(?P<tow>[a-z]{1})/(?P<one>[a-z]{1})$', views.Allon.as_view(), name='mm'),      #多个命名
    url(r'^(?P<k>)$', views.RedicectPage.as_view()),      #重定向
    url(r'^render/test_01$', views.render_test_01.as_view()),      #render跳转01
    url(r'^render/test_02$', views.render_test_02.as_view()),      #render跳转02
    url(r'^render/filter_test01$', views.filter_test_01.as_view()),      #render跳转filter_01
    url(r'^render/filter_test02$', views.filter_test_02.as_view()),      #render跳转filter_02
    url(r'^render/models_test_01$', views.ModelOper.as_view()),      #render跳转models_test_02
    url(r'^render/models_test_02$', views.School.as_view()),      #render跳转models_test_02
    url(r'^render/register$', views.Register.as_view(), name="register"),      #注册页
    url(r'^render/login$', views.Login.as_view(), name="login"),      #登录页
    url(r"^render/index/$", views.Index.as_view(), name="index"),   #主页
    url(r"^render/register_tkad_01/$", views.Register.as_view()),   #注册页视图
    url(r"^render/home/$", views.Home.as_view()),   #权限
]
