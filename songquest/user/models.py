from django.db import models
from django.contrib import admin
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        """Create and return a 'User' with an email and password."""
        if not email:
            raise ValueError("Users must have an email.")

        email = self.normalize_email(email)
        user = self.model(email=email, **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and return a 'User' with superuser (admin) permissions.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if not extra_fields.get('is_staff'):
            raise ValueError('Superuser must have is_staff=True.')
        if not extra_fields.get('is_superuser'):
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    display_name = models.CharField(
        db_index=True, max_length=255, unique=True, null=True, blank=True)
    email = models.EmailField(db_index=True, unique=True)
    spotify_access = models.CharField(null=True, blank=True)
    spotify_refresh = models.CharField(null=True, blank=True)
    spotify_expires_at = models.FloatField(null=True, blank=True)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    email_verification_token = models.CharField(max_length=255, blank=True, null=True)
    email_verified = models.BooleanField(default=False)
    xp = models.IntegerField(default=0)
    tokens = models.IntegerField(default=15)
    stripe_customer_id = models.CharField(max_length=255, null=True, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    birthday = models.DateField(null=True, blank=True)
    USER_TYPES = (
        ('fan', 'Fan'),
        ('pro_user', 'Pro User'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='fan')
    preferred_genres = models.ManyToManyField('Genre', related_name='users', blank=True)

    @property
    def spotify_connected(self):
        return all([self.spotify_access, self.spotify_refresh, self.spotify_expires_at])

    @property
    def dealer_profile(self):
        try:
            return self.dealer
        except Dealer.DoesNotExist:
            return None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def update_xp(self, action):
        """Update user's XP based on the action"""
        xp_values = {
            'quest': 15,
            'collect': 15,
            'share': 35,
            'excavate': 35,
        }

        if action not in xp_values:
            raise ValueError(f"Invalid action: {action}")
        
        xp_to_add = xp_values[action]
        self.xp += xp_to_add

        if self.xp >= 250:
            self.tokens += 5
            self.xp = (self.xp - 250) % 250

        self.save()

    def use_tokens(self, action):
        """Update user's tokens based on the action"""
        tokens_price = {
            'quest': 1,
            'collect': 3,
        }

        if action not in tokens_price:
            raise ValueError(f"Invalid action: {action}")
        
        tokens_to_use = tokens_price[action]

        if self.tokens < tokens_to_use:
            raise ValueError(
                f"Insufficient token amount: you have ${self.tokens} tokens this action requires ${tokens_to_use} tokens"
            )

        self.tokens -= tokens_to_use
        self.save()

    def __str__(self):
        return self.email
    

class Dealer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='dealer_profile')
    # Add other fields specific to dealers if needed

    def __str__(self):
        return self.user.email


class Genre(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'display_name', 'is_active', 'is_staff', 'spotify_refresh', 'email_verification_token', 'email_verified',)
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'email_verified', 'email_verification_token',) 
    search_fields = ('email', 'display_name')
    ordering = ('email',)
    filter_horizontal = ()
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ['display_name']}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'user_permissions')}),
        ('Spotify Info', {'fields': ('spotify_access', 'spotify_refresh', 'spotify_expires_at')}),
        ('Email Verification', {'fields': ('email_verification_token', 'email_verified',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_superuser'),
        }),
    )
