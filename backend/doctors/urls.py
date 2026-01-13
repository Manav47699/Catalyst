from django.urls import path
from . import views

urlpatterns = [
    # List all mentors
    path('mentors/', views.mentors_list_view, name='mentors-list'),

    # Create a mentor request
    path('mentors/<int:mentor_id>/create/', views.create_mentor_request, name='create-mentor-request'),

    # Stripe checkout session
    path('stripe/create-checkout-session/', views.create_checkout_session, name='create-checkout-session'),

    # Stripe webhook for payment confirmation
    path('stripe/webhook/', views.stripe_webhook, name='stripe-webhook'),
]
