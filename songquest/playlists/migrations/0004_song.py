# Generated by Django 4.2.2 on 2024-02-05 19:43

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("playlists", "0003_alter_playlist_name_alter_playlist_spotify_id"),
    ]

    operations = [
        migrations.CreateModel(
            name="Song",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField()),
                ("spotify_id", models.CharField()),
                ("isrc", models.CharField()),
            ],
        ),
    ]
