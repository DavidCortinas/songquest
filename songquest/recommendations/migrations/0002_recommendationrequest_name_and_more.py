# Generated by Django 4.2.2 on 2024-02-16 19:31

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("recommendations", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="recommendationrequest",
            name="name",
            field=models.CharField(default="New Request", max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="recommendationrequest",
            name="id",
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]