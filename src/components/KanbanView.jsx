import React, { useState, useEffect, useMemo, useRef } from 'react';
import { firestoreService } from '../services/firestoreService';
import { Header } from './kanban/Header';
import { Board } from './kanban/Board';
import { CalendarView } from './kanban/CalendarView';

export const KanbanView = ({ user, theme, setTheme }) => {
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('board');
  const [searchTerm, setSearchTerm] = useState('');
  const hasInitialized = useRef(false);

  useEffect(() => {
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

  const filteredTasks = useMemo(() => {
    if (!searchTerm) {
      return tasks;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = {};
    for (const columnId in tasks) {
      filtered[columnId] = tasks[columnId].filter(task =>
        task.title.toLowerCase().includes(lowercasedFilter)
      );
    }
    return filtered;
  }, [tasks, searchTerm]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white h-screen flex items-center justify-center">
        <p>Loading Board...</p>
      </div>
    );
  }

  const allTasks = Object.values(tasks).flat();
  const doneColumn = columns.find(col => col.title === 'Done');

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white h-screen flex flex-col font-sans">
      <Header 
        user={user} 
        currentView={currentView}
        setCurrentView={setCurrentView}
        theme={theme}
        setTheme={setTheme}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      {currentView === 'board' ? (
        <Board 
            columns={columns} 
            setColumns={setColumns}
            tasks={filteredTasks}
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
