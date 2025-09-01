// src/components/Layout/Header.js
import React from 'react';
import { useWeather } from '../../context/WeatherContext';

const Header = () => {
  const { state, actions } = useWeather();

  return (
    <header className="bg-white bg-opacity-10 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-3xl">🌤️</div>
            <h1 className="text-2xl font-bold text-white">WeatherDash</h1>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Temperature Unit Toggle */}
            <button
              onClick={actions.toggleTemperatureUnit}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-lg transition-all duration-200 font-medium"
            >
              {state.temperatureUnit === 'metric' ? '°C' : '°F'}
            </button>

            {/* Current Location Button */}
            <button
              onClick={() => {
                // This will be implemented in the pages
                if (window.getCurrentLocation) {
                  window.getCurrentLocation();
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
              title="Get current location weather"
            >
              📍 Location
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;