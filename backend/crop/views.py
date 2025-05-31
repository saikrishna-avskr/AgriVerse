from django.http import JsonResponse
from google.genai import types
from backend.settings import client
from django.views.decorators.csrf import csrf_exempt
import json
import geocoder
import requests
import google.generativeai as genai
from django.conf import settings
from datetime import datetime
import joblib
import pandas as pd
import os
import base64

# View to predict crop disease from an uploaded image using Gemini API
@csrf_exempt
def predict_disease_view(request):
    if request.method == 'POST' and request.FILES.get('image'):
        try:
            image_file = request.FILES['image']
            image_bytes = image_file.read()
            language = request.POST.get('Language', 'english')
            mode = request.POST.get('mode', 'gemini')
            # Prompt for Gemini model to analyze the image and provide diagnosis and advice
            prompt = f"""
            This is a photo of a crop leaf. Identify:
            1. Whether the leaf is healthy or diseased.
            2. If diseased, name the disease.
            3. Provide a solution (organic or chemical).
            4. Suggest preventive measures.
            provide the response in {language} language.
            in the following format:
            - Health Status: (Healthy / Diseased)
            - Disease Name: (If any)
            - Solution: (Treatment recommendation)
            - Prevention Tips: (To avoid recurrence)
            """
            # Call Gemini API with image and prompt
            response = client.models.generate_content(
                model='gemini-2.0-flash',
                contents=[
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type='image/jpeg',
                ),prompt
                ]
            )
            # Encode image to base64 for frontend display
            image_base64 = base64.b64encode(image_bytes).decode('utf-8')
            if mode == 'gemini':
                return JsonResponse({'result': response.text, 'image': image_base64}, status=200)
            elif mode == 'model':
                url = "https://susya.onrender.com"
                response = requests.post(url,json = {"image":image_base64})
                print(response.text.strip())
            return JsonResponse({'result': response.text,'image': image_base64}, status=200)
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'POST an image file.'}, status=400)

# View to provide crop guidance based on farm and environmental parameters
@csrf_exempt
def farmer_crop_guidance(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        # Prompt for Gemini model to suggest crops and cultivation plan
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
        Language: {data.get('language','english')}

        Please provide suggestions with reasons and basic implementation tips and completely in the language mentioned.
        """

        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=prompt
        )
        return JsonResponse({"guidance": response.text})
    return JsonResponse({"error": "POST required fields."}, status=400)

# View to provide home gardening guidance for beginners
@csrf_exempt
def home_garden_guidance(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        # Prompt for Gemini model to suggest easy plants and care tips
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
        Language: {data.get('language','english')}

        Please recommend 3-5 suitable plants with maintenance tips, watering needs, and any indoor/outdoor considerations and completely in the language mentioned.
        """

        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=prompt
        )
        return JsonResponse({"guidance": response.text})
    return JsonResponse({"error": "POST required fields."}, status=400)

from django.shortcuts import render
import geocoder
import requests
import google.generativeai as genai
import json
from django.conf import settings
from datetime import datetime, timedelta
import joblib
import pandas as pd
from sklearn.pipeline import Pipeline
from django.http import JsonResponse
import os

# View to fetch current and forecast weather data based on user's IP location
@csrf_exempt
def current_weather(request):
    try:
        # Get user's approximate location using IP
        g = geocoder.ip('me')
        latlng = g.latlng if g.ok else [27.0238, 74.2179]
        
        # Fetch current weather data
        current_data = get_weather_data(latlng[0], latlng[1]) if latlng else None
        forecast_data = None
        
        # If forecast requested, fetch forecast data (up to 14 days)
        if request.method == 'POST' and 'days' in request.POST:
            days = min(int(request.POST.get('days')), 14)   
            forecast_data = get_weekly_weather(latlng[0], latlng[1], settings.OPENWEATHER_API_KEY, days)
        
        # Prepare context for response
        context = {
            'current': process_current_data(current_data) if current_data else None,
            'forecast': process_forecast_data(forecast_data) if forecast_data else None,
            'location': {
                'city': g.city if g.ok else "Hyderabad",
                'country': g.country if g.ok else "India",
                'latlng': latlng
            }
        }
        print(context)
        return JsonResponse({"context": context})
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return JsonResponse({'error': f"Failed to fetch weather data: {str(e)}"}, status=500)

# Helper to fetch current weather from OpenWeatherMap API
def get_weather_data(lat, lon):
    try:
        response = requests.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={
                'lat': lat,
                'lon': lon,
                'appid': settings.OPENWEATHER_API_KEY,
                'units': 'metric'
            },
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Weather API Error: {str(e)}")
        return None

# Helper to fetch forecast weather data for given days
def get_weekly_weather(lat, lon, api_key, days=7):
    try:
        response = requests.get(
            "https://api.openweathermap.org/data/2.5/forecast",
            params={
                'lat': lat,
                'lon': lon,
                'appid': api_key,
                'units': 'metric',
                'cnt': days*8   # 8 intervals per day (3-hourly)
            },
            timeout=15
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Forecast Error: {e}")
        return None

# Helper to process current weather data into readable format
def process_current_data(data):
    x={
        'temp': data['main']['temp'],
        'feels_like': data['main']['feels_like'],
        'description': data['weather'][0]['description'].capitalize(),
        'icon': data['weather'][0]['icon'],
        'humidity': data['main']['humidity'],
        'wind_speed': data['wind']['speed'],
        'pressure': data['main']['pressure'],
        'visibility': data.get('visibility', 10000) / 1000,  
        'clouds': data.get('clouds', {}).get('all', 0),
        'sunrise': datetime.fromtimestamp(data.get('sys', {}).get('sunrise', 0)).strftime('%H:%M') if data.get('sys') else "06:00",
        'sunset': datetime.fromtimestamp(data.get('sys', {}).get('sunset', 0)).strftime('%H:%M') if data.get('sys') else "18:00"
    }
    print("x",x)
    return x

# Helper to process forecast data into daily summaries
def process_forecast_data(data):
    daily_data = {}
    for item in data['list']:
        date = datetime.fromtimestamp(item['dt']).date()
        if date not in daily_data:
            daily_data[date] = {
                'temps': [],
                'feels_like': [],
                'descriptions': [],
                'icons': [],
                'times': [],
                'humidity': [],
                'wind_speed': [],
                'pressure': [],
                'rain': [],
                'clouds': [],
                'sunrise': None,
                'sunset': None
            }
        
        # Aggregate weather metrics for each day
        daily_data[date]['temps'].append(item['main']['temp'])
        daily_data[date]['feels_like'].append(item['main']['feels_like'])
        daily_data[date]['descriptions'].append(item['weather'][0]['description'])
        daily_data[date]['icons'].append(item['weather'][0]['icon'])
        daily_data[date]['times'].append(datetime.fromtimestamp(item['dt']).strftime('%H:%M'))
        daily_data[date]['humidity'].append(item['main']['humidity'])
        daily_data[date]['wind_speed'].append(item['wind']['speed'])
        daily_data[date]['pressure'].append(item['main']['pressure'])
        daily_data[date]['rain'].append(item.get('rain', {}).get('3h', 0))
        daily_data[date]['clouds'].append(item.get('clouds', {}).get('all', 0))
        
        # Set sunrise/sunset if available
        if 'city' in data and 'sunrise' in data['city']:
            daily_data[date]['sunrise'] = datetime.fromtimestamp(data['city']['sunrise']).strftime('%H:%M')
            daily_data[date]['sunset'] = datetime.fromtimestamp(data['city']['sunset']).strftime('%H:%M')
    
    processed = []
    for date, values in daily_data.items():
        # Summarize daily weather
        processed.append({
            'date': date,
            'max_temp': max(values['temps']),
            'min_temp': min(values['temps']),
            'avg_temp': sum(values['temps'])/len(values['temps']),
            'feels_like': sum(values['feels_like'])/len(values['feels_like']),
            'description': max(set(values['descriptions']), key=values['descriptions'].count),
            'icon': max(set(values['icons']), key=values['icons'].count),
            'times': values['times'],
            'humidity': round(sum(values['humidity'])/len(values['humidity'])),
            'wind_speed': round(sum(values['wind_speed'])/len(values['wind_speed']), 1),
            'pressure': round(sum(values['pressure'])/len(values['pressure'])),
            'rain': round(sum(values['rain']), 1),
            'clouds': round(sum(values['clouds'])/len(values['clouds'])),
            'sunrise': values['sunrise'] or "06:00",  
            'sunset': values['sunset'] or "18:00",   
            'visibility': 10  
        })
    print("processed",processed)
    return processed

# View to provide crop rotation recommendations based on previous crop and weather forecast
@csrf_exempt
def crop_rotation(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            previous_crop = data.get('previous_crop', '')
            language = data.get('language', 'english')
            days = 90
            g = geocoder.ip('me')
            latlng = g.latlng if g.ok else [17.384, 78.4564]
            location = g.city if g.ok else "Hyderabad"
            # Fetch 90-day weather forecast
            forecast_data = get_weekly_weather(latlng[0], latlng[1], settings.OPENWEATHER_API_KEY, days)
            # Generate recommendations using Gemini
            recommendations = generate_crop_recommendations(
                previous_crop,
                forecast_data,
                f"{location}, India",
                language
            )
            return JsonResponse({'recommendations': recommendations})
        except Exception as e:
            return JsonResponse({'error': f"Failed to generate crop recommendations: {str(e)}"}, status=500)
    return JsonResponse({'error': 'POST required.'}, status=400)

# Helper to generate crop rotation recommendations using Gemini API
def generate_crop_recommendations(previous_crop, forecast_data, location, language):
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        prompt = f"""Act as a {language} expert agricultural advisor. Analyze this farming scenario in {language}:
        
        Previous Crop: {previous_crop}
        Location: {location}
        Upcoming Weather Forecast:
        {json.dumps(forecast_data, indent=2)}
        
        for important words or points. use <b></b> to encode instead of ** **
        Provide detailed crop rotation recommendations...""" 
        
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        
        return response.text.replace('\n', '<br>')
        
    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        return f"Could not generate recommendations. Please try again later.\n{str(e)}"
    
# View to predict crop yield using a trained ML model and Gemini for explanation
@csrf_exempt
def yield_predictor(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            # Prepare input dataframe for ML model
            input_df = pd.DataFrame([{
                'Crop': data.get('Crop'),
                'Crop_Year': int(data.get('Crop_Year', datetime.now().year)),
                'Season': data.get('Season'),
                'State': data.get('State'),
                'Area': float(data.get('Area', 0)),
                'Production': float(data.get('Production', 0)),
                'Annual_Rainfall': float(data.get('Annual_Rainfall', 0)),
                'Fertilizer': float(data.get('Fertilizer', 0)),
                'Pesticide': float(data.get('Pesticide', 0))
            }])

            # Load ML model and preprocessor
            base_path = os.path.join(settings.BASE_DIR, 'crop')
            model = joblib.load(os.path.join(base_path, 'crop_yield_model.joblib'))
            preprocessor = joblib.load(os.path.join(base_path, 'preprocessor.joblib'))

            # Transform input and predict yield
            input_processed = preprocessor.transform(input_df)
            predicted_yield = float(model.predict(input_processed)[0])

            # Use Gemini to generate a user-friendly explanation
            genai.configure(api_key=settings.GEMINI_API_KEY)
            gemini_model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = (
                f"Generate a Nice, comprehensive answer that the predicted yield is {round(abs(predicted_yield), 2)} "
                f"<i>quintals per hectare for the crop {data.get('Crop')} in the year {data.get('Crop_Year')}.Dont give any extra information!!\n"
            )
            response = gemini_model.generate_content(prompt)

            return JsonResponse({
                'success': True,
                'predicted_yield': round(abs(predicted_yield), 2),
                'response_text': response.text,
                'input_data': data
            })

        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=400)

    return JsonResponse({'success': False, 'error': 'POST required.'}, status=400)

# View to generate agriculture news summary and reputable sources using Gemini
@csrf_exempt
def agri_news(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            query = data.get('news_query', 'latest agriculture news')
            language = data.get('language', 'english')

            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")

            # Prompt for news summary
            prompt = f"""
You are an {language} expert agriculture news summarizer.

Provide a well-structured HTML-formatted report on: <b>{query}</b>

The response should include the following sections:

<h3>🔹 Summary of Recent Yields</h3>
<ul>
  <li>Use concise bullet points (in <li> tags)</li>
  <li>Ensure each point is meaningful and specific</li>
</ul>

<h3>🔹 Key Trends and Analysis</h3>
<ul>
  <li>Highlight patterns, data shifts, or emerging stories</li>
</ul>



<h3>🔹 Potential Impact on Farmers</h3>
<p>Write 2–3 sentences on how this news may affect farmers (economically, operationally, etc.)</p>
 
Note: don't include any disclaimers or unnecessary information. like html
"""
            response = model.generate_content(prompt)
            news_summary = response.text.replace('•', '<br>•')
            
            # Prompt for reputable news sources
            prompt = f"""
You are an {language} expert agriculture news summarizer.

Give working actual online links for : <b>{query}</b>

The response should include Only:  <h3>🔹 Reputable News Sources</h3>
<ul>
  <li>List 3–5 real news links with proper <a href="URL">anchor text</a></li>
</ul>
 
Note: don't include any disclaimers or unnecessary information. like html
"""
            
            reputable_sources = model.generate_content(prompt)

            return JsonResponse({
                'success': True,
                'news_summary': news_summary,
                'reputable_sources': reputable_sources.text
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': f"⚠️ Failed to generate news: {str(e)}"}, status=500)
    return JsonResponse({'success': False, 'error': 'POST required.'}, status=400)