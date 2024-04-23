from django.contrib import admin
from .models import PricingPackage

class PricingPackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'order', 'image')
    list_editable = ('order',)  # Allows editing the order directly in the list
    list_per_page = 10  # Optional: Sets number of items per page in admin list view

admin.site.register(PricingPackage, PricingPackageAdmin)