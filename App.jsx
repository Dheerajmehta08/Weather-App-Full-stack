import React, { useState } from "react";

/**
 * Uses OpenWeatherMap current weather API.
 * Add your API key as VITE_WEATHER_KEY in .env (root of project).
 *
 * Example request:
 * https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=YOUR_KEY
 */

const App = () => {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);

  const apiKey = import.meta.env.VITE_WEATHER_KEY || "";

  async function fetchWeather(e) {
    e?.preventDefault();
    if (!city.trim()) return setError("Please type a city name.");
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&units=metric&appid=${apiKey}`
      );
      if (!res.ok) {
        if (res.status === 404) throw new Error("City not found");
        throw new Error("Failed to fetch weather");
      }
      const data = await res.json();
      // Normalize useful fields
      setWeather({
        name: data.name,
        country: data.sys?.country,
        temp: Math.round(data.main?.temp),
        feels_like: Math.round(data.main?.feels_like),
        humidity: data.main?.humidity,
        wind: data.wind?.speed,
        description: data.weather?.[0]?.description,
        icon: data.weather?.[0]?.icon,
      });
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <header className="card-header">
          <h1 className="title">Weatherly</h1>
          <p className="subtitle">Fast, simple weather lookup</p>
        </header>

        <form className="search" onSubmit={fetchWeather}>
          <input
            className="search-input"
            placeholder="Enter city (e.g. Mumbai)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="City"
          />
          <button className="search-btn" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {weather ? (
          <div className="weather-card">
            <div className="weather-main">
              <div className="weather-left">
                <img
                  className="weather-icon"
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                />
                <div>
                  <div className="temp">{weather.temp}°C</div>
                  <div className="desc">{weather.description}</div>
                </div>
              </div>

              <div className="weather-right">
                <div className="place">
                  {weather.name}, {weather.country}
                </div>
                <div className="small">
                  Feels like: {weather.feels_like}°C
                </div>
                <div className="small">Humidity: {weather.humidity}%</div>
                <div className="small">Wind: {weather.wind} m/s</div>
              </div>
            </div>

            <div className="controls">
              <button
                className="clear-btn"
                onClick={() => {
                  setWeather(null);
                  setCity("");
                  setError("");
                }}
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          <div className="placeholder">
            <p>Type a city and press Search to see current weather.</p>
          </div>
        )}

        <footer className="card-footer">Data from OpenWeatherMap</footer>
      </div>
    </div>
  );
};

export default App;
