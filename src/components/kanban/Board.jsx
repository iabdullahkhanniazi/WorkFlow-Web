import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { firestoreService } from '../../services/firestoreService';
import { Column } from './Column';
import { Modal } from '../shared/Modal';

export const Board = ({ columns, setColumns, tasks, userId, doneColumnId }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [isColumnModalOpen, setColumnModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

  const handleAddColumn = async (e) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;
    try {
      await firestoreService.addColumn(userId, newColumnName, columns.length);
      setNewColumnName('');
      setColumnModalOpen(false);
    } catch (error) {
      console.error("Failed to add column:", error);
      alert("Error: Could not add the new column.");
    }
  };

  const handleColumnDragStart = (e, column) => {
    setDraggedColumn(column);
  };

  const handleColumnDragEnter = (e, targetColumn) => {
    if (!draggedColumn || draggedColumn.id === targetColumn.id) return;
    const reorderedColumns = [...columns];
    const sourceIndex = reorderedColumns.findIndex(c => c.id === draggedColumn.id);
    const targetIndex = reorderedColumns.findIndex(c => c.id === targetColumn.id);
    const [removed] = reorderedColumns.splice(sourceIndex, 1);
    reorderedColumns.splice(targetIndex, 0, removed);
    setColumns(reorderedColumns);
  };

  const handleColumnDrop = async () => {
    if (draggedColumn) {
      try {
        const columnsToUpdate = columns.map((col, index) => ({ id: col.id, order: index }));
        await firestoreService.reorderColumns(userId, columnsToUpdate);
      } catch (error) {
        console.error("Failed to reorder columns:", error);
      } finally {
        setDraggedColumn(null);
      }
    }
  };

  return (
    <>
      <main className="flex-1 flex items-start overflow-x-auto p-4 space-x-4 bg-gray-100 dark:bg-gray-900">
        {columns && columns.map(column => (
          <Column 
              key={column.id} 
              column={column} 
              tasks={tasks[column.id] || []} 
              userId={userId}
              draggedTask={draggedTask}
              setDraggedTask={setDraggedTask}
              doneColumnId={doneColumnId}
              onColumnDragStart={(e) => handleColumnDragStart(e, column)}
              onColumnDragEnter={(e) => handleColumnDragEnter(e, column)}
              onColumnDrop={handleColumnDrop}
              isColumnDragged={draggedColumn?.id === column.id}
          />
        ))}
        <div className="flex-shrink-0 w-80">
            <button 
                onClick={() => setColumnModalOpen(true)}
                className="w-full p-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 rounded-lg flex items-center text-gray-600 dark:text-gray-400 transition-colors"
            >
                <Plus size={16} className="mr-2" />
                Add another list
            </button>
        </div>
      </main>

      <Modal isOpen={isColumnModalOpen} onClose={() => setColumnModalOpen(false)} title="Add New Column">
        <form onSubmit={handleAddColumn}>
          <input type="text" value={newColumnName} onChange={(e) => setNewColumnName(e.target.value)} placeholder="Enter list title..." className="w-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">Add List</button>
          </div>
        </form>
      </Modal>
    </>
  );
};
