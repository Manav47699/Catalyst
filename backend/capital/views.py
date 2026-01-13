import stripe
import json

from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail

from .models import Startups, StartupRequest


# Stripe API key
stripe.api_key = settings.STRIPE_SECRET_KEY


# -----------------------------
# LIST ALL STARTUPS (API)
# -----------------------------
def startups_list_view(request):
    startups = Startups.objects.all()
    data = []

    for startup in startups:
        data.append({
            "id": startup.id,
            "name": startup.name,
            "gmail": startup.gmail,
            "about_us": startup.about_us,
            "benefits": startup.benefits,
            "minimum_donation": startup.minimum_donation,
            "profilepic": request.build_absolute_uri(
                startup.profilepic.url
            ) if startup.profilepic else None,
        })

    return JsonResponse(data, safe=False)


# -----------------------------
# CREATE STARTUP REQUEST (API)
# -----------------------------
@csrf_exempt
def create_startup_request(request, startup_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    startup = get_object_or_404(Startups, id=startup_id)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    startup_request = StartupRequest.objects.create(
        startup=startup,
        user=request.user if request.user.is_authenticated else None,
        address=data.get("address"),
        gmail=data.get("gmail"),
        website=data.get("website"),
        linkedin=data.get("linkedin"),
        status="pending",
    )

    return JsonResponse({
        "startup_request_id": startup_request.id,
        "message": "Startup request created successfully"
    })


# -----------------------------
# CREATE STRIPE CHECKOUT SESSION
# -----------------------------
@csrf_exempt
def create_checkout_session(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    startup_request_id = data.get("startup_request_id")
    startup_request = get_object_or_404(StartupRequest, id=startup_request_id)

    checkout_session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        mode="payment",
        line_items=[
            {
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": f"Donation to {startup_request.startup.name}",
                    },
                    "unit_amount": int(startup_request.startup.minimum_donation * 100),
                },
                "quantity": 1,
            }
        ],
        metadata={
            "startup_request_id": str(startup_request.id)
        },
        success_url="http://localhost:3000/payment-success",
        cancel_url="http://localhost:3000/payment-cancel",
    )

    startup_request.stripe_session_id = checkout_session.id
    startup_request.save()

    return JsonResponse({
        "checkout_url": checkout_session.url
    })


# -----------------------------
# STRIPE WEBHOOK (AUTO PAYMENT CONFIRMATION)
# -----------------------------
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")

    try:
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=400)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        startup_request_id = session["metadata"].get("startup_request_id")

        if startup_request_id:
            try:
                startup_request = StartupRequest.objects.get(id=startup_request_id)

                if startup_request.status != "paid":
                    startup_request.status = "paid"
                    startup_request.paid_at = timezone.now()
                    startup_request.save()

                    # Send email to startup
                    subject = f"New Donation Received from {startup_request.address}"
                    message = f"""
Donation Payment Successful

Address: {startup_request.address}
Email: {startup_request.gmail}

Website: {startup_request.website or 'N/A'}
LinkedIn: {startup_request.linkedin or 'N/A'}

Stripe Session ID: {session['id']}
"""

                    send_mail(
                        subject,
                        message,
                        settings.DEFAULT_FROM_EMAIL,
                        [startup_request.startup.gmail],
                        fail_silently=False
                    )

            except StartupRequest.DoesNotExist:
                pass

    return HttpResponse(status=200)


from django.http import JsonResponse
from .models import Startups

def startups_list_view(request):
    startups = Startups.objects.all()
    data = []

    for startup in startups:
        data.append({
            "id": startup.id,
            "name": startup.name,
            "gmail": startup.gmail,
            "about_us": startup.about_us,
            "benefits": startup.benefits,
            "minimum_donation": startup.minimum_donation,
            "profilepic": request.build_absolute_uri(startup.profilepic.url) if startup.profilepic else None,
        })

    return JsonResponse(data, safe=False)
