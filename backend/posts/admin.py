from django.contrib import admin
from .models import Post_model, Comment, Upvote

# ---------------- Post Admin ----------------
@admin.register(Post_model)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'group', 'tag', 'created_at')
    list_filter = ('tag', 'group', 'created_at')
    search_fields = ('user__username', 'description')

# ---------------- Comment Admin ----------------
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'post', 'text', 'created_at')
    search_fields = ('user__username', 'text')

# ---------------- Upvote Admin ----------------
@admin.register(Upvote)
class UpvoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'post')
    search_fields = ('user__username',)
