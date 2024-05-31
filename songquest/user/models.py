from django.db import models
from django.conf import settings
from django.contrib import admin
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


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
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if not extra_fields.get("is_staff"):
            raise ValueError("Superuser must have is_staff=True.")
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    USER_TYPES = (
        ("fan", "Fan"),
        ("pro_user", "Pro User"),
    )

    display_name = models.CharField(
        db_index=True, max_length=255, unique=True, null=True, blank=True
    )
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
    karma = models.IntegerField(default=0)
    tokens = models.IntegerField(default=0)
    stripe_customer_id = models.CharField(max_length=255, null=True, blank=True)
    profile_image = models.ImageField(
        upload_to="profile_images/", null=True, blank=True
    )
    birthday = models.DateField(null=True, blank=True)
    profession = models.CharField(max_length=255, null=True, blank=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default="fan")
    preferred_genres = models.ManyToManyField("Genre", related_name="users", blank=True)

    @property
    def spotify_connected(self):
        return all([self.spotify_access, self.spotify_refresh, self.spotify_expires_at])

    @property
    def dealer_profile(self):
        try:
            return self.dealer
        except Dealer.DoesNotExist:
            return None

    @property
    def professional_info(self):
        """Return profession info if user is a pro_user, else None."""
        if self.user_type == "pro_user":
            return self.profession
        return None

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def update_karma(self, action):
        """Update user's XP based on the action"""
        karma_values = {
            "dig": 0,
            "add": 1,
            "like": 3,
            "follow": 5,
            "collect": 10,
            "share": 20,
            "excavate": 35,
        }

        if action not in karma_values:
            raise ValueError(f"Invalid action: {action}")

        karma_to_add = karma_values[action]
        self.karma += karma_to_add

        if self.karma >= 100:
            self.tokens += 5
            self.karma = (self.karma - 100) % 100

        self.save()

    def use_tokens(self, action):
        """Update user's tokens based on the action"""
        tokens_price = {
            "collect": 3,
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

    def is_onboarding_complete(self):
        required_fields = [
            self.display_name,
            self.birthday,
            self.user_type,
            self.preferred_genres.exists(),
            self.spotify_access,
        ]
        return all(required_fields)

    def complete_onboarding(self):
        """Award the onboarding achievement and badge if onboarding is complete."""
        profile, profile_created = Profile.objects.get_or_create(user=self)
        if (
            self.is_onboarding_complete()
            and not profile.achievements.filter(name="Onboarding Completed").exists()
        ):
            self.is_active = True
            # self.save(update_fields=["is_active"])
            onboarding_achievement = Achievement.objects.get(
                name="Onboarding Completed"
            )

            self.karma += onboarding_achievement.karma_reward
            self.tokens += onboarding_achievement.token_reward
            self.save(update_fields=["is_active", "karma", "tokens"])

            profile.achievements.add(onboarding_achievement)
            profile.badges.add(onboarding_achievement.badge_reward)

    def __str__(self):
        return self.email


class Dealer(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="dealer_profile",
    )
    # Add other fields specific to dealers if needed

    def __str__(self):
        return self.user.email


class Genre(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Badge(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    image = models.ImageField(upload_to="badges/")

    def __str__(self):
        return self.name


class Achievement(models.Model):
    name = models.CharField(max_length=100, unique=True)
    karma_reward = models.IntegerField(default=0)
    token_reward = models.IntegerField(default=0)
    badge_reward = models.ForeignKey(
        Badge, on_delete=models.CASCADE, related_name="achievements"
    )

    def __str__(self):
        return self.name


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile"
    )
    achievements = models.ManyToManyField(Achievement, blank=True)
    badges = models.ManyToManyField(Badge, blank=True)

    def __str__(self):
        return self.user.email


class AchievementInline(admin.TabularInline):
    model = Profile.achievements.through
    extra = 0  # Removes the extra blank fields
    verbose_name = "Achievement"
    verbose_name_plural = "Achievements"
    can_delete = True  # Allows removing an achievement from a user


class BadgeInline(admin.TabularInline):
    model = Profile.badges.through
    extra = 0  # Removes the extra blank fields
    verbose_name = "Badge"
    verbose_name_plural = "Badges"
    can_delete = True  # Allows removing a badge from a user


class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        "get_email",
        "get_display_name",
        "get_user_type",
        "get_profession",
        "get_badges",
        "get_achievements",
    )
    search_fields = ("user__email", "user__display_name")
    list_filter = ("user__is_active", "user__is_staff", "user__user_type")
    inlines = [AchievementInline, BadgeInline]

    def get_email(self, obj):
        return obj.user.email

    get_email.admin_order_field = "user__email"  # Allows column order sorting
    get_email.short_description = "Email"  # Renames column head

    def get_display_name(self, obj):
        return obj.user.display_name

    get_display_name.admin_order_field = "user__display_name"
    get_display_name.short_description = "Display Name"

    def get_user_type(self, obj):
        return obj.user.user_type

    get_user_type.admin_order_field = "user__user_type"
    get_user_type.short_description = "User Type"

    def get_profession(self, obj):
        return obj.user.profession

    get_profession.admin_order_field = "user__profession"
    get_profession.short_description = "Profession"

    def get_badges(self, obj):
        badges = obj.badges.all()
        if badges:
            return ", ".join([badge.name for badge in badges])
        return "None"

    get_badges.short_description = "Badges"

    def get_achievements(self, obj):
        achievements = obj.achievements.all()
        if achievements:
            return ", ".join([achievement.name for achievement in achievements])
        return "None"

    get_achievements.short_description = "Achievements"


class UserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "email",
        "display_name",
        "is_active",
        "is_staff",
        "spotify_refresh",
        "email_verification_token",
        "email_verified",
    )
    list_filter = (
        "is_staff",
        "is_superuser",
        "is_active",
        "email_verified",
        "email_verification_token",
    )
    search_fields = ("email", "display_name")
    ordering = ("email",)
    filter_horizontal = ()
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ["display_name"]}),
        (
            "Permissions",
            {"fields": ("is_active", "is_staff", "is_superuser", "user_permissions")},
        ),
        (
            "Spotify Info",
            {"fields": ("spotify_access", "spotify_refresh", "spotify_expires_at")},
        ),
        (
            "Email Verification",
            {
                "fields": (
                    "email_verification_token",
                    "email_verified",
                )
            },
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_superuser",
                ),
            },
        ),
    )
