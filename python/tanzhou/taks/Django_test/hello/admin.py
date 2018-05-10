# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import Article

# Register your models here.

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    pass
    list_display = ["title", "content"]
    search_fields = ["title", "content"]
    list_filter = ["content"]