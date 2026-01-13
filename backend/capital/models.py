from django.db import models
from django.contrib.auth.models import User


# ------------------------------------
# MENTOR MODEL
# ------------------------------------
class Startups(models.Model):
    profilepic = models.ImageField(upload_to='mentor_photos/', null=True, blank=True)
    name = models.CharField(max_length=50)
    gmail = models.EmailField()
    about_us = models.CharField(max_length=255)
    benefits = models.TextField()
    minimum_donation = models.PositiveIntegerField(default=5000)  # for Stripe payment
    

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# ------------------------------------
# MENTOR CERTIFICATE MODEL
# ------------------------------------
# class MentorCertificate(models.Model):
#     mentor = models.ForeignKey(
#         Mentor,
#         on_delete=models.CASCADE,
#         related_name='certificates'
#     )
#     certificate = models.ImageField(upload_to='certificate_photos/')
#     uploaded_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Certificate for {self.mentor.name}"


# ------------------------------------
# MENTOR REQUEST / APPOINTMENT MODEL
# ------------------------------------
class StartupRequest(models.Model):
    startups = models.ForeignKey(
        Startups,
        on_delete=models.CASCADE,
        related_name='requests'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    # Client / company details
    address = models.CharField(max_length=255)
    gmail = models.TextField()  # client's email
    
    website = models.URLField(null=True, blank=True)
    linkedin = models.URLField(null=True, blank=True)

    # Payment and status
    status = models.CharField(max_length=20, default='pending')  # pending / paid / canceled
    stripe_session_id = models.CharField(max_length=255, null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.address} - {self.startups.name}"
