// src/context/WeatherContext.js
import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  currentWeather: null,
  forecast: [],
  favorites: JSON.parse(localStorage.getItem('weatherFavorites')) || [],
  loading: false,
  error: null,
  searchQuery: '',
  temperatureUnit: 'metric' // metric for Celsius, imperial for Fahrenheit
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_CURRENT_WEATHER: 'SET_CURRENT_WEATHER',
  SET_FORECAST: 'SET_FORECAST',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  ADD_TO_FAVORITES: 'ADD_TO_FAVORITES',
  REMOVE_FROM_FAVORITES: 'REMOVE_FROM_FAVORITES',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  TOGGLE_TEMPERATURE_UNIT: 'TOGGLE_TEMPERATURE_UNIT'
};

// Reducer function
function weatherReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTIONS.SET_CURRENT_WEATHER:
      return { ...state, currentWeather: action.payload, loading: false, error: null };
    
    case ACTIONS.SET_FORECAST:
      return { ...state, forecast: action.payload, loading: false, error: null };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ACTIONS.ADD_TO_FAVORITES:
      const newFavorites = [...state.favorites, action.payload];
      localStorage.setItem('weatherFavorites', JSON.stringify(newFavorites));
      return { ...state, favorites: newFavorites };
    
    case ACTIONS.REMOVE_FROM_FAVORITES:
      const filteredFavorites = state.favorites.filter(fav => fav.id !== action.payload);
      localStorage.setItem('weatherFavorites', JSON.stringify(filteredFavorites));
      return { ...state, favorites: filteredFavorites };
    
    case ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    
    case ACTIONS.TOGGLE_TEMPERATURE_UNIT:
      const newUnit = state.temperatureUnit === 'metric' ? 'imperial' : 'metric';
      return { ...state, temperatureUnit: newUnit };
    
    default:
      return state;
  }
}

// Create context
const WeatherContext = createContext();

// Context provider component
export function WeatherProvider({ children }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  // Actions
  const actions = {
    setLoading: (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading }),
    
    setCurrentWeather: (weather) => dispatch({ type: ACTIONS.SET_CURRENT_WEATHER, payload: weather }),
    
    setForecast: (forecast) => dispatch({ type: ACTIONS.SET_FORECAST, payload: forecast }),
    
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
    
    clearError: () => dispatch({ type: ACTIONS.CLEAR_ERROR }),
    
    addToFavorites: (city) => {
      const favoriteCity = {
        id: Date.now(),
        name: city.name,
        country: city.country,
        lat: city.coord.lat,
        lon: city.coord.lon
      };
      dispatch({ type: ACTIONS.ADD_TO_FAVORITES, payload: favoriteCity });
    },
    
    removeFromFavorites: (cityId) => dispatch({ type: ACTIONS.REMOVE_FROM_FAVORITES, payload: cityId }),
    
    setSearchQuery: (query) => dispatch({ type: ACTIONS.SET_SEARCH_QUERY, payload: query }),
    
    toggleTemperatureUnit: () => dispatch({ type: ACTIONS.TOGGLE_TEMPERATURE_UNIT }),
    
    isFavorite: (cityName) => {
      return state.favorites.some(fav => fav.name.toLowerCase() === cityName.toLowerCase());
    }
  };

  return (
    <WeatherContext.Provider value={{ state, actions }}>
      {children}
    </WeatherContext.Provider>
  );
}

// Custom hook to use weather context
export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within WeatherProvider');
  }
  return context;
}