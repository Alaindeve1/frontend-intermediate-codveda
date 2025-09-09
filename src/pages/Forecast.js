// src/pages/Forecast.js
import React, { useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { weatherService } from '../services/weatherAPI';
import { getDailyForecast } from '../utils/helpers';
import SearchBar from '../components/Weather/SearchBar';
import { ForecastList } from '../components/Weather/ForecastCard';
import WeatherCard from '../components/Weather/WeatherCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

const Forecast = () => {
  const { state, actions } = useWeather();

  // Function to fetch forecast by city
  const fetchForecastByCity = async (city) => {
    actions.setLoading(true);
    actions.clearError();

    try {
      let forecastData, currentWeather;
      
      if (city.lat && city.lon) {
        // If coordinates are provided
        [forecastData, currentWeather] = await Promise.all([
          weatherService.getForecastByCoords(city.lat, city.lon, state.temperatureUnit),
          weatherService.getCurrentWeatherByCoords(city.lat, city.lon, state.temperatureUnit)
        ]);
      } else {
        // If only city name is provided
        [forecastData, currentWeather] = await Promise.all([
          weatherService.getForecast(city.name, state.temperatureUnit),
          weatherService.getCurrentWeather(city.name, state.temperatureUnit)
        ]);
      }

      // Process forecast data to get daily forecasts
      const dailyForecast = getDailyForecast(forecastData);
      
      actions.setForecast(dailyForecast);
      actions.setCurrentWeather(currentWeather);
    } catch (error) {
      actions.setError(error.message);
    }
  };

  // Function to get user's location forecast
  const getCurrentLocationForecast = async () => {
    actions.setLoading(true);
    actions.clearError();

    try {
      const weather = await weatherService.getUserLocationWeather(state.temperatureUnit);
      
      // Get forecast for the same location
      const forecastData = await weatherService.getForecastByCoords(
        weather.coord.lat, 
        weather.coord.lon, 
        state.temperatureUnit
      );
      
      const dailyForecast = getDailyForecast(forecastData);
      
      actions.setCurrentWeather(weather);
      actions.setForecast(dailyForecast);
    } catch (error) {
      actions.setError(error.message);
    }
  };

  // Load forecast data on mount
  useEffect(() => {
    if (state.currentWeather && state.currentWeather.coord) {
      // If we already have current weather, fetch forecast for the same location
      fetchForecastByCity({
        lat: state.currentWeather.coord.lat,
        lon: state.currentWeather.coord.lon
      });
    } else {
      // Try to get user location first, fallback to default city
      getCurrentLocationForecast().catch(() => {
        fetchForecastByCity({ name: 'London' });
      });
    }
  }, []);

  // Refetch forecast when temperature unit changes
  useEffect(() => {
    if (state.currentWeather && state.currentWeather.coord) {
      fetchForecastByCity({
        lat: state.currentWeather.coord.lat,
        lon: state.currentWeather.coord.lon
      });
    }
  }, [state.temperatureUnit]);

  // Retry function
  const handleRetry = () => {
    if (state.currentWeather && state.currentWeather.coord) {
      fetchForecastByCity({
        lat: state.currentWeather.coord.lat,
        lon: state.currentWeather.coord.lon
      });
    } else {
      getCurrentLocationForecast().catch(() => {
        fetchForecastByCity({ name: 'London' });
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            5-Day Weather Forecast
          </h2>
          <SearchBar onCitySelect={fetchForecastByCity} />
        </div>

        {/* Content Section */}
        <div className="space-y-8">
          {state.loading && (
            <LoadingSpinner 
              size="large" 
              message="Loading forecast data..." 
            />
          )}

          {state.error && !state.loading && (
            <ErrorMessage 
              error={state.error} 
              onRetry={handleRetry}
            />
          )}

          {!state.loading && !state.error && (
            <>
              {/* Current Weather Summary */}
              {state.currentWeather && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Current Weather</h3>
                  <WeatherCard 
                    weather={state.currentWeather} 
                    showDetails={false}
                  />
                </div>
              )}

              {/* Forecast */}
              {state.forecast && state.forecast.length > 0 ? (
                <ForecastList forecastData={state.forecast} />
              ) : !state.loading && (
                <div className="text-center text-white py-8">
                  <div className="text-4xl mb-4">📅</div>
                  <h3 className="text-xl font-semibold mb-2">No Forecast Data</h3>
                  <p className="text-blue-100 mb-4">Search for a city to see the 5-day forecast</p>
                </div>
              )}

              {/* Quick Actions */}
              {(state.currentWeather || state.forecast.length > 0) && (
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={getCurrentLocationForecast}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                  >
                    📍 My Location Forecast
                  </button>
                  
                  <button
                    onClick={() => fetchForecastByCity({ name: 'Paris' })}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                  >
                    🇫🇷 Paris
                  </button>
                  
                  <button
                    onClick={() => fetchForecastByCity({ name: 'Sydney' })}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                  >
                    🇦🇺 Sydney
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forecast;