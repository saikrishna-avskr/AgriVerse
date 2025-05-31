# Import the path function to define URL patterns
from django.urls import path
# Import views from the current package
from . import views

# Define URL patterns for the consultants app
urlpatterns = [
    # Route for the consultants view
    path('consultants/', views.consultants, name='consultants'), 
]