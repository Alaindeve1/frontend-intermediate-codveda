// src/components/Layout/Navigation.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  const navItems = [
    { path: '/', label: 'Current Weather', icon: '🌡️' },
    { path: '/forecast', label: 'Forecast', icon: '📅' },
    { path: '/favorites', label: 'Favorites', icon: '⭐' }
  ];

  return (
    <nav className="bg-white bg-opacity-10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white bg-opacity-20 text-white font-semibold'
                    : 'text-blue-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;