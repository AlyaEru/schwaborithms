from django.db import models

class Word(models.Model):
    word = models.CharField(max_length=200)
    group = models.ForeignKey('NameGroup', on_delete=models.CASCADE, null=True)
    PART_OF_SPEECH = (
        ('no','Noun'),
        ('ad','Adjective'),
        ('na','Name'),
        ('se','Sentence'),
        ('av','Adverb'),
        ('s?','Interrogative'),
        ('pn','Plural Noun'),
        ('su','Suggestion'),
    )
    partOfSpeech = models.CharField(
        max_length=2,
        choices=PART_OF_SPEECH
    )

    def __str__(self):
        return self.word

class NameGroup(models.Model):
    name = models.CharField(max_length=200)
    password = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class LastSentence(models.Model):
    sentence = models.TextField()
    time = models.DateTimeField(auto_now=True)
    group = models.ForeignKey('NameGroup', on_delete=models.CASCADE, null=True)
    
    def __str__(self):
        return self.sentence

