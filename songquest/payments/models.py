from django.db import models

class PricingPackage(models.Model):
    name = models.CharField(max_length=100)
    price = models.IntegerField()
    image = models.ImageField(upload_to='pricing_images/')
    order = models.IntegerField(default=0, help_text="Lower numbers display first.")

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['order']