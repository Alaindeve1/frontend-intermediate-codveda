// src/utils/helpers.js

// Format temperature with unit
export const formatTemperature = (temp, unit) => {
    const roundedTemp = Math.round(temp);
    const symbol = unit === 'metric' ? '°C' : '°F';
    return `${roundedTemp}${symbol}`;
  };
  
  // Format date
  export const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format time
  export const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get weather icon URL
  export const getWeatherIcon = (iconCode, size = '2x') => {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
  };
  
  // Get weather description
  export const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  };
  
  // Convert wind direction
  export const getWindDirection = (deg) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
  };
  
  // Format wind speed
  export const formatWindSpeed = (speed, unit) => {
    const speedUnit = unit === 'metric' ? 'm/s' : 'mph';
    return `${Math.round(speed)} ${speedUnit}`;
  };
  
  // Get weather condition background color
  export const getWeatherBackground = (condition) => {
    const weatherBgs = {
      clear: 'from-yellow-400 to-orange-500',
      clouds: 'from-gray-400 to-gray-600',
      rain: 'from-blue-500 to-blue-700',
      snow: 'from-blue-200 to-white',
      thunderstorm: 'from-purple-600 to-gray-800',
      drizzle: 'from-blue-300 to-blue-500',
      mist: 'from-gray-300 to-gray-500',
      fog: 'from-gray-300 to-gray-500'
    };
    
    const main = condition.toLowerCase();
    return weatherBgs[main] || 'from-blue-400 to-blue-600';
  };
  
  // Debounce function for search
  export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  // Filter forecast data to get daily forecasts
  export const getDailyForecast = (forecastData) => {
    const daily = {};
    
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!daily[date]) {
        daily[date] = {
          date: item.dt,
          temp: {
            min: item.main.temp_min,
            max: item.main.temp_max
          },
          weather: item.weather[0],
          humidity: item.main.humidity,
          windSpeed: item.wind.speed
        };
      } else {
        // Update min/max temperatures
        daily[date].temp.min = Math.min(daily[date].temp.min, item.main.temp_min);
        daily[date].temp.max = Math.max(daily[date].temp.max, item.main.temp_max);
      }
    });
    
    return Object.values(daily).slice(0, 5); // Return 5 days
  };
  
  // Check if it's day or night
  export const isDayTime = (sunrise, sunset, current) => {
    return current >= sunrise && current <= sunset;
  };
  
  // Format humidity percentage
  export const formatHumidity = (humidity) => {
    return `${humidity}%`;
  };
  
  // Format pressure
  export const formatPressure = (pressure) => {
    return `${pressure} hPa`;
  };
  
  // Format visibility
  export const formatVisibility = (visibility, unit) => {
    if (unit === 'metric') {
      return `${(visibility / 1000).toFixed(1)} km`;
    } else {
      return `${(visibility * 0.000621371).toFixed(1)} mi`;
    }
  };