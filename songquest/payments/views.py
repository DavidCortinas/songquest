import json
import os
from django.http import HttpResponseNotAllowed, JsonResponse
import stripe
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

stripe.api_key = os.environ.get('STRIPE_SECRET')

@api_view(['POST'])
def test_payment(request):
    print(request)

    test_payment_intent = stripe.PaymentIntent.create(
        amount=1000, currency='pln', 
        payment_method_types=['acss_debit', 'au_becs_debit', 'bacs_debit', 
            'bancontact', 'blik', 'boleto', 'card', 'cashapp', 'eps', 'giropay',
            'ideal', 'link' 'paypal' 'pix', 'us_bank_account'],
        receipt_email='test@example.com')
    
    return Response(status=status.HTTP_200_OK, data=test_payment_intent)


@csrf_exempt
def create_payment(request):
    print('create_payment')
    try:
        # Ensure that the request method is POST
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request method'}, status=405)

        # Load the request body into a Python dictionary
        data = json.loads(request.body)
        print('create_payment data: ', data)

        # Create a PaymentIntent with Stripe
        intent = stripe.PaymentIntent.create(
            amount=data['price'],
            currency='usd',
            automatic_payment_methods={
                'enabled': True,
            },
        )

        # Return the client secret in the response
        return JsonResponse({
            'clientSecret': intent.client_secret  # Corrected spelling of 'clientSecret'
        }, status=200)

    except Exception as e:
        # Format the error response properly
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