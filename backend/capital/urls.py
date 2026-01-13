from django.urls import path
from . import views

urlpatterns = [
    # List all startups
    path('startups/', views.startups_list_view, name='startups-list'),

    # Create a startup request
    path(
        'startups/<int:startup_id>/create/',
        views.create_startup_request,
        name='create-startup-request'
    ),

    # Stripe checkout session
    path(
        'stripe/create-checkout-session/',
        views.create_checkout_session,
        name='create-checkout-session'
    ),

    # Stripe webhook for payment confirmation
    path(
        'stripe/webhook/',
        views.stripe_webhook,
        name='stripe-webhook'
    ),
]
