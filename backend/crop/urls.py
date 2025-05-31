from django.urls import path
from . import views

# Define URL patterns for the crop app.
# Each path maps a URL endpoint to a view function.

urlpatterns = [
    # Endpoint for predicting crop diseases
    path('predict-disease/', views.predict_disease_view, name='predict_disease'),

    # Endpoint for providing crop guidance to farmers
    path('crop-guidance/', views.farmer_crop_guidance, name='farmer_crop_guidance'),

    # Endpoint for home garden crop guidance
    path('home_garden_guidance/', views.home_garden_guidance, name='home_garden_guidance'),

    # Endpoint for fetching latest agriculture news
    path('agri-news/', views.agri_news, name='agri_news'),

    # Endpoint for crop rotation recommendations
    path('crop-rotation/', views.crop_rotation, name='crop_rotation'),

    # Endpoint for predicting crop yield
    path('yield-predictor/', views.yield_predictor, name='yield_predictor'),

    # Endpoint for getting current weather information
    path('current-weather/', views.current_weather, name='current_weather'),
]