from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Startups, StartupRequest


# ------------------------------------
# STARTUP ADMIN
# ------------------------------------
@admin.register(Startups)
class StartupsAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'gmail',
        'about_us',
        'minimum_donation',
        'created_at',
    )

    search_fields = (
        'name',
        'gmail',
        'about_us',
        'benefits',
    )

    list_filter = (
        'created_at',
    )

    fieldsets = (
        ('Basic Information', {
            'fields': (
                'profilepic',
                'name',
                'gmail',
            )
        }),
        ('Startup Details', {
            'fields': (
                'about_us',
                'benefits',
                'minimum_donation',
            )
        }),
    )


# ------------------------------------
# STARTUP REQUEST ADMIN
# ------------------------------------
@admin.register(StartupRequest)
class StartupRequestAdmin(admin.ModelAdmin):
    list_display = (
        'address',
        'startups',   # ✅ match the field name exactly
        'gmail',
        'status',
        'created_at',
    )

    search_fields = (
        'address',
        'startups__name',  # use double underscore to search the related model
        'user__email',
        'website',
        'linkedin',
    )

    list_filter = (
        'status',
        'created_at',
    )
