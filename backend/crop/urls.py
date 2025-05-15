from django.urls import path
from .views import *

urlpatterns = [
    path('predict-disease/', predict_disease_view, name='predict_disease'),
    path('crop-guidance/', farmer_crop_guidance, name='farmer_crop_guidance'),
    path('home_garden_guidance/', home_garden_guidance, name='home_garden_guidance'),
]