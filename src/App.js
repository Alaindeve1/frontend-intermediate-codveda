// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WeatherProvider } from './context/WeatherContext';

// Layout Components
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';

// Pages
import Home from './pages/Home';
import Forecast from './pages/Forecast';
import Favorites from './pages/Favorites';

// Main App Layout
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <Header />
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-white bg-opacity-10 backdrop-blur-md mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-white">
            <p className="text-sm text-blue-100">
              Weather data provided by{' '}
              <a 
                href="https://openweathermap.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-blue-200 font-medium"
              >
                OpenWeatherMap
              </a>
            </p>
            <p className="text-xs text-blue-200 mt-2">
              Built with React • Powered by Modern Web Technologies
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Weather App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-center text-white max-w-md mx-4">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
            <p className="text-blue-100 mb-6">
              The weather app encountered an unexpected error. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-blue-200">
                  Show error details
                </summary>
                <pre className="text-xs mt-2 p-2 bg-red-900 bg-opacity-50 rounded text-red-100 overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <WeatherProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/favorites" element={<Favorites />} />
              {/* Catch all route - redirect to home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Layout>
        </Router>
      </WeatherProvider>
    </ErrorBoundary>
  );
}

export default App;