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
    username = models.CharField(
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

    @property
    def spotify_connected(self):
        return all([self.spotify_access, self.spotify_refresh, self.spotify_expires_at])

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'username', 'is_active', 'is_staff', 'spotify_refresh', 'email_verification_token', 'email_verified',)
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'email_verified', 'email_verification_token',) 
    search_fields = ('email', 'username')
    ordering = ('email',)
    filter_horizontal = ()
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ['username']}),
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
