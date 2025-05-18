from django.urls import path
from . import views

urlpatterns = [
    path('predict-disease/', views.predict_disease_view, name='predict_disease'),
    path('crop-guidance/', views.farmer_crop_guidance, name='farmer_crop_guidance'),
    path('home_garden_guidance/', views.home_garden_guidance, name='home_garden_guidance'),
    path('agri-news/', views.agri_news, name='agri_news'),
    path('crop-rotation/', views.crop_rotation, name='crop_rotation'),
    path('yield-predictor/', views.yield_predictor, name='yield_predictor'),
    path('current-weather/', views.current_weather, name='current_weather'),
]