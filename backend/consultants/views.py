from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_http_methods
import json
from django.http import JsonResponse
from .models import Consultant

# Exempt this view from CSRF verification and allow only GET and POST requests
@csrf_exempt
@require_http_methods(["GET", "POST"])
def consultants(request):
    """
    Handle GET and POST requests for Consultant objects.
    GET: Returns a list of all consultants.
    POST: Creates a new consultant with the provided data.
    """
    if request.method == "GET":
        # Retrieve all Consultant objects as dictionaries
        consultants = Consultant.objects.all().values()
        # Return the list of consultants as a JSON response
        return JsonResponse(list(consultants), safe=False)
    elif request.method == "POST":
        # Parse the JSON body of the request
        data = json.loads(request.body)
        # Create a new Consultant object with the provided data
        consultant = Consultant.objects.create(
            name=data.get("name", ""),
            email=data.get("email", ""),
            phone_number=data.get("phone_number", 0),   # Default to 0 if not provided
            about_me=data.get("about_me", ""),          # Default to empty string if not provided
            consultation=data.get("consultation", ""),
            amount=data.get("amount", 0),
            experience=data.get("experience", ""),
            address=data.get("address", ""),
            # payment_id=data.get("payment_id", ""),
            # date=data.get("date", ""),
        )
        # Return a success response with the new consultant's ID
        return JsonResponse({"status": "success", "id": consultant.id})