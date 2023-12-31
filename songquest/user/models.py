from django.db import models

from django.contrib import admin
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        """Create and return a 'User' with an email and password."""
        if email is None:
            raise TypeError("Users must have an email.")

        user = self.model(email=self.normalize_email(email), **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and return a 'User' with superuser (admin) permissions.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(
        db_index=True, max_length=255, unique=True, null=True, blank=True)
    email = models.EmailField(db_index=True, unique=True)
    spotify_email = models.EmailField(null=True, blank=True)
    spotify_auth = models.BooleanField(default=False)
    # spotify_refresh = models.Ch
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    password = models.CharField(max_length=128, null=True, blank=True)

    USERNAME_FIELD = 'email'

    objects = UserManager()

    def __str__(self):
        return f"{self.email}"


class UserAdmin(admin.ModelAdmin):
    # Customize the user admin display fields, fieldsets, filter options, etc.
    list_display = ('id', 'email', 'username', 'is_active',
                    'is_staff', 'spotify_email', 'spotify_auth',)
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    search_fields = ('email', 'username')
    ordering = ('email',)
    filter_horizontal = ()
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('username', 'spotify_email')}),
        ('Permissions', {'fields': ('is_active',
         'is_staff', 'is_superuser', 'spotify_auth')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
