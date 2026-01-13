from django import forms
from .models import StartupRequest


class StartupRequestForm(forms.ModelForm):
    class Meta:
        model = StartupRequest
        fields = [
            'address',
            'gmail',
            'website',
            'linkedin',
        ]
