# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse
from django.views import View
from .models import Article, ClassNum, Class, Teacher, Student, User_01
import datetime
from django.db.models import Avg, Max, Min, Count, Sum

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin

# from .models import User
from .forms import RegisterForm
import hashlib
import uuid

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

def md5_password(password):
    return hashlib.md5(password).hexdigest()

class Register(View):  #注册页
    def get(self, request):
        return render(request, "render/register.html", locals())

    def post(self, request):
        username = request.POST.get("username")
        password = request.POST.get("password")
        password = md5_password(password)
        user = User.objects.create(username=username, password=password)
        return HttpResponse(u"用户注册成功 %s" % user.__dict__)

class Login(View):
    # login_url = "/render/register"

    def get(self, request):
        return render(request, "render/login.html")

    def post(self, request):
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(username=username, password=password)
        if user:
            # 这个就是使用auth组件的登录]
            if user.is_active:
                login(request, user)
                # 如果调用login方法以后，
                # request对象就会激活user属性，这个属性不管登录或者未登录都是存在
                print request.user
                return HttpResponse(u"登录成功")
            else:
                message = u"用户未激活"

        else:
            message = u"用户名密码错误"

        return render(request, "render/login.html", locals())




        # password = md5_password(password)
        # users = User.objects.filter(username=username, password=password)
        # if users:
        #     unique_str = str(uuid.uuid4())
        #     resposne = HttpResponse(u"登录成功")
        #     # 首先设置一个cookies，这样，下次请求的时候，我们的cookies中就带有这个唯一值，如果做验证登录的话，如果取到该值，则不需要登录，否则需要登录
        #     resposne.set_cookie('my_session_id1', unique_str)
        #     # request.session[unique_str] = username
        #     return resposne
        # else:
        #     message = u"用户名密码错误"
        #     return render(request, "render/login.html", locals())

class Logout(View):
    def get(self, request):
        # 这个方法就会把我们的session跟cookie清理掉
        logout(request)
        return HttpResponse(u"注销成功")

class Index(LoginRequiredMixin, View):
    def get(self, request):
        my_session_id = request.COOKIES.get("my_session_id1")
        if my_session_id:
            username = request.session.get(my_session_id)
            if username:
                return HttpResponse(u"已经登录, 用户名为：%s" % username)
        # return redirect(reverse("form_study:login"))
        return render(request, "render/login.html", locals())

class Register(View):   #注册视图
    def get(self, request):
        return render(request, "render/register_tkad_01.html")

    def post(self, request, kwargs="param"):
        # 因为我们的文件是通过request.FILES传递的，所以如果需要上传文件，则需要把request.FILES传递进去
        form = RegisterForm(request.POST, request.FILES)
        if form.is_valid():
            user = User.objects.create_user(**form.clean())
            # parms =  form.clean()["password"]
            # password = md5_password(form.cleaned_data["password"])
            # password1 = md5_password(form.cleaned_data["password1"])
            # params = {
            #     "username": form.cleaned_data["username"],
            #     "password": password,
            #     "password1": password1,
            #     "gender": form.cleaned_data["gender"],
            #     "headshot": form.cleaned_data["headshot"],
            #     "age": form.cleaned_data["age"]
            # }
            # # 你上传的文件，如果没有保存数据时，它是不会保存下来的
            # user = User_01(**params)
            # user.save()
            return HttpResponse("注册成功")
        else:
            # print form.errors.headshot
            print form.errors
            return render(request, "render/register_tkad_01.html", locals())
            # return HttpResponse("数据验证失败", )

class Home(PermissionRequiredMixin, View):
    # 只需要单个权限
    permission_required = "hello.view_Article"

    # 多个权限
    # permission_required = ("model_study.view_book", "model_study.view_book")

    def get(self, request):
        print request.user.user_permissions.all()
        if request.user.has_perm("hello.view_Article"):
            articles = Article.objects.all()
        elif request.user.has_perm("hello.update_Article"):
            pass
        else:
            message = "它没访问书籍的权限"
        return render(request, "render/register_tkad_01.html", locals())