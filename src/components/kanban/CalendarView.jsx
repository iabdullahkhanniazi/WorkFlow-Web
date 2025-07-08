import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { TaskModal } from './TaskModal';

const CalendarTask = ({ task, onTaskClick }) => {
    const priorityColors = {
        High: 'bg-red-500',
        Medium: 'bg-yellow-500',
        Low: 'bg-blue-500',
    };

    const checklistItems = task.checklist || [];
    const completedItems = checklistItems.filter(item => item.completed).length;
    const totalItems = checklistItems.length;
    const checklistProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    return (
        <div 
            onClick={(e) => onTaskClick(e, task)}
            className="bg-gray-700 dark:bg-gray-700 p-2 rounded-md mb-2 cursor-pointer hover:bg-indigo-600 transition-colors group"
        >
            <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${priorityColors[task.priority] || 'bg-gray-400'}`}></span>
                <p className="text-xs text-white truncate group-hover:text-white">{task.title}</p>
            </div>
            {totalItems > 0 && (
                <div className="mt-2">
                    <div className="w-full bg-gray-600 dark:bg-gray-600 rounded-full h-1">
                        <div 
                            className={`h-1 rounded-full ${checklistProgress === 100 ? 'bg-green-500' : 'bg-indigo-400'}`} 
                            style={{ width: `${checklistProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const CalendarView = ({ tasks, userId, columns }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isTaskModalOpen, setTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [priorityFilter, setPriorityFilter] = useState('All'); // New state for the filter

    const filteredTasks = useMemo(() => {
        if (priorityFilter === 'All') {
            return tasks;
        }
        return tasks.filter(task => task.priority === priorityFilter);
    }, [tasks, priorityFilter]);

    const handleTaskClick = (e, task) => {
        e.stopPropagation();
        setSelectedTask(task);
        setTaskModalOpen(true);
    };

    const handleDayClick = (date) => {
        const todoColumn = columns.find(col => col.title === 'To Do');
        if (!todoColumn) {
            alert("Could not find the 'To Do' column. Please create one if it was deleted.");
            return;
        }
        setSelectedTask({ 
            dueDate: date,
            columnId: todoColumn.id,
        });
        setTaskModalOpen(true);
    };

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDayOfWeek = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const tasksByDate = filteredTasks.reduce((acc, task) => {
        if (task.dueDate) {
            const dateStr = task.dueDate.toDate().toISOString().split('T')[0];
            if (!acc[dateStr]) acc[dateStr] = [];
            acc[dateStr].push(task);
        }
        return acc;
    }, {});

    const calendarDays = [];
    for (let i = 0; i < startDayOfWeek; i++) {
        calendarDays.push(<div key={`empty-start-${i}`} className="border-r border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dayOfWeek = date.getDay();
        const dateStr = date.toISOString().split('T')[0];
        const dayTasks = tasksByDate[dateStr] || [];
        const isToday = new Date().toISOString().split('T')[0] === dateStr;
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        calendarDays.push(
            <div 
                key={day} 
                className={`border-r border-b border-gray-200 dark:border-gray-700 p-2 flex flex-col relative min-h-[120px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors ${isWeekend ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                onClick={() => handleDayClick(date)}
            >
                <span className={`font-bold text-sm mb-2 ${isToday ? 'text-indigo-500 dark:text-indigo-400' : ''}`}>{day}</span>
                <div className="flex-grow overflow-y-auto custom-scrollbar-thin">
                    {dayTasks.map(task => (
                        <CalendarTask key={task.id} task={task} onTaskClick={handleTaskClick} />
                    ))}
                </div>
            </div>
        );
    }
    
    const totalCells = startDayOfWeek + daysInMonth;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let i = 0; i < remainingCells; i++) {
        const dayOfWeek = (startDayOfWeek + daysInMonth + i) % 7;
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        calendarDays.push(<div key={`empty-end-${i}`} className={`border-r border-b border-gray-200 dark:border-gray-700 ${isWeekend ? 'bg-gray-100 dark:bg-gray-800' : ''}`}></div>);
    }

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    return (
        <>
            <div className="flex flex-col flex-grow p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-bold">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                        <button onClick={goToToday} className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                            Today
                        </button>
                    </div>
                    <div className="flex items-center space-x-2">
                        {/* Priority Filter Dropdown */}
                        <div className="relative">
                            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select 
                                value={priorityFilter} 
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="pl-9 pr-4 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="All">All Priorities</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <button onClick={prevMonth} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronLeft /></button>
                        <button onClick={nextMonth} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"><ChevronRight /></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 flex-grow border-t border-l border-gray-200 dark:border-gray-700">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                        <div key={day} className={`text-center font-semibold text-xs text-gray-500 dark:text-gray-400 p-2 border-r border-b border-gray-200 dark:border-gray-700 ${index === 0 || index === 6 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-800/50'}`}>{day}</div>
                    ))}
                    {calendarDays}
                </div>
            </div>
            {isTaskModalOpen && (
                <TaskModal 
                    isOpen={isTaskModalOpen} 
                    onClose={() => setTaskModalOpen(false)} 
                    task={selectedTask}
                    columnId={selectedTask?.columnId}
                    userId={userId}
                />
            )}
        </>
    );
};
