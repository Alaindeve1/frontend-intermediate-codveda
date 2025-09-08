// src/components/Weather/WeatherCard.js
import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { 
  formatTemperature, 
  getWeatherIcon, 
  capitalizeWords,
  formatWindSpeed,
  getWindDirection,
  formatHumidity,
  formatPressure,
  formatTime
} from '../../utils/helpers';

const WeatherCard = ({ weather, showDetails = true }) => {
  const { state, actions } = useWeather();

  if (!weather) return null;

  const isFav = actions.isFavorite(weather.name);

  const toggleFavorite = () => {
    if (isFav) {
      const favToRemove = state.favorites.find(fav => 
        fav.name.toLowerCase() === weather.name.toLowerCase()
      );
      if (favToRemove) {
        actions.removeFromFavorites(favToRemove.id);
      }
    } else {
      actions.addToFavorites(weather);
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white border-opacity-20">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {weather.name}
          </h2>
          <p className="text-blue-100">
            {weather.sys?.country} • {formatTime(weather.dt)}
          </p>
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className={`p-2 rounded-full transition-all duration-200 ${
            isFav 
              ? 'text-yellow-400 hover:text-yellow-300' 
              : 'text-white hover:text-yellow-400'
          }`}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg className="w-6 h-6" fill={isFav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      </div>

      {/* Main Weather Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={getWeatherIcon(weather.weather?.[0]?.icon || '01d', '4x')}
            alt={weather.weather?.[0]?.description || 'Weather icon'}
            className="w-20 h-20"
          />
          <div>
            <div className="text-4xl font-bold text-white mb-1">
              {formatTemperature(weather.main.temp, state.temperatureUnit)}
            </div>
            <p className="text-blue-100">
              {capitalizeWords(weather.weather?.[0]?.description || 'N/A')}
            </p>
          </div>
        </div>

        {/* Feels like temperature */}
        <div className="text-right">
          <p className="text-blue-100 text-sm">Feels like</p>
          <p className="text-xl font-semibold text-white">
            {formatTemperature(weather.main.feels_like, state.temperatureUnit)}
          </p>
        </div>
      </div>

      {/* Weather Details */}
      {showDetails && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Humidity */}
          <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">💧</div>
            <p className="text-white font-semibold">{formatHumidity(weather.main.humidity)}</p>
            <p className="text-blue-100 text-sm">Humidity</p>
          </div>

          {/* Wind */}
          <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">💨</div>
            <p className="text-white font-semibold">
              {formatWindSpeed(weather.wind?.speed || 0, state.temperatureUnit)}
            </p>
            <p className="text-blue-100 text-sm">
              {weather.wind?.deg ? getWindDirection(weather.wind.deg) : 'Wind'}
            </p>
          </div>

          {/* Pressure */}
          <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">⏲️</div>
            <p className="text-white font-semibold">{formatPressure(weather.main.pressure)}</p>
            <p className="text-blue-100 text-sm">Pressure</p>
          </div>

          {/* Visibility */}
          <div className="bg-white bg-opacity-10 rounded-lg p-3 text-center">
            <div className="text-2xl mb-1">👁️</div>
            <p className="text-white font-semibold">
              {weather.visibility ? `${(weather.visibility / 1000).toFixed(1)} km` : 'N/A'}
            </p>
            <p className="text-blue-100 text-sm">Visibility</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;