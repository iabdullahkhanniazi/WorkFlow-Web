import React, { useState } from 'react';
import { LogOut, LayoutGrid, Calendar, RefreshCw, User } from 'lucide-react';
import { authService } from '../../services/authService';
import { firestoreService } from '../../services/firestoreService';
import { ProfileModal } from '../shared/ProfileModal';

export const Header = ({ user, currentView, setCurrentView }) => {
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);

  const handleResetData = async () => {
    if (window.confirm("Are you sure you want to reset all your data?")) {
      await firestoreService.resetData(user.uid);
      alert("Your data has been reset.");
    }
  };

  const viewButtonClasses = (viewName) => `p-2 rounded-md flex items-center space-x-2 text-sm transition-colors ${currentView === viewName ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`;

  return (
    <>
      <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">TaskFlow</h1>
            <div className="flex items-center space-x-1 bg-gray-800 p-1 rounded-lg">
                <button onClick={() => setCurrentView('board')} className={viewButtonClasses('board')}><LayoutGrid size={16} /><span>Board</span></button>
                <button onClick={() => setCurrentView('calendar')} className={viewButtonClasses('calendar')}><Calendar size={16} /><span>Calendar</span></button>
            </div>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={handleResetData} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold p-2 rounded-lg" title="Reset All Data">
            <RefreshCw size={20} />
          </button>
          <button onClick={() => setProfileModalOpen(true)} className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:ring-2 hover:ring-indigo-500">
            {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full rounded-full object-cover" />
            ) : (
                <User size={20} />
            )}
          </button>
          <button onClick={authService.logout} className="bg-red-600 hover:bg-red-700 text-white font-bold p-2 rounded-lg" title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </header>
      <ProfileModal user={user} isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </>
  );
};
