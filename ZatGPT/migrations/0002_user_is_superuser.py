# Generated by Django 5.1.2 on 2024-10-12 10:01

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("ZatGPT", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="is_superuser",
            field=models.BooleanField(default=False),
        ),
    ]
