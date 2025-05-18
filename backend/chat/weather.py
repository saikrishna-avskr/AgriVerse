import requests

def get_current_weather(city="New Delhi"):
    API_KEY = "b58882e56137707ffa9e46f81614302a"
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    res = requests.get(url).json()
    desc = res["weather"][0]["description"]
    temp = res["main"]["temp"]
    return f"{desc.capitalize()}, {temp}°C"
