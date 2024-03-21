from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.conf import settings
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import redirect

def send_verification_email(user_email, verification_token):
    subject = 'Confirm Your Email to Start Your SongQuest Journey'
    message = (
        "Dear Music Explorer,\n\n"
        "Welcome to SongQuest, where your next musical discovery awaits! We're thrilled to have you embark on this personalized journey through the vast universe of music with us. To ensure you have full access to all the features and personalized recommendations, there's just one small step left - verifying your email.\n\n"
        f"Please click the link below to confirm your email address and officially start your quest:\n\n"
        f"{settings.BASE_URL}/verify/{verification_token}/\n\n"
        "If you didn't sign up for SongQuest, please disregard this message. Your email address won't be added to our list.\n\n"
        "Thank you for joining us at SongQuest. Get ready to discover, explore, and enjoy music like never before!\n\n"
        "Warm regards,\n\n"
        "The SongQuest Team\n\n"
        "P.S. If you have any questions or need assistance, feel free to reach out to us at support@songquest.com. Let the music play!"
    )
    from_email = settings.DEFAULT_FROM_EMAIL
    print('from: ', from_email)
    recipient_list = [user_email]
    print(recipient_list)
    print('send mail')

    send_mail(subject, message, from_email, recipient_list)




