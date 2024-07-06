import json
import os
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.contrib.auth import get_user_model
import stripe
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from songquest.payments.models import PricingPackage
from songquest.utilities.email_utlities import (
    notify_user_of_failed_charge,
    notify_user_of_failed_payment,
)

stripe.api_key = os.environ.get("STRIPE_SECRET")


@api_view(["POST"])
def test_payment(request):
    test_payment_intent = stripe.PaymentIntent.create(
        amount=1000,
        currency="pln",
        payment_method_types=[
            "acss_debit",
            "au_becs_debit",
            "bacs_debit",
            "bancontact",
            "blik",
            "boleto",
            "card",
            "cashapp",
            "eps",
            "giropay",
            "ideal",
            "link" "paypal" "pix",
            "us_bank_account",
        ],
        receipt_email="test@example.com",
    )

    return Response(status=status.HTTP_200_OK, data=test_payment_intent)


def create_stripe_customer(user):
    if not user.stripe_customer_id:
        customer = stripe.Customer.create(
            email=user.email,
        )
        user.stripe_customer_id = customer.id
        user.save()
    return user.stripe_customer_id


@csrf_exempt
def create_payment(request):
    try:
        if request.method != "POST":
            return JsonResponse({"error": "Invalid request method"}, status=405)

        data = json.loads(request.body)

        user_id = request.headers.get("User-Id")

        user = get_user_model().objects.get(id=user_id)
        stripe_customer_id = create_stripe_customer(user)

        intent = stripe.PaymentIntent.create(
            amount=data["price"],
            currency="usd",
            customer=stripe_customer_id,
            automatic_payment_methods={
                "enabled": True,
            },
            receipt_email=user.email,
            setup_future_usage="on_session",
        )

        return JsonResponse({"clientSecret": intent.client_secret}, status=200)

    except Exception as e:
        return JsonResponse(
            {"error": f"Failed to Create Payment: {str(e)}"}, status=403
        )


@csrf_exempt
def get_all_pricing_packages(request):
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"])

    pricing_packages = PricingPackage.objects.all()
    packages_data = [
        {
            "id": package.id,
            "name": package.name,
            "price": package.price,  # Keep as integer
            "image": (
                request.build_absolute_uri(package.image.url) if package.image else None
            ),
        }
        for package in pricing_packages
    ]

    return JsonResponse({"pricing_packages": packages_data})


@csrf_exempt
@api_view(["POST"])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META["HTTP_STRIPE_SIGNATURE"]
    endpoint_secret = os.environ.get("STRIPE_ENDPOINT_SECRET", "")
    temp_endpoint_secret = os.environ.get("STRIPE_TEMP_ENDPOINT_SECRET", "")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError as e:
        return JsonResponse({"error": "Invalid payload"}, status=400)
    except stripe.error.SignatureVerificationError as e:
        return JsonResponse({"error": "Signature verification failed"}, status=400)

    event_type = event.get("type")
    data_object = event.get("data", {}).get("object", {})

    if event_type == "payment_intent.succeeded":
        return handle_payment_intent_succeeded(data_object)
    elif event_type == "payment_intent.payment_failed":
        return handle_payment_intent_failed(data_object)
    elif event_type == "charge.failed":
        return handle_charge_failed(data_object)
    else:
        return JsonResponse({"error": f"Unhandled event type {event_type}"}, status=400)


def calculate_tokens(amount_paid):
    """
    Calculate the number of tokens based on the amount paid.

    Args:
    amount_paid (int): The amount paid in cents.

    Returns:
    int: The number of tokens corresponding to the amount paid.
    """
    price_to_token = {
        200: 8,  # $2 for 8 tokens
        800: 40,  # $8 for 40 tokens
        1250: 80,  # $12.50 for 80 tokens
    }

    return price_to_token.get(
        amount_paid, 0
    )  # Default to 0 if amount is not in the mapping


def handle_payment_intent_succeeded(payment_intent):
    customer_id = payment_intent.get("customer")
    if customer_id:
        customer = stripe.Customer.retrieve(customer_id)
        customer_email = customer.email

        User = get_user_model()
        try:
            user = User.objects.get(email=customer_email)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": f"No user found for email {customer_email}"}, status=404
            )

        token_amount = calculate_tokens(payment_intent["amount_received"])
        user.tokens += token_amount
        user.save()

        return JsonResponse({"status": "success"}, status=200)
    else:
        return JsonResponse(
            {"error": "No customer ID associated with this payment intent."}, status=400
        )


def handle_charge_failed(charge):
    customer_id = charge.get("customer")
    if customer_id:
        customer = stripe.Customer.retrieve(customer_id)
        customer_email = customer.email

        User = get_user_model()
        try:
            user = User.objects.get(email=customer_email)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": f"No user found for email {customer_email}"}, status=404
            )

        notify_user_of_failed_charge(user, charge)
        return JsonResponse(
            {"status": "failure", "message": "Charge failed"}, status=402
        )
    else:
        return JsonResponse(
            {"error": "No customer ID associated with this failed charge."}, status=400
        )


def handle_payment_intent_failed(payment_intent):
    customer_id = payment_intent.get("customer")
    if customer_id:
        customer = stripe.Customer.retrieve(customer_id)
        customer_email = customer.email

        User = get_user_model()
        try:
            user = User.objects.get(email=customer_email)
        except User.DoesNotExist:
            return JsonResponse(
                {"error": f"No user found for email {customer_email}"}, status=404
            )

        notify_user_of_failed_payment(user, payment_intent)
        return JsonResponse(
            {"status": "failure", "message": "Payment intent failed"}, status=402
        )
    else:
        return JsonResponse(
            {"error": "No customer ID associated with this failed payment intent."},
            status=400,
        )
