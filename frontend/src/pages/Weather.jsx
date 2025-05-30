import React, { useEffect, useState } from "react";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState({ city: "", country: "" });
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (forecastDays = 7) => {
    setLoading(true);
    let url = "http://127.0.0.1:8000/api/current-weather/";
    let options = {};
    if (forecastDays !== 7) {
      options = {
        method: "POST",
        headers: {},
        body: new URLSearchParams({ days: forecastDays }),
      };
    }
    const res = await fetch(url, options);
    const data = await res.json();
    const ctx = data.context || data;  
    setWeather(ctx.current);
    setForecast(ctx.forecast || []);
    setLocation(ctx.location || {});
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const handleForecastSubmit = (e) => {
    e.preventDefault();
    fetchWeather(days);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-emerald-200 py-10 px-4">
  <div className="max-w-5xl mx-auto backdrop-blur-sm bg-white/70 rounded-3xl shadow-2xl p-8 border border-emerald-200">
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-extrabold text-emerald-800">
          {location.city}, {location.country}
        </h1>
        {weather && (
          <p className="text-xl text-emerald-600 mt-1 capitalize">
            {weather.description}
          </p>
        )}
      </div>
      {weather?.icon && (
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
          alt={weather.description}
          className="w-28 h-28"
        />
      )}
    </div>

    {weather && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white bg-opacity-80 rounded-xl shadow-md p-6">
          <h2 className="text-4xl font-bold text-emerald-700 mb-2">
            {weather.temp}°C
          </h2>
          <p className="text-lg">Feels like {weather.feels_like}°C</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Humidity", value: `${weather.humidity}%` },
            { label: "Wind", value: `${weather.wind_speed} m/s` },
            { label: "Pressure", value: `${weather.pressure} hPa` },
            {
              label: "Visibility",
              value: `${weather.visibility?.toFixed(1) ?? "N/A"} km`,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-emerald-100 rounded-lg text-center p-4 border border-emerald-300"
            >
              <h4 className="text-sm font-semibold text-emerald-800">
                {item.label}
              </h4>
              <p className="text-xl font-bold text-emerald-700">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Forecast Section */}
    <div className="mb-8">
      <form
        className="flex flex-wrap items-center gap-4 mb-4"
        onSubmit={handleForecastSubmit}
      >
        <label htmlFor="days" className="font-medium text-emerald-800">
          Forecast days:
        </label>
        <input
          type="number"
          id="days"
          name="days"
          min="1"
          max="14"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="border border-emerald-300 rounded px-3 py-1 w-24 bg-white shadow-inner"
        />
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow transition"
        >
          {loading ? "Loading..." : "Get Forecast"}
        </button>
      </form>
    </div>

    {forecast && forecast.length > 0 && (
      <div>
        <h2 className="text-2xl font-bold text-emerald-700 mb-6">
          {forecast.length}-Day Forecast
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {forecast.map((day, idx) => (
            <div
              key={idx}
              className="bg-white bg-opacity-80 border border-emerald-200 rounded-xl p-6 shadow-lg hover:scale-[1.02] transition-transform"
            >
              <div className="flex justify-between items-center mb-2 border-b pb-2">
                <h3 className="font-semibold text-lg text-emerald-800">
                  {new Date(day.date).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                  alt={day.description}
                  className="w-10 h-10"
                />
              </div>
              <p className="italic text-sm text-gray-600 mb-3">
                {day.description}
              </p>
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-red-600">{day.max_temp}°</span>
                <span className="text-blue-600">{day.min_temp}°</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-700">
                <p>Wind: {day.wind_speed} m/s</p>
                <p>Humidity: {day.humidity}%</p>
                <p>Pressure: {day.pressure} hPa</p>
                <p>Rain: {day.rain ?? "0"} mm</p>
                <p>Sunrise: {day.sunrise}</p>
                <p>Sunset: {day.sunset}</p>
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
