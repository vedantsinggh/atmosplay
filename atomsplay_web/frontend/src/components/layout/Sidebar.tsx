import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const sidebarLinks = [
  { name: 'Dashboard', href: '/' },
  { name: 'Risk History', href: '/history' },
  { name: 'Model Insights', href: '/insights' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-gray-800/50 border-r border-gray-700/50 p-6">
      <nav className="space-y-2">
        {sidebarLinks.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            className={`block px-4 py-2 rounded-lg transition-colors ${
              location.pathname === link.href
                ? 'bg-lavender-500/20 text-lavender-400'
                : 'text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
