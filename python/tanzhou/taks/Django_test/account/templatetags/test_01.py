# -*- coding: utf-8 -*-

from django import template
import datetime
register = template.Library()

@register.filter
def mycut(value, args):
    return value.replace(args, "").lower()

@register.simple_tag
def curr_date():
    return datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

@register.inclusion_tag('import_static.html')
def show_results():
    fruits = ['游侠', '猎人', '佣兵', '骑士', '法师']
    return {'fruits': fruits}