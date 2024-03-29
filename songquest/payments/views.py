import json
import os
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.contrib.auth import get_user_model
import stripe
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

stripe.api_key = os.environ.get('STRIPE_SECRET')

@api_view(['POST'])
def test_payment(request):
    test_payment_intent = stripe.PaymentIntent.create(
        amount=1000, currency='pln', 
        payment_method_types=['acss_debit', 'au_becs_debit', 'bacs_debit', 
            'bancontact', 'blik', 'boleto', 'card', 'cashapp', 'eps', 'giropay',
            'ideal', 'link' 'paypal' 'pix', 'us_bank_account'],
        receipt_email='test@example.com')
    
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
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request method'}, status=405)

        data = json.loads(request.body)
        
        user_id = request.headers.get('User-Id')

        user = get_user_model().objects.get(id=user_id)
        stripe_customer_id = create_stripe_customer(user)

        intent = stripe.PaymentIntent.create(
            amount=data['price'],
            currency='usd',
            customer=stripe_customer_id,
            automatic_payment_methods={
                'enabled': True,
            },
            receipt_email=user.email,
            setup_future_usage='on_session',
        )

        return JsonResponse({
            'clientSecret': intent.client_secret  
        }, status=200)

    except Exception as e:
        return JsonResponse({'error': f'Failed to Create Payment: {str(e)}'}, status=403)
    

@csrf_exempt
def get_all_pricing_packages(request):
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])
    
    pricing_packages = [
        {
            'id': 1,
            'name': '3 Tokens',
            'price': 300,
        },
        {
            'id': 2,
            'name': '20 Tokens',
            'price': 1000,
        },
        {
            'id': 3,
            'name': '10 Tokens',
            'price': 700,
        },
    ]

    return JsonResponse({'pricing_packages': pricing_packages})


@csrf_exempt
@api_view(['POST'])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    temp_endpoint_secret = os.environ.get('STRIPE_TEMP_ENDPOINT_SECRET', '')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, temp_endpoint_secret
        )
    except ValueError as e:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)

    if event['type'] == 'charge.succeeded':
        charge = event['data']['object']

        customer_id = charge.get('customer', None)
        if customer_id:
            customer = stripe.Customer.retrieve(customer_id)
            customer_email = customer.email

            # TODO: Update this to retrieve user based on your own logic, e.g., by customer email
            User = get_user_model()
            user = User.objects.get(email=customer_email)
            
            # TODO: Calculate the token amount based on the amount paid
            token_amount = calculate_tokens(charge['amount'])
            user.tokens += token_amount
            user.save()

            # TODO: Record the transaction in your database
        else:
            print('No customer ID associated with this charge.')

    # Other event types can be handled here

    return HttpResponse(status=200)


def calculate_tokens(amount_paid):
    """
    Calculate the number of tokens based on the amount paid.
    
    Args:
    amount_paid (int): The amount paid in cents.
    
    Returns:
    int: The number of tokens corresponding to the amount paid.
    """
    # Define the price to token mapping
    price_to_token = {
        300: 3,   # $3 for 3 tokens
        700: 10,  # $7 for 10 tokens
        1000: 20  # $10 for 20 tokens
    }
    
    # Calculate tokens based on the amount paid
    return price_to_token.get(amount_paid, 0)  # Default to 0 if amount is not in the mapping
