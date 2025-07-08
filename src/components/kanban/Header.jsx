import React from 'react';
import { LogOut, LayoutGrid, Calendar, RefreshCw } from 'lucide-react';
import { authService } from '../../services/authService';
import { firestoreService } from '../../services/firestoreService';

export const Header = ({ user, currentView, setCurrentView }) => {

  const viewButtonClasses = (viewName) => 
    `p-2 rounded-md flex items-center space-x-2 text-sm transition-colors ${
        currentView === viewName 
        ? 'bg-indigo-600 text-white' 
        : 'bg-gray-700 hover:bg-gray-600'
    }`;

  const handleResetData = async () => {
    if (window.confirm("Are you sure you want to reset all your data? This will delete all columns and tasks and cannot be undone.")) {
      try {
        await firestoreService.resetData(user.uid);
        alert("Your data has been reset.");
      } catch (error) {
        console.error("Failed to reset data:", error);
        alert("Error: Could not reset your data. Please check the console for details.");
      }
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
      <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">TaskFlow</h1>
          <div className="flex items-center space-x-1 bg-gray-800 p-1 rounded-lg">
              <button onClick={() => setCurrentView('board')} className={viewButtonClasses('board')}>
                  <LayoutGrid size={16} />
                  <span>Board</span>
              </button>
              <button onClick={() => setCurrentView('calendar')} className={viewButtonClasses('calendar')}>
                  <Calendar size={16} />
                  <span>Calendar</span>
              </button>
          </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-300 hidden md:block">{user.email}</span>
        <button onClick={handleResetData} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold p-2 rounded-lg" title="Reset All Data">
          <RefreshCw size={20} />
        </button>
        <button onClick={authService.logout} className="bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-lg" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};
