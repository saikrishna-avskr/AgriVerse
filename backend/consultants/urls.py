from django.urls import path
from . import views

urlpatterns = [
    path('consultants/', views.consultants, name='consultants'), 
]