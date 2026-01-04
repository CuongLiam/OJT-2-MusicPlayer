import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Admin: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-2xl font-bold">Admin Panel</div>
        <nav>
          <ul>
            <li>
              <NavLink to="/admin/dashboard" className={({ isActive }) =>
                `block p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-900' : ''}`
              }>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users" className={({ isActive }) =>
                `block p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-900' : ''}`
              }>
                Users
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/genres" className={({ isActive }) =>
                `block p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-900' : ''}`
              }>
                Genres
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/albums" className={({ isActive }) =>
                `block p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-900' : ''}`
              }>
                Albums
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/songs" className={({ isActive }) =>
                `block p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-900' : ''}`
              }>
                Songs
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/banners" className={({ isActive }) =>
                `block p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-900' : ''}`
              }>
                Banners
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/subscriptions" className={({ isActive }) =>
                `block p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-900' : ''}`
              }>
                Subscriptions
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/artists" className={({ isActive }) =>
                `block p-4 hover:bg-gray-700 ${isActive ? 'bg-gray-900' : ''}`
              }>
                Artists
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;

