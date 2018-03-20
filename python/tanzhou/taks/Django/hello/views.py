# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.views import View
from django.http import HttpResponse

# Create your views here.

class Hello(View):
    def get(self, request):
        massage = "hello python"
        return HttpResponse(massage)