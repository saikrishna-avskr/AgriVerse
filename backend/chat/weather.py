import requests

def get_current_weather(city="New Delhi"):
    """
    Fetches the current weather for a given city using the OpenWeatherMap API.

    Args:
        city (str): Name of the city to fetch weather for. Defaults to "New Delhi".

    Returns:
        str: Weather description and temperature in Celsius, formatted as a string.
    """
    API_KEY = "b58882e56137707ffa9e46f81614302a"  # OpenWeatherMap API key
    # Construct the API endpoint with city, API key, and units in metric (Celsius)
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    res = requests.get(url).json()  # Send GET request and parse response as JSON

    # Extract weather description and temperature from the response
    desc = res["weather"][0]["description"]
    temp = res["main"]["temp"]

    # Return formatted weather information
    return f"{desc.capitalize()}, {temp}°C"
