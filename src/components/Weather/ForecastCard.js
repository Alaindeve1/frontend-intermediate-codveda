// src/components/Weather/ForecastCard.js
import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { 
  formatTemperature, 
  formatDate, 
  getWeatherIcon, 
  capitalizeWords,
  formatHumidity
} from '../../utils/helpers';

const ForecastCard = ({ forecast, isToday = false }) => {
  const { state } = useWeather();

  if (!forecast) return null;

  return (
    <div className={`bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-200 ${
      isToday ? 'ring-2 ring-yellow-400' : ''
    }`}>
      {/* Date */}
      <div className="text-center mb-3">
        <p className="text-white font-semibold">
          {isToday ? 'Today' : formatDate(forecast.date)}
        </p>
      </div>

      {/* Weather Icon */}
      <div className="flex justify-center mb-3">
        <img
          src={getWeatherIcon(forecast.weather.icon, '2x')}
          alt={forecast.weather.description}
          className="w-12 h-12"
        />
      </div>

      {/* Temperatures */}
      <div className="text-center mb-3">
        <div className="flex justify-between items-center">
          <span className="text-white font-bold text-lg">
            {formatTemperature(forecast.temp.max, state.temperatureUnit)}
          </span>
          <span className="text-blue-200">
            {formatTemperature(forecast.temp.min, state.temperatureUnit)}
          </span>
        </div>
      </div>

      {/* Weather Description */}
      <p className="text-blue-100 text-sm text-center mb-2">
        {capitalizeWords(forecast.weather.description)}
      </p>

      {/* Additional Info */}
      <div className="text-xs text-blue-200 text-center space-y-1">
        <div className="flex justify-between">
          <span>💧 {formatHumidity(forecast.humidity)}</span>
          <span>💨 {Math.round(forecast.windSpeed)} m/s</span>
        </div>
      </div>
    </div>
  );
};

// Horizontal forecast list component
export const ForecastList = ({ forecastData }) => {
  const { state } = useWeather();

  if (!forecastData || !forecastData.length) {
    return (
      <div className="text-center text-white py-8">
        <p>No forecast data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white mb-4">5-Day Forecast</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {forecastData.map((forecast, index) => (
          <ForecastCard 
            key={index}
            forecast={forecast}
            isToday={index === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default ForecastCard;