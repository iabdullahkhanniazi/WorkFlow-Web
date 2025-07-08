import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Calendar, Play, Pause, CheckSquare, Check } from 'lucide-react';
import { firestoreService } from '../../services/firestoreService';

// Helper function to format seconds into HH:MM:SS
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return [hours, minutes, seconds]
    .map(v => v < 10 ? "0" + v : v)
    .join(":");
};

// Helper function to calculate remaining time
const getRemainingTimeInfo = (dueDate) => {
    if (!dueDate || !dueDate.toDate) return null;
    const now = new Date();
    const due = dueDate.toDate();
    const diffTime = due.getTime() - now.getTime();
    if (diffTime < 0) return { text: `Overdue`, isPast: true };
    const diffHoursTotal = diffTime / (1000 * 60 * 60);
    if (diffHoursTotal < 24) {
        const hours = Math.floor(diffHoursTotal);
        const minutes = Math.floor((diffHoursTotal - hours) * 60);
        return { text: `${hours}h ${minutes}m left`, isPast: false };
    }
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { text: `${diffDays} days left`, isPast: false };
};

export const TaskCard = ({ task, setDraggedTask, onEdit, userId, doneColumnId }) => {
  const [displayTime, setDisplayTime] = useState(task.timeTracked || 0);

  const priorityStyles = {
    Low: 'bg-blue-600 text-blue-100',
    Medium: 'bg-yellow-600 text-yellow-100',
    High: 'bg-red-600 text-red-100',
  };

  useEffect(() => {
    let interval = null;
    if (task.isTracking) {
      interval = setInterval(() => {
        const now = new Date();
        const lastStarted = task.lastStarted?.toDate() || now;
        const elapsed = (now.getTime() - lastStarted.getTime()) / 1000;
        setDisplayTime((task.timeTracked || 0) + elapsed);
      }, 1000);
    } else {
        setDisplayTime(task.timeTracked || 0);
    }
    return () => clearInterval(interval);
  }, [task.isTracking, task.lastStarted, task.timeTracked]);

  const handleTimerToggle = async (e) => {
    e.stopPropagation();
    if (!userId) return;
    if (task.isTracking) {
      const now = new Date();
      const lastStarted = task.lastStarted?.toDate() || now;
      const elapsedSeconds = (now.getTime() - lastStarted.getTime()) / 1000;
      await firestoreService.stopTimer(userId, task.id, elapsedSeconds);
    } else {
      await firestoreService.startTimer(userId, task.id);
    }
  };
  
  const handleMarkComplete = async (e) => {
    e.stopPropagation();
    if (!doneColumnId) {
        alert("The 'Done' column could not be found.");
        return;
    }
    await firestoreService.moveTask(userId, task.id, doneColumnId, 0);
  };

  const remainingTimeInfo = getRemainingTimeInfo(task.dueDate);
  
  const checklistItems = task.checklist || [];
  const completedItems = checklistItems.filter(item => item.completed).length;
  const totalItems = checklistItems.length;
  const isChecklistComplete = totalItems > 0 && completedItems === totalItems;
  const isDone = task.columnId === doneColumnId;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!userId || !window.confirm("Delete this task?")) return;
    await firestoreService.deleteTask(userId, task.id);
  };
  
  const handleEdit = (e) => {
      e.stopPropagation();
      onEdit();
  }

  return (
    <div draggable onDragStart={() => setDraggedTask(task)} onClick={onEdit} className="task-card bg-gray-700 rounded-lg shadow-md cursor-pointer hover:ring-2 hover:ring-indigo-500 group">
      <div className="relative">
        <img 
          src={task.coverImage || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'} 
          alt="Task cover" 
          className="w-full h-32 object-cover rounded-t-lg" 
          onError={(e) => { e.currentTarget.src = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'; }}
        />
        {remainingTimeInfo && (
            <span className={`absolute top-2 left-2 flex items-center space-x-1 text-xs px-2 py-1 rounded-full text-white ${remainingTimeInfo.isPast ? 'bg-red-600' : 'bg-black/50'}`}>
              <Calendar size={14} />
              <span>{remainingTimeInfo.text}</span>
            </span>
          )}
        {isChecklistComplete && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500" title="Checklist complete!"></div>
        )}
      </div>
      <div className="p-3">
        {task.priority && (
            <span className={`px-2 py-1 mb-2 inline-block text-xs font-semibold rounded-full ${priorityStyles[task.priority] || 'bg-gray-500'}`}>
                {task.priority}
            </span>
        )}
        <p className="font-semibold text-gray-200 mb-2">{task.title}</p>
        
        <div className="flex justify-between items-center text-gray-400">
          <div className="flex items-center flex-wrap gap-2">
            {totalItems > 0 && (
                 <span className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-md ${isChecklistComplete ? 'bg-green-700 text-green-200' : 'bg-gray-600'}`}>
                    <CheckSquare size={14} />
                    <span>{completedItems}/{totalItems}</span>
                </span>
            )}
             <span className="text-xs font-mono bg-gray-600 px-2 py-1 rounded-md">{formatTime(displayTime)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isDone && (
                <button onClick={handleMarkComplete} title="Mark as complete" className="p-1 hover:bg-green-600 rounded-full text-gray-400 hover:text-white">
                    <Check size={16} />
                </button>
            )}
            <button onClick={handleTimerToggle} className="p-1 hover:bg-gray-600 rounded-full">
              {task.isTracking ? <Pause size={16} className="text-yellow-400" /> : <Play size={16} />}
            </button>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={handleEdit} className="p-1 hover:bg-gray-600 rounded-full"><Pencil size={14} /></button>
                <button onClick={handleDelete} className="p-1 hover:bg-gray-600 rounded-full"><Trash2 size={14} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
