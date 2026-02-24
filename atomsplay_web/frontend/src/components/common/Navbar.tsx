import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  CloudIcon, 
  UserCircleIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Risk History', href: '/history' },
  { name: 'Model Insights', href: '/insights' },
  { name: 'Settings', href: '/settings' },
];

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 fixed w-full z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <CloudIcon className="h-8 w-8 text-lavender-400 group-hover:text-lavender-300 transition-colors" />
                <div className="absolute -inset-1 bg-lavender-500/20 rounded-full blur-lg group-hover:bg-lavender-500/30 transition-all" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-lavender-400 to-teal-400 bg-clip-text text-transparent">
                AtmosPlay
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.href
                      ? 'bg-lavender-500/20 text-lavender-400 border border-lavender-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors group">
              <UserCircleIcon className="h-8 w-8 text-gray-400 group-hover:text-lavender-400 transition-colors" />
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-gray-800 border border-gray-700 shadow-xl py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 text-sm ${
                        active ? 'bg-gray-700 text-white' : 'text-gray-300'
                      }`}
                    >
                      Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/settings"
                      className={`block px-4 py-2 text-sm ${
                        active ? 'bg-gray-700 text-white' : 'text-gray-300'
                      }`}
                    >
                      Settings
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        active ? 'bg-gray-700 text-white' : 'text-gray-300'
                      }`}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </nav>
  );
};