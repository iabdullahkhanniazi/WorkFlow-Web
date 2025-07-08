import React, { useState, useEffect, useRef } from 'react';
import { firestoreService } from '../services/firestoreService';
import { Header } from './kanban/Header';
import { Board } from './kanban/Board';
import { CalendarView } from './kanban/CalendarView';

export const KanbanView = ({ user }) => {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('board');
  const hasInitialized = useRef(false);

  useEffect(() => {
    // This check ensures the initialization runs only once per session.
    if (!hasInitialized.current) {
      firestoreService.initializeBoard(user.uid);
      hasInitialized.current = true;
    }

    const unsubscribeCols = firestoreService.onColumnsSnapshot(user.uid, (newColumns) => {
        setColumns(newColumns);
        setLoading(false);
    });
    
    const unsubscribeTasks = firestoreService.onTasksSnapshot(user.uid, (tasksByColumn) => {
        for (const colId in tasksByColumn) {
            tasksByColumn[colId].sort((a, b) => a.order - b.order);
        }
        setTasks(tasksByColumn);
    });

    return () => {
      unsubscribeCols();
      unsubscribeTasks();
    };
  }, [user.uid]);

  if (loading) {
    return (
      <div className="bg-gray-900 text-white h-screen flex items-center justify-center">
        <p>Loading Board...</p>
      </div>
    );
  }

  const allTasks = Object.values(tasks).flat();
  const doneColumn = columns.find(col => col.title === 'Done');

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col font-sans">
      <Header 
        user={user} 
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      {currentView === 'board' ? (
        <Board 
            columns={columns} 
            setColumns={setColumns}
            tasks={tasks} 
            userId={user.uid} 
            doneColumnId={doneColumn?.id} 
        />
      ) : (
        <CalendarView 
            tasks={allTasks} 
            userId={user.uid}
            columns={columns} 
        />
      )}
    </div>
  );
};
