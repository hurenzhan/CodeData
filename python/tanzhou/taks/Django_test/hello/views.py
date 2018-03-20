# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse
from django.views import View

from django.shortcuts import render

# Create your views here.

class hello(View):
    def get(self, request):
        message = 'hello Django'
        return HttpResponse(message)
