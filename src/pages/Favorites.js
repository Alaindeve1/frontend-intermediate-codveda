// src/pages/Favorites.js
import React, { useState, useEffect, useCallback } from 'react';
import { useWeather } from '../context/WeatherContext';
import { weatherService } from '../services/weatherAPI';
import SearchBar from '../components/Weather/SearchBar';
import WeatherCard from '../components/Weather/WeatherCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

const Favorites = () => {
  const { state, actions } = useWeather();
  const [favoriteWeatherData, setFavoriteWeatherData] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [favoriteErrors, setFavoriteErrors] = useState({});

  // Function to add city to favorites
  const addCityToFavorites = useCallback(async (city) => {
    try {
      let weather;
      if (city.lat && city.lon) {
        weather = await weatherService.getCurrentWeatherByCoords(
          city.lat, 
          city.lon, 
          state.temperatureUnit
        );
      } else {
        weather = await weatherService.getCurrentWeather(
          city.name, 
          state.temperatureUnit
        );
      }
      
      actions.addToFavorites(weather);
      
      // Add to local weather data
      setFavoriteWeatherData(prev => [...prev, weather]);
    } catch (error) {
      actions.setError(`Failed to add ${city.name} to favorites: ${error.message}`);
    }
  }, [actions, state.temperatureUnit]);

  // Function to fetch weather for all favorite cities
  const fetchFavoritesWeather = useCallback(async () => {
    if (state.favorites.length === 0) return;

    setLoadingFavorites(true);
    setFavoriteErrors({});
    
    const weatherPromises = state.favorites.map(async (favorite) => {
      try {
        const weather = await weatherService.getCurrentWeatherByCoords(
          favorite.lat,
          favorite.lon,
          state.temperatureUnit
        );
        return { id: favorite.id, weather, error: null };
      } catch (error) {
        return { 
          id: favorite.id, 
          weather: null, 
          error: error.message
        };
      }
    });

    try {
      const results = await Promise.allSettled(weatherPromises);
      const weatherData = [];
      const errors = {};

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          const { id, weather, error, favorite } = result.value;
          if (weather) {
            weatherData.push(weather);
          } else if (error) {
            errors[id] = error;
          }
        }
      });

      setFavoriteWeatherData(weatherData);
      setFavoriteErrors(errors);
    } catch (error) {
      console.error('Error fetching favorites weather:', error);
    } finally {
      setLoadingFavorites(false);
    }
  }, [state.favorites, state.temperatureUnit]);

  // Load favorites weather on mount and when favorites change
  useEffect(() => {
    fetchFavoritesWeather();
  }, [fetchFavoritesWeather]);

  // Function to remove favorite with confirmation
  const handleRemoveFavorite = (cityId, cityName) => {
    if (window.confirm(`Remove ${cityName} from favorites?`)) {
      actions.removeFromFavorites(cityId);
      setFavoriteWeatherData(prev => 
        prev.filter(weather => 
          !state.favorites.some(fav => fav.name === weather.name)
        )
      );
    }
  };

  // Clear all favorites
  const clearAllFavorites = () => {
    if (window.confirm('Remove all cities from favorites?')) {
      state.favorites.forEach(favorite => {
        actions.removeFromFavorites(favorite.id);
      });
      setFavoriteWeatherData([]);
      setFavoriteErrors({});
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Favorite Cities
          </h2>
          <SearchBar onCitySelect={addCityToFavorites} />
        </div>

        {/* Favorites Counter and Actions */}
        {state.favorites.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-blue-100">
              {state.favorites.length} favorite cit{state.favorites.length === 1 ? 'y' : 'ies'}
            </p>
            <div className="space-x-2">
              <button
                onClick={fetchFavoritesWeather}
                disabled={loadingFavorites}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                {loadingFavorites ? '⏳' : '🔄'} Refresh
              </button>
              <button
                onClick={clearAllFavorites}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                🗑️ Clear All
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loadingFavorites && (
          <LoadingSpinner 
            size="large" 
            message="Loading favorite cities..." 
          />
        )}

        {/* Content Section */}
        <div className="space-y-6">
          {/* No favorites message */}
          {state.favorites.length === 0 && !loadingFavorites && (
            <div className="text-center text-white py-12">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-2xl font-semibold mb-2">No Favorite Cities Yet</h3>
              <p className="text-blue-100 mb-6">
                Search for cities above and add them to your favorites to see their weather at a glance
              </p>
              <div className="space-y-2 text-blue-200">
                <p>💡 Pro tip: Click the star icon on any weather card to save it!</p>
              </div>
            </div>
          )}

          {/* Favorites Grid */}
          {!loadingFavorites && favoriteWeatherData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {favoriteWeatherData.map((weather) => (
                <div key={weather.id} className="relative">
                  <WeatherCard 
                    weather={weather} 
                    showDetails={true}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Error states for individual favorites */}
          {Object.keys(favoriteErrors).length > 0 && !loadingFavorites && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Unable to load some favorites:</h3>
              {Object.entries(favoriteErrors).map(([id, error]) => {
                const favorite = state.favorites.find(fav => fav.id === parseInt(id));
                return (
                  <div key={id} className="bg-red-500 bg-opacity-20 backdrop-blur-sm rounded-lg p-4 border border-red-300">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-medium">{favorite?.name}</h4>
                        <p className="text-red-100 text-sm">{error}</p>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => {
                            const updatedErrors = { ...favoriteErrors };
                            delete updatedErrors[id];
                            setFavoriteErrors(updatedErrors);
                            fetchFavoritesWeather();
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Retry
                        </button>
                        <button
                          onClick={() => handleRemoveFavorite(parseInt(id), favorite?.name)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick add suggestions */}
          {state.favorites.length > 0 && state.favorites.length < 5 && !loadingFavorites && (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20">
              <h3 className="text-lg font-semibold text-white mb-4">Popular Cities to Add:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: 'New York', emoji: '🗽' },
                  { name: 'London', emoji: '🇬🇧' },
                  { name: 'Tokyo', emoji: '🗾' },
                  { name: 'Paris', emoji: '🗼' },
                  { name: 'Sydney', emoji: '🇦🇺' },
                  { name: 'Dubai', emoji: '🏙️' },
                  { name: 'Mumbai', emoji: '🇮🇳' },
                  { name: 'Moscow', emoji: '🇷🇺' }
                ].filter(city => !state.favorites.some(fav => 
                  fav.name.toLowerCase().includes(city.name.toLowerCase())
                )).slice(0, 4).map((city) => (
                  <button
                    key={city.name}
                    onClick={() => addCityToFavorites({ name: city.name })}
                    className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white p-3 rounded-lg transition-all duration-200 text-center"
                  >
                    <div className="text-2xl mb-1">{city.emoji}</div>
                    <div className="text-sm font-medium">{city.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Global error */}
          {state.error && (
            <ErrorMessage 
              error={state.error} 
              onRetry={() => {
                actions.clearError();
                fetchFavoritesWeather();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;