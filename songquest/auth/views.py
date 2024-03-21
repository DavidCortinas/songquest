from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from songquest.utilities.email_utlities import send_verification_email

User = get_user_model()

class ResendVerificationEmail(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.headers.get('User-Id')
        if not user_id:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"error": "User with this User ID does not exist"}, status=status.HTTP_404_NOT_FOUND)

        if user.email_verified:
            return Response({"message": "Email is already verified"}, status=status.HTTP_400_BAD_REQUEST)

        verification_token = user.email_verification_token
        if not verification_token:
            return Response({"error": "Verification token not found"}, status=status.HTTP_400_BAD_REQUEST)

        send_verification_email(user.email, verification_token)
        return Response({"message": "Verification email resent successfully"}, status=status.HTTP_200_OK)

def verify_email(request, token):
    try:
        user = User.objects.get(email_verification_token=token)
    except User.DoesNotExist:
        return HttpResponseBadRequest("Invalid or expired verification token.")
    
    email_verified = user.email_verified
    
    # Mark the email as verified if it's not already
    if not email_verified:
        user.email_verified = True
        user.save()
    
    # Construct the redirect URL with the email_verified status as a query parameter
    redirect_url = f"http://localhost:3000/registration-success?email_verified={user.email_verified}"
    
    # Redirect the user to the frontend URL
    return HttpResponseRedirect(redirect_url)
