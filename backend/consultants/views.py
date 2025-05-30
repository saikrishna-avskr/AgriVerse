from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.http import require_http_methods
import json
from django.http import JsonResponse
from .models import Consultant

@csrf_exempt
@require_http_methods(["GET", "POST"])
def consultants(request):
    if request.method == "GET":
        consultants = Consultant.objects.all().values()
        return JsonResponse(list(consultants), safe=False)
    elif request.method == "POST":
        data = json.loads(request.body)
        # print(data)
        consultant = Consultant.objects.create(
            name=data.get("name", ""),
            email=data.get("email", ""),
            phone_number=data.get("phone_number", 0),   # <-- correct
            about_me=data.get("about_me", ""),           # <-- correct
            consultation=data.get("consultation", ""),
            amount=data.get("amount", 0),
            experience=data.get("experience", ""),
            address=data.get("address", ""),
            # payment_id=data.get("payment_id", ""),
            # date=data.get("date", ""),
        )
        return JsonResponse({"status": "success", "id": consultant.id})