// src/services/weatherAPI.js
import axios from 'axios';

// Read envs with safe fallbacks for production builds
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || '';
const BASE_URL = process.env.REACT_APP_WEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';

// Create axios instance
const weatherAPI = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY
  }
});

// Interceptor to guard against misconfigured deployments returning HTML
weatherAPI.interceptors.response.use(
  (response) => {
    // If Vercel serves an HTML error page, axios may still resolve with data as a string
    if (typeof response.data === 'string') {
      throw new Error('Unexpected response format from weather API');
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API service functions
export const weatherService = {
  // Get current weather by city name
  getCurrentWeather: async (city, units = 'metric') => {
    try {
      if (!API_KEY) {
        throw new Error('Missing API key. Configure REACT_APP_WEATHER_API_KEY');
      }
      const response = await weatherAPI.get('/weather', {
        params: {
          q: city,
          units
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch current weather');
    }
  },

  // Get current weather by coordinates
  getCurrentWeatherByCoords: async (lat, lon, units = 'metric') => {
    try {
      if (!API_KEY) {
        throw new Error('Missing API key. Configure REACT_APP_WEATHER_API_KEY');
      }
      const response = await weatherAPI.get('/weather', {
        params: {
          lat,
          lon,
          units
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch current weather');
    }
  },

  // Get 5-day forecast
  getForecast: async (city, units = 'metric') => {
    try {
      if (!API_KEY) {
        throw new Error('Missing API key. Configure REACT_APP_WEATHER_API_KEY');
      }
      const response = await weatherAPI.get('/forecast', {
        params: {
          q: city,
          units
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch weather forecast');
    }
  },

  // Get forecast by coordinates
  getForecastByCoords: async (lat, lon, units = 'metric') => {
    try {
      if (!API_KEY) {
        throw new Error('Missing API key. Configure REACT_APP_WEATHER_API_KEY');
      }
      const response = await weatherAPI.get('/forecast', {
        params: {
          lat,
          lon,
          units
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch weather forecast');
    }
  },

  // Search cities (using geocoding API)
  searchCities: async (query) => {
    try {
      if (!API_KEY) {
        throw new Error('Missing API key. Configure REACT_APP_WEATHER_API_KEY');
      }
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to search cities');
    }
  },

  // Get user's location weather
  getUserLocationWeather: async (units = 'metric') => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const weather = await weatherService.getCurrentWeatherByCoords(latitude, longitude, units);
            resolve(weather);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(new Error('Failed to get your location'));
        },
        {
          timeout: 10000,
          enableHighAccuracy: true
        }
      );
    });
  }
};

export default weatherService;