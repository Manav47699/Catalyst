import stripe
import json

from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail

from .models import Mentor, MentorCertificate, MentorRequest

# Stripe API key
stripe.api_key = settings.STRIPE_SECRET_KEY


# -----------------------------
# LIST ALL MENTORS (API)
# -----------------------------
def mentors_list_view(request):
    mentors = Mentor.objects.all()
    data = []

    for mentor in mentors:
        data.append({
            "id": mentor.id,
            "name": mentor.name,
            "gmail": mentor.gmail,
            "expertise": mentor.expertise,
            "bio": mentor.bio,
            "fees": mentor.fees,
            "available_time": mentor.available_time,  # ✅ FIXED (comma added)
            "profilepic": request.build_absolute_uri(
                mentor.profilepic.url
            ) if mentor.profilepic else None,
            "certificates": [
                request.build_absolute_uri(cert.certificate.url)
                for cert in mentor.certificates.all()
            ],
        })

    return JsonResponse(data, safe=False)


# -----------------------------
# CREATE MENTOR REQUEST (API)
# -----------------------------
@csrf_exempt
def create_mentor_request(request, mentor_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=400)

    mentor = get_object_or_404(Mentor, id=mentor_id)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    mentor_request = MentorRequest.objects.create(
        mentor=mentor,
        user=request.user if request.user.is_authenticated else None,
        company_name=data.get("company_name"),
        seeking_for=data.get("seeking_for"),
        mentorship_until=data.get("mentorship_until"),
        website=data.get("website"),
        linkedin=data.get("linkedin"),
        status="pending",
    )

    return JsonResponse({
        "mentor_request_id": mentor_request.id,
        "message": "Mentor request created successfully"
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

    mentor_request_id = data.get("mentor_request_id")
    mentor_request = get_object_or_404(MentorRequest, id=mentor_request_id)

    checkout_session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        mode="payment",
        line_items=[
            {
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": f"Mentorship with {mentor_request.mentor.name}",
                    },
                    "unit_amount": int(mentor_request.mentor.fees * 100),
                },
                "quantity": 1,
            }
        ],
        metadata={
            "mentor_request_id": str(mentor_request.id)
        },
        success_url="http://localhost:3000/payment-success",
        cancel_url="http://localhost:3000/payment-cancel",
    )

    mentor_request.stripe_session_id = checkout_session.id
    mentor_request.save()

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

    # Handle successful checkout
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        mentor_request_id = session["metadata"].get("mentor_request_id")

        if mentor_request_id:
            try:
                mentor_request = MentorRequest.objects.get(id=mentor_request_id)

                if mentor_request.status != "paid":
                    mentor_request.status = "paid"
                    mentor_request.paid_at = timezone.now()
                    mentor_request.save()

                    # Send email to mentor
                    subject = f"New Mentorship Appointment: {mentor_request.company_name}"
                    message = f"""
New Mentorship Appointment Confirmed (Payment Successful)

Company Name: {mentor_request.company_name}
Seeking For: {mentor_request.seeking_for}
Mentorship Upto: {mentor_request.mentorship_until}

Website: {mentor_request.website or 'N/A'}
LinkedIn: {mentor_request.linkedin or 'N/A'}

Stripe Session ID: {session['id']}
"""

                    send_mail(
                        subject,
                        message,
                        settings.DEFAULT_FROM_EMAIL,
                        [mentor_request.mentor.gmail],
                        fail_silently=False
                    )

            except MentorRequest.DoesNotExist:
                pass

    return HttpResponse(status=200)
