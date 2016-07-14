from __future__ import unicode_literals

from django.db import models


class Subreddit(models.Model):

    class Meta:
        #ordering = ('title', )
        ordering = ('-popularity',)
    created = models.DateTimeField(auto_now_add=True)
    title = models.TextField(blank=False)
    description = models.TextField(blank=False)
    popularity = models.IntegerField(blank=False)
    

    def __unicode__(self):
        return '{}'.format(self.title)
