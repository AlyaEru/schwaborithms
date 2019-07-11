from django.contrib import admin
from spew.models import Word, NameGroup, LastSentence

class WordAdmin(admin.ModelAdmin):
    list_display = ['word','partOfSpeech','group']
    ordering = ['group','partOfSpeech']

admin.site.register(Word, WordAdmin)
admin.site.register(NameGroup)
admin.site.register(LastSentence)
