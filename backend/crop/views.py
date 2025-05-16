from django.http import JsonResponse
from google.genai import types
from backend.settings import client
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def predict_disease_view(request):
    if request.method == 'POST' and request.FILES.get('image'):
        try:
            image_file = request.FILES['image']
            image_bytes = image_file.read()

            prompt = """
            This is a photo of a crop leaf. Identify:
            1. Whether the leaf is healthy or diseased.
            2. If diseased, name the disease.
            3. Provide a solution (organic or chemical).
            4. Suggest preventive measures.
            
            Format:
            - Health Status: (Healthy / Diseased)
            - Disease Name: (If any)
            - Solution: (Treatment recommendation)
            - Prevention Tips: (To avoid recurrence)
            """

            response = client.models.generate_content(
                model='gemini-2.0-flash',
                contents=[
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type='image/jpeg',
                ),prompt
                ]
            )
            # print(response)
            return JsonResponse({'result': response.text})
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'POST an image file.'}, status=400)

# def crop_guidance_view(request):
#     if request.method == 'POST':
#         region = request.POST.get('region', '')
#         soil = request.POST.get('soil_type', '')
#         weather = request.POST.get('weather', '')
#         previous_crop = request.POST.get('previous_crop', '')
#         area = request.POST.get('area', '')
#         area_unit = request.POST.get('area_unit', 'acres')

#         prompt = f"""
#         Based on the following conditions:
#         - Region: {region}
#         - Soil Type: {soil}
#         - Weather Conditions: {weather}
#         - Previous Crop: {previous_crop}
#         - Area: {area} {area_unit}

#         Recommend the best crop to plant next. Also provide:
#         - Required fertilizers and irrigation methods
#         - Ideal planting and harvesting times
#         - Any additional tips for optimal yield
#         Format the answer clearly in bullet points.
#         """
#         response = client.models.generate_content(
#             model="gemini-2.0-flash", contents=prompt
#         )
#         return JsonResponse({'guidance': response.text})
    
#     return JsonResponse({'error': 'POST required fields.'}, status=400)
@csrf_exempt
def farmer_crop_guidance(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        prompt = f"""
        Based on the following parameters, suggest the most suitable crops and a brief cultivation plan:

        Location: {data.get('location','--')}
        Latitude/Longitude: {data.get('latitude_longitude','--')}
        Soil Type: {data.get('soil_type')}
        Soil pH: {data.get('soil_ph')}
        Soil Moisture: {data.get('soil_moisture','--')}
        NPK Levels: {data.get('soil_fertility')}
        Current Season: {data.get('season')}
        Rainfall: {data.get('rainfall')}
        Temperature Range: {data.get('temperature')}
        Humidity: {data.get('humidity')}
        Sunlight Availability: {data.get('sunlight')}
        Previous Crop: {data.get('previous_crop')}
        Harvest Date: {data.get('harvest_date')}
        Irrigation: {data.get('irrigation')}
        Fertilizer Access: {data.get('fertilizer_availability')}
        Equipment: {data.get('equipment_access')}
        Preferred Crops: {data.get('preferred_crops')}
        Market Demand: {data.get('market_demand')}
        Land Size: {data.get('land_size')}

        Please provide suggestions with reasons and basic implementation tips.
        """

        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=prompt
        )
        return JsonResponse({"guidance": response.text})
    return JsonResponse({"error": "POST required fields."}, status=400)

@csrf_exempt
def home_garden_guidance(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        prompt = f"""
        I am a beginner/home gardener. Based on the following inputs, suggest easy-to-grow plants, vegetables, or fruits and simple guidance:

        Location: {data.get('location')}
        Space Type: {data.get('space_type')}
        Space Size: {data.get('space_size')}
        Sunlight Hours: {data.get('sunlight')}
        Container Type: {data.get('containers')}
        Soil Type: {data.get('soil_type')}
        Water Availability: {data.get('water_availability')}
        Temperature: {data.get('temperature')}
        Humidity: {data.get('humidity')}
        Effort Level: {data.get('effort_level')}
        Preferred Plants: {data.get('preferred_plants')}
        Experience Level: {data.get('experience')}

        Please recommend 3-5 suitable plants with maintenance tips, watering needs, and any indoor/outdoor considerations.
        """

        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=prompt
        )
        return JsonResponse({"guidance": response.text})
    return JsonResponse({"error": "POST required fields."}, status=400)