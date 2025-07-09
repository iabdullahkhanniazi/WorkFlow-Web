import React from 'react';
import { LogOut, LayoutGrid, Calendar, RefreshCw, Search, Sun, Moon } from 'lucide-react';
import { authService } from '../../services/authService';
import { firestoreService } from '../../services/firestoreService';

export const Header = ({ user, currentView, setCurrentView, theme, setTheme, searchTerm, setSearchTerm }) => {

  const viewButtonClasses = (viewName) => 
    `p-2 rounded-md flex items-center space-x-2 text-sm transition-colors ${
        currentView === viewName 
        ? 'bg-indigo-600 text-white' 
        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
    }`;

  const handleResetData = async () => {
    if (window.confirm("Are you sure you want to reset all your data?")) {
      await firestoreService.resetData(user.uid);
      alert("Your data has been reset.");
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">TaskFlow</h1>
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button onClick={() => setCurrentView('board')} className={viewButtonClasses('board')}><LayoutGrid size={16} /><span>Board</span></button>
              <button onClick={() => setCurrentView('calendar')} className={viewButtonClasses('calendar')}><Calendar size={16} /><span>Calendar</span></button>
          </div>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-500 dark:text-gray-300 hidden md:block">{user.email}</span>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700" title="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button onClick={handleResetData} className="p-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white" title="Reset All Data">
          <RefreshCw size={20} />
        </button>
        <button onClick={authService.logout} className="p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};
