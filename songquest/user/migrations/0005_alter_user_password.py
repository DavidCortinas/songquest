# Generated by Django 4.2.2 on 2023-10-12 21:50

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("user", "0004_alter_user_spotify_email"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="password",
            field=models.CharField(blank=True, max_length=128, null=True),
        ),
    ]