# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-03-29 03:16
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('hello', '0010_auto_20180329_0121'),
    ]

    operations = [
        migrations.CreateModel(
            name='Class',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='\u540d\u79f0')),
                ('crt_time', models.DateField(auto_now_add=True)),
                ('up_time', models.DateField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='ClassNum',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('num', models.CharField(max_length=200, verbose_name='\u73ed\u53f7')),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='\u540d\u79f0')),
                ('gender', models.CharField(max_length=200, verbose_name='\u6027\u522b')),
                ('cls', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hello.Class')),
            ],
        ),
        migrations.CreateModel(
            name='Teacher',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='\u540d\u79f0')),
                ('age', models.CharField(max_length=200, verbose_name='\u5e74\u9f84')),
                ('gender', models.CharField(max_length=200, verbose_name='\u6027\u522b')),
                ('cls', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hello.Class')),
            ],
        ),
        migrations.AddField(
            model_name='student',
            name='teacher',
            field=models.ManyToManyField(to='hello.Teacher'),
        ),
        migrations.AddField(
            model_name='class',
            name='num',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='hello.ClassNum'),
        ),
    ]
