# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-03-29 03:19
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hello', '0011_auto_20180329_0316'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='class',
            table='Class',
        ),
        migrations.AlterModelTable(
            name='classnum',
            table='ClassNum',
        ),
        migrations.AlterModelTable(
            name='student',
            table='Student',
        ),
        migrations.AlterModelTable(
            name='teacher',
            table='Teacher',
        ),
    ]
