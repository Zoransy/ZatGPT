# Generated by Django 4.2 on 2024-10-13 07:23

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("ZatGPT", "0002_user_is_superuser"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="account",
        ),
    ]