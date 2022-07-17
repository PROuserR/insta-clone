# Generated by Django 3.2.8 on 2022-06-15 19:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_alter_profile_bio'),
    ]

    operations = [
        migrations.AlterField(
            model_name='photo',
            name='photo',
            field=models.ImageField(default=1, upload_to=''),
            preserve_default=False,
        ),
        migrations.RemoveField(
            model_name='post',
            name='photos',
        ),
        migrations.AddField(
            model_name='post',
            name='photos',
            field=models.ManyToManyField(blank=True, related_name='photos', to='api.Photo'),
        ),
    ]
