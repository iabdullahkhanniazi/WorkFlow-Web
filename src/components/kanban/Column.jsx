import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { firestoreService } from '../../services/firestoreService';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';

export const Column = ({ column, tasks, userId, draggedTask, setDraggedTask, doneColumnId, onColumnDragStart, onColumnDragEnter, onColumnDrop, isColumnDragged }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const protectedColumns = ['To Do', 'In Progress', 'Done'];

  // FIX: This new `useEffect` hook listens for changes in the main `tasks` list.
  // If the modal is open and the task being edited has been updated (e.g., timer started),
  // it updates the local `editingTask` state to ensure the modal shows the latest data.
  useEffect(() => {
    if (isTaskModalOpen && editingTask) {
      const updatedTask = tasks.find(t => t.id === editingTask.id);
      if (updatedTask) {
        setEditingTask(updatedTask);
      }
    }
  }, [tasks, isTaskModalOpen, editingTask]);

  const handleOpenTaskModal = (task = null) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };
  
  const handleDeleteColumn = async () => {
    if (!window.confirm(`Delete "${column.title}" and all its tasks?`)) return;
    await firestoreService.deleteColumn(userId, column.id, tasks);
  };

  const handleTaskDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!draggedTask) return;

    const targetColumnId = column.id;

    if (draggedTask.columnId === targetColumnId) {
      const cardElements = [...e.currentTarget.querySelectorAll('.task-card')];
      const dropIndex = cardElements.findIndex(el => {
        const rect = el.getBoundingClientRect();
        return e.clientY < rect.top + rect.height / 2;
      });

      const reorderedTasks = [...tasks];
      const [draggedItem] = reorderedTasks.splice(reorderedTasks.findIndex(t => t.id === draggedTask.id), 1);
      
      if (dropIndex === -1) {
        reorderedTasks.push(draggedItem);
      } else {
        reorderedTasks.splice(dropIndex, 0, draggedItem);
      }

      const tasksToUpdate = reorderedTasks.map((task, index) => ({ id: task.id, order: index }));
      await firestoreService.reorderTasks(userId, tasksToUpdate);

    } else {
      const targetTasks = tasks || [];
      const newOrder = targetTasks.length;
      await firestoreService.moveTask(userId, draggedTask.id, targetColumnId, newOrder);
    }
  };

  return (
    <>
      <div 
        onDragEnter={onColumnDragEnter}
        onDragEnd={onColumnDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`flex-shrink-0 w-80 bg-gray-800 rounded-lg flex flex-col max-h-[calc(100vh-10rem)] ${isColumnDragged ? 'opacity-50' : ''}`}
      >
        <div 
          draggable
          onDragStart={onColumnDragStart}
          className="flex justify-between items-center p-4 flex-shrink-0 cursor-grab"
        >
            <div className="flex items-center">
              <GripVertical size={18} className="mr-2 text-gray-500" />
              <h3 className="font-semibold text-lg">{column.title}</h3>
            </div>
            {!protectedColumns.includes(column.title) && (
                <button onClick={handleDeleteColumn} className="text-gray-500 hover:text-red-500">
                    <Trash2 size={16} />
                </button>
            )}
        </div>
        <div 
          className={`task-list flex-grow space-y-3 px-4 overflow-y-auto transition-colors min-h-20 ${isDragOver ? 'bg-gray-700/50' : ''}`}
          onDrop={handleTaskDrop} 
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }} 
          onDragLeave={() => setIsDragOver(false)}
        >
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              setDraggedTask={setDraggedTask} 
              onEdit={() => handleOpenTaskModal(task)}
              userId={userId} 
              doneColumnId={doneColumnId}
            />
          ))}
        </div>
        <div className="px-4 pb-3 pt-2 flex-shrink-0">
            <button 
                onClick={() => handleOpenTaskModal()} 
                className="text-gray-400 hover:text-white flex items-center space-x-2 transition-colors"
            >
              <Plus size={16} />
              <span className="text-sm">Add a card</span>
            </button>
        </div>
      </div>
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setTaskModalOpen(false)} task={editingTask} columnId={column.id} userId={userId} doneColumnId={doneColumnId} />
    </>
  );
};
