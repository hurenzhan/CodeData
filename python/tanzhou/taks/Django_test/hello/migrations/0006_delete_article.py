# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-03-28 06:58
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hello', '0005_article'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Article',
        ),
    ]
