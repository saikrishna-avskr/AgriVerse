from django.db import models

# Create your models here.
class Consultant(models.Model):
    CONSULTATION_CHOICES = [
        ('free', 'Free'),
        ('paid', 'Paid'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    about_me = models.TextField()
    consultation = models.CharField(max_length=4, choices=CONSULTATION_CHOICES, default='free')
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    experience = models.PositiveIntegerField(help_text="Experience in years")
    address = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name

    