from django.shortcuts import render
from django.http import JsonResponse
from .models import Consultant

# Create your views here.
def consultants(request):
    consultants = Consultant.objects.all().values()
    return JsonResponse(list(consultants), safe=False)