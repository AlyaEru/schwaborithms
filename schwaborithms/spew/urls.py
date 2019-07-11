from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('groups', views.groupselect, name='groupselect'),
    path('generate', views.get_sentence, name='generate'),
    path('newword', views.new_word, name='newword'),
    path('deleteword', views.delete_word, name='deleteword'),
    path('joingroup', views.join_group, name='joingroup'),
    path('creategroupsetup', views.create_group_setup, name='creategroupsetup'),
    path('creategroup', views.create_group, name='creategroup'),
    path('getjoinedgroupdata', views.get_joined_group_data, name='getjoinedgroupdata'),
]
