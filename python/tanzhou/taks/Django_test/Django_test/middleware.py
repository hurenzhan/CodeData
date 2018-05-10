# -*- coding: utf-8 -*-
from django.http import HttpResponseForbidden, HttpResponseBadRequest, HttpResponseServerError
from django.utils.deprecation import MiddlewareMixin
import json

class StatMiddleware(MiddlewareMixin):
    def process_view(self, request, view_func, view_args, view_kwargs):
        """
            @request, 当前请求对象
            @view_func, 就是我们需要执行的view_func方法，
            @view_args， 就是我们的view_func所带的位置参数
            @view_kwargs， 就是我们的view_func所带的键值参数
        """
        # process_view 是执行view方法执行所执行的方法
        print u"process_view方法"
        # response = view_func(request, *view_args, **view_kwargs)
        # 这个方法如果返回的是一个response, 它就提前结束请求
        # return HttpResponseServerError()
        # return request

    def process_template_response(self, request, response):
        print u"执行process_template_response"
        return response

    def process_exception(self, request, exception):
        # 这个异常必须是在执行view中出现的异常，它才能进入
        # 这里的异常是指代码出现错误，403，500错误不代表代码出现异常
        print u"---- exception ----"


class StatFlowMiddleware(object):
    """
        流量统计
    """
    def __init__(self, get_response):
        self.get_response = get_response
        self.filename = "count.txt"

    def __call__(self, request):
        # 获取IP
        if request.META.has_key('HTTP_X_FORWARDED_FOR'):
            ip = request.META['HTTP_X_FORWARDED_FOR']
        else:
            ip = request.META['REMOTE_ADDR']

        # 这里为了方便，存储在文件中
        with open(self.filename, "a+") as f:
            content = f.read()

        if content:
            content = json.loads(content)
            count = content.get(ip)
            # 如果请求超过10次，则返回403，拒绝请求
            if count > 20000:
                return HttpResponseForbidden()

        # 执行view函数
        response = self.get_response(request)

        # 只有这个请求返回为200，才代表这个请求需要被统计
        if response.status_code == 200:
            if content:
                content[ip] = content[ip] + 1
            else:
                content = {ip: 1}
            with open(self.filename, "w+") as f:
                f.write(json.dumps(content))
        return response
