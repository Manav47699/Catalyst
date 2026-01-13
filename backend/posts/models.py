from django.db import models
from django.contrib.auth.models import User
from groups.models import Group

# Choices for the tag field
TAG_CHOICES = [
    ('idea_presentation', 'Idea Presentation'),
    ('accomplishment', 'Accomplishment'),
    ('announcement', 'Announcement'),
]

class Post_model(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='post_photos/')
    description = models.CharField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    tag = models.CharField(
        max_length=20,
        choices=TAG_CHOICES,
        default='idea_presentation'  # default tag
    )
    group = models.ForeignKey(Group, on_delete=models.CASCADE, blank=True, null=True, related_name='posts')

    def __str__(self):
        return f"{self.user.username} - {self.created_at} - {self.tag}"


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post_model, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} -> {self.post.id}"


class Upvote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post_model, on_delete=models.CASCADE, related_name='upvotes')

    class Meta:
        unique_together = ('user', 'post')

    def __str__(self):
        return f"{self.user.username} upvoted {self.post.id}"
