# Generated by Django 3.2.8 on 2022-06-15 14:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_post_saving_user_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='image',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
    ]