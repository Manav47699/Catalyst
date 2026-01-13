from django.contrib import admin
from .models import Mentor, MentorCertificate, MentorRequest


# ------------------------------------
# MENTOR ADMIN
# ------------------------------------
@admin.register(Mentor)
class MentorAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'gmail',
        'expertise',
        'available_time',   # ✅ NEW FIELD
        'fees',
        'created_at'
    )

    list_editable = (
        'available_time',   # ✅ edit directly from list view
    )

    search_fields = (
        'name',
        'gmail',
        'expertise',
        'bio',
        'available_time',
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
        ('Professional Details', {
            'fields': (
                'expertise',
                'bio',
                'available_time',
                'fees',
            )
        }),
    )


# ------------------------------------
# MENTOR CERTIFICATE ADMIN
# ------------------------------------
@admin.register(MentorCertificate)
class MentorCertificateAdmin(admin.ModelAdmin):
    list_display = (
        'mentor',
        'certificate',
        'uploaded_at',
    )

    search_fields = (
        'mentor__name',
    )

    list_filter = (
        'uploaded_at',
    )


# ------------------------------------
# MENTOR REQUEST ADMIN
# ------------------------------------
@admin.register(MentorRequest)
class MentorRequestAdmin(admin.ModelAdmin):
    list_display = (
        'company_name',
        'mentor',
        'seeking_for',
        'mentorship_until',
        'status',
        'created_at',
    )

    search_fields = (
        'company_name',
        'mentor__name',
        'user__email',
        'website',
        'linkedin',
    )

    list_filter = (
        'status',
        'mentorship_until',
        'created_at',
    )
