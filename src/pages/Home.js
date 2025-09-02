// src/pages/Home.js
import React, { useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { weatherService } from '../services/weatherAPI';
import SearchBar from '../components/Weather/SearchBar';
import WeatherCard from '../components/Weather/WeatherCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

const Home = () => {
  const { state, actions } = useWeather();

  // Function to fetch weather by city
  const fetchWeatherByCity = async (city) => {
    actions.setLoading(true);
    actions.clearError();

    try {
      let weather;
      if (city.lat && city.lon) {
        // If coordinates are provided (from search suggestions)
        weather = await weatherService.getCurrentWeatherByCoords(
          city.lat, 
          city.lon, 
          state.temperatureUnit
        );
      } else {
        // If only city name is provided
        weather = await weatherService.getCurrentWeather(
          city.name, 
          state.temperatureUnit
        );
      }
      actions.setCurrentWeather(weather);
    } catch (error) {
      actions.setError(error.message);
    }
  };

  // Function to get user's location weather
  const getCurrentLocationWeather = async () => {
    actions.setLoading(true);
    actions.clearError();

    try {
      const weather = await weatherService.getUserLocationWeather(state.temperatureUnit);
      actions.setCurrentWeather(weather);
    } catch (error) {
      actions.setError(error.message);
    }
  };

  // Make getCurrentLocationWeather available globally for header button
  useEffect(() => {
    window.getCurrentLocation = getCurrentLocationWeather;
    return () => {
      delete window.getCurrentLocation;
    };
  }, [state.temperatureUnit]);

  // Load default city weather on mount
  useEffect(() => {
    if (!state.currentWeather) {
      // Try to get user location first, fallback to default city
      getCurrentLocationWeather().catch(() => {
        fetchWeatherByCity({ name: 'London' });
      });
    }
  }, []);

  // Refetch weather when temperature unit changes
  useEffect(() => {
    if (state.currentWeather) {
      fetchWeatherByCity({
        lat: state.currentWeather.coord.lat,
        lon: state.currentWeather.coord.lon
      });
    }
  }, [state.temperatureUnit]);

  // Retry function for error cases
  const handleRetry = () => {
    if (state.currentWeather) {
      fetchWeatherByCity({
        lat: state.currentWeather.coord.lat,
        lon: state.currentWeather.coord.lon
      });
    } else {
      getCurrentLocationWeather().catch(() => {
        fetchWeatherByCity({ name: 'London' });
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Current Weather
          </h2>
          <SearchBar onCitySelect={fetchWeatherByCity} />
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          {state.loading && (
            <LoadingSpinner 
              size="large" 
              message="Getting weather data..." 
            />
          )}

          {state.error && !state.loading && (
            <ErrorMessage 
              error={state.error} 
              onRetry={handleRetry}
            />
          )}

          {state.currentWeather && !state.loading && !state.error && (
            <div className="space-y-6">
              <WeatherCard 
                weather={state.currentWeather} 
                showDetails={true}
              />

              {/* Quick Actions */}
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={getCurrentLocationWeather}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  📍 Use My Location
                </button>
                
                <button
                  onClick={() => fetchWeatherByCity({ name: 'NewYork' })}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  🏙️ New York
                </button>
                
                <button
                  onClick={() => fetchWeatherByCity({ name: 'London' })}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  🇬🇧 London
                </button>
                
                <button
                  onClick={() => fetchWeatherByCity({ name: 'Tokyo' })}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  🗾 Tokyo
                </button>
              </div>
            </div>
          )}

          {/* Welcome message when no data */}
          {!state.currentWeather && !state.loading && !state.error && (
            <div className="text-center text-white py-12">
              <div className="text-6xl mb-4">🌤️</div>
              <h3 className="text-2xl font-semibold mb-2">Welcome to WeatherDash</h3>
              <p className="text-blue-100 mb-6">Search for a city to see current weather conditions</p>
              <button
                onClick={getCurrentLocationWeather}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors duration-200 font-medium"
              >
                Get Weather for My Location
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;