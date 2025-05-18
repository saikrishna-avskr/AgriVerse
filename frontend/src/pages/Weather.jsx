import React, { useEffect, useState } from "react";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState({ city: "", country: "" });
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);

  // Fetch current weather and forecast
  const fetchWeather = async (forecastDays = 7) => {
    setLoading(true);
    let url = "http://127.0.0.1:8000/api/current-weather/";
    let options = {};
    // For forecast, POST with days
    if (forecastDays !== 7) {
      options = {
        method: "POST",
        headers: {},
        body: new URLSearchParams({ days: forecastDays }),
      };
    }
    const res = await fetch(url, options);
    const data = await res.json();
    const ctx = data.context || data; // fallback if backend changes
    setWeather(ctx.current);
    setForecast(ctx.forecast || []);
    setLocation(ctx.location || {});
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line
  }, []);

  const handleForecastSubmit = (e) => {
    e.preventDefault();
    fetchWeather(days);
  };

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-2xl shadow-lg">
      <div className="mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">
            Current Weather in {location.city}, {location.country}
          </h1>
          {weather?.icon && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              className="w-24 h-24"
            />
          )}
        </div>
        {weather ? (
          <>
            <div className="mt-4">
              <h2 className="text-4xl font-semibold">{weather.temp}°C</h2>
              <p className="text-lg">Feels like {weather.feels_like}°C</p>
              <p className="capitalize">{weather.description}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-emerald-50 rounded-lg p-4 shadow">
                <h4 className="text-sm text-gray-600 mb-1">Humidity</h4>
                <p className="text-lg font-semibold">{weather.humidity}%</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 shadow">
                <h4 className="text-sm text-gray-600 mb-1">Wind Speed</h4>
                <p className="text-lg font-semibold">
                  {weather.wind_speed} m/s
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 shadow">
                <h4 className="text-sm text-gray-600 mb-1">Pressure</h4>
                <p className="text-lg font-semibold">{weather.pressure} hPa</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4 shadow">
                <h4 className="text-sm text-gray-600 mb-1">Visibility</h4>
                <p className="text-lg font-semibold">
                  {weather.visibility ? weather.visibility.toFixed(1) : "N/A"}{" "}
                  km
                </p>
              </div>
            </div>
          </>
        ) : (
          <p className="mt-4 text-red-600">
            Could not load current weather data.
          </p>
        )}
      </div>

      {/* Forecast Section */}
      <div className="mt-10">
        <div className="bg-emerald-50 rounded-lg p-6 mb-8 shadow-inner">
          <h2 className="text-xl font-bold mb-2">Get Weather Forecast</h2>
          <form
            className="flex flex-wrap items-center gap-4"
            onSubmit={handleForecastSubmit}
          >
            <label htmlFor="days" className="font-medium">
              Enter number of days (1–14):
            </label>
            <input
              type="number"
              id="days"
              name="days"
              min="1"
              max="14"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              required
              className="border rounded px-3 py-1 w-20"
            />
            <button
              type="submit"
              className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? "Loading..." : "Get Forecast"}
            </button>
          </form>
        </div>

        {forecast && forecast.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-emerald-700 mb-4">
              {forecast.length}-Day Forecast
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {forecast.map((day, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-b from-gray-50 to-emerald-50 border rounded-xl p-6 shadow hover:-translate-y-1 transition"
                >
                  <div className="flex items-center justify-between border-b pb-2 mb-2">
                    <h3 className="font-semibold text-lg">
                      {typeof day.date === "string"
                        ? new Date(day.date).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })
                        : day.date}
                    </h3>
                    <img
                      src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                      alt={day.description}
                      className="w-12 h-12"
                    />
                  </div>
                  <p className="italic text-gray-600 mb-2">{day.description}</p>
                  <div className="flex justify-between bg-gray-100 rounded px-3 py-2 mb-2">
                    <span className="text-red-600 font-bold">
                      {day.max_temp}°
                    </span>
                    <span className="text-blue-600 font-bold">
                      {day.min_temp}°
                    </span>
                  </div>
                  <div className="text-center text-gray-700 text-sm mb-2">
                    Avg: {day.avg_temp?.toFixed(1)}°C
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Wind</span>
                      <span>{day.wind_speed ?? "N/A"} m/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Humidity</span>
                      <span>{day.humidity ?? "N/A"}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Pressure</span>
                      <span>{day.pressure ?? "N/A"} hPa</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Rain</span>
                      <span>{day.rain ?? "0"} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sunrise</span>
                      <span>{day.sunrise ?? "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sunset</span>
                      <span>{day.sunset ?? "N/A"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
