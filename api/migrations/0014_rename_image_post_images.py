# Generated by Django 3.2.8 on 2022-06-15 16:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_alter_post_image'),
    ]

    operations = [
        migrations.RenameField(
            model_name='post',
            old_name='image',
            new_name='images',
        ),
    ]
