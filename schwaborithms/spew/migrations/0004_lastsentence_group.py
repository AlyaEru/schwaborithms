# Generated by Django 2.2.1 on 2019-05-29 03:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('spew', '0003_lastsentence'),
    ]

    operations = [
        migrations.AddField(
            model_name='lastsentence',
            name='group',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='spew.NameGroup'),
        ),
    ]
