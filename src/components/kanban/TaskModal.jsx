import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { firestoreService } from '../../services/firestoreService';
import { auth } from '../../firebase';
import { Modal } from '../shared/Modal';
import { Clock, Calendar, Plus, Trash2, AlignLeft, CheckSquare, Play, Pause, Check, MessageSquare, Send, Tag, Pencil, Image as ImageIcon } from 'lucide-react';

// Helper function to format seconds into HH:MM:SS
const formatTime = (totalSeconds) => {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    totalSeconds = 0;
  }
  // FIX: Ensure we are working with whole numbers for calculations
  const flooredSeconds = Math.floor(totalSeconds);
  const hours = Math.floor(flooredSeconds / 3600);
  const minutes = Math.floor((flooredSeconds % 3600) / 60);
  const seconds = flooredSeconds % 60;
  return [hours, minutes, seconds]
    .map(v => v < 10 ? "0" + v : v)
    .join(":");
};

const getRemainingTimeInfo = (d) => { if(!d) return null; const n=new Date(),due=d.toDate?d.toDate():new Date(d),t=due-n; if(t<0)return{text:'Overdue',isPast:true};const h=t/36e5;if(h<24)return{text:`${Math.floor(h)}h ${Math.floor(h%1*60)}m left`,isPast:false};const days=Math.ceil(h/24);return{text:`${days} days left`,isPast:false}};

export const TaskModal = ({ isOpen, onClose, task, columnId, userId, doneColumnId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [coverImage, setCoverImage] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [displayTime, setDisplayTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isEditingPriority, setIsEditingPriority] = useState(false);

  const priorityCircleColors = {
    High: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-blue-500',
  };

  useEffect(() => {
    if (isOpen && task?.id) {
        const unsubscribe = firestoreService.onCommentsSnapshot(userId, task.id, setComments);
        return () => unsubscribe();
    }
  }, [isOpen, task?.id, userId]);

  useEffect(() => {
    if (isOpen) {
      setTitle(task ? task.title : '');
      setDescription(task ? (task.description || '') : '');
      setPriority(task ? (task.priority || 'Medium') : 'Medium');
      setCoverImage(task ? (task.coverImage || '') : '');
      setChecklist(task ? (task.checklist || []) : []);
      setIsTracking(task?.isTracking || false);
      setDisplayTime(task?.timeTracked || 0);
      setIsEditingCover(false);
      setIsEditingDate(false);
      setIsEditingPriority(false);
      const date = task?.dueDate?.toDate ? task.dueDate.toDate() : task?.dueDate;
      if (date) {
        const localDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
        setDueDate(localDateTime);
      } else {
        setDueDate('');
      }
    }
  }, [task, isOpen]);

  useEffect(() => {
    let interval = null;
    if (isOpen && isTracking) {
      interval = setInterval(() => {
        const now = new Date();
        const lastStarted = task.lastStarted?.toDate() || now;
        const elapsed = (now.getTime() - lastStarted.getTime()) / 1000;
        setDisplayTime((task.timeTracked || 0) + elapsed);
      }, 1000);
    } else {
      setDisplayTime(task?.timeTracked || 0);
    }
    return () => clearInterval(interval);
  }, [isOpen, isTracking, task?.lastStarted, task?.timeTracked]);

  const handleTimerToggle = async () => {
    if (!task) return;
    setIsTracking(!isTracking); 
    if (task.isTracking) {
      const now = new Date();
      const lastStarted = task.lastStarted?.toDate() || now;
      const elapsedSeconds = Math.round((now.getTime() - lastStarted.getTime()) / 1000);
      await firestoreService.stopTimer(userId, task.id, elapsedSeconds);
    } else {
      await firestoreService.startTimer(userId, task.id);
    }
  };

  const handleChecklistChange = async (updatedChecklist) => {
      setChecklist(updatedChecklist);
      if (task) {
          await firestoreService.updateTask(userId, task.id, { checklist: updatedChecklist });
      }
  };

  const addChecklistItem = () => {
      if (!newChecklistItem.trim()) return;
      const newItem = { id: Date.now().toString(), text: newChecklistItem, completed: false };
      handleChecklistChange([...checklist, newItem]);
      setNewChecklistItem('');
  };

  const toggleChecklistItem = (itemId) => {
      const updatedList = checklist.map(item => 
          item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      handleChecklistChange(updatedList);
  };

  const deleteChecklistItem = (itemId) => {
      const updatedList = checklist.filter(item => item.id !== itemId);
      handleChecklistChange(updatedList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const taskData = { 
      title, 
      description, 
      columnId, 
      priority, 
      coverImage,
      dueDate: dueDate ? new Date(dueDate) : null,
      checklist
    };
    if (task && task.id) {
      await firestoreService.updateTask(userId, task.id, taskData);
    } else {
      await firestoreService.addTask(userId, taskData);
    }
    onClose();
  };
  
  const handleMarkComplete = async () => {
    if (!task || !doneColumnId) return;
    await firestoreService.moveTask(userId, task.id, doneColumnId, 0);
    onClose();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !task?.id) return;
    const commentData = {
        text: newComment,
        authorId: auth.currentUser.uid,
        authorEmail: auth.currentUser.email
    };
    try {
        await firestoreService.addComment(userId, task.id, commentData);
        setNewComment('');
    } catch (error) {
        console.error("Failed to add comment:", error);
        alert("Error: Could not post your comment.");
    }
  };

  const remainingTimeInfo = getRemainingTimeInfo(task?.dueDate);
  const checklistItems = checklist || [];
  const completedItems = checklistItems.filter(item => item.completed).length;
  const isChecklistComplete = checklistItems.length > 0 && completedItems === checklistItems.length;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {coverImage && (
          <div className="relative mb-6 -mx-6 -mt-6 group">
            <img src={coverImage} alt="Cover" className="w-full h-48 object-cover rounded-t-lg" />
            <button 
              type="button" 
              onClick={() => setIsEditingCover(!isEditingCover)}
              className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil size={16} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                    <span className={`w-6 h-6 rounded-full flex-shrink-0 ${priorityCircleColors[priority]}`}></span>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent text-3xl font-bold text-white border-none focus:ring-0 p-0" placeholder="Task Title" required />
                </div>
                
                <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mb-6 text-sm text-gray-400">
                    {isEditingPriority ? (
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            onBlur={() => setIsEditingPriority(false)}
                            autoFocus
                            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    ) : (
                        <button type="button" onClick={() => setIsEditingPriority(true)} className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-700">
                            <Tag size={16}/>
                            <span>{priority} Priority</span>
                        </button>
                    )}
                    {isEditingDate ? (
                        <input 
                            type="datetime-local" 
                            value={dueDate} 
                            onChange={(e) => setDueDate(e.target.value)} 
                            onBlur={() => setIsEditingDate(false)}
                            autoFocus
                            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    ) : (
                        <button type="button" onClick={() => setIsEditingDate(true)} className={`flex items-center space-x-2 p-1 rounded-md hover:bg-gray-700 ${remainingTimeInfo?.isPast ? 'text-red-400' : ''}`}>
                            <Calendar size={16}/>
                            <span>{remainingTimeInfo ? remainingTimeInfo.text : 'Set Due Date'}</span>
                        </button>
                    )}
                    {task && task.id && (
                      <div className="flex items-center space-x-2">
                          <Clock size={16} />
                          <span className="font-mono">{formatTime(displayTime)}</span>
                      </div>
                    )}
                     {task && task.id && (
                        <button type="button" onClick={handleTimerToggle} className="flex items-center space-x-2 p-1 hover:bg-gray-700 rounded-full">
                            {isTracking ? <Pause size={16} className="text-yellow-400" /> : <Play size={16} />}
                            <span>{isTracking ? 'Pause' : 'Start'} Timer</span>
                        </button>
                    )}
                </div>
                
                {isEditingCover && (
                    <div className="mb-6">
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-400 mb-2"><ImageIcon size={16}/><span>Cover Image URL</span></label>
                        <input type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                )}

                <div className="mb-6">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-400 mb-2"><AlignLeft size={16} /><span>Description</span></label>
                    <ReactQuill theme="snow" value={description} onChange={setDescription} className="bg-gray-700 rounded-lg"/>
                </div>

                <div className="mb-6">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-400 mb-2"><CheckSquare size={16} /><span>Checklist</span></label>
                    {checklist.length > 0 && (
                        <div className="w-full bg-gray-900 rounded-full h-2 mb-3">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(completedItems / checklist.length) * 100}%` }}></div>
                        </div>
                    )}
                    <div className="space-y-2">
                        {checklist.map(item => (
                            <div key={item.id} className="flex items-center justify-between bg-gray-700 p-2 rounded-md hover:bg-gray-600">
                                <div className="flex items-center">
                                    <input type="checkbox" checked={item.completed} onChange={() => toggleChecklistItem(item.id)} className="w-4 h-4 text-indigo-600 bg-gray-900 border-gray-600 rounded focus:ring-indigo-500" />
                                    <span className={`ml-3 text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>{item.text}</span>
                                </div>
                                <button type="button" onClick={() => deleteChecklistItem(item.id)} className="text-gray-500 hover:text-red-500">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center mt-3">
                        <input type="text" value={newChecklistItem} onChange={(e) => setNewChecklistItem(e.target.value)} placeholder="Add an item" className="w-full bg-gray-700 border-gray-600 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <button type="button" onClick={addChecklistItem} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 rounded-r-md">
                            <Plus size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="md:col-span-1 space-y-4">
                {task && task.id && isChecklistComplete && task.columnId !== doneColumnId && (
                    <button type="button" onClick={handleMarkComplete} className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                        <CheckSquare size={16} />
                        <span>Mark as Complete</span>
                    </button>
                )}
                {!coverImage && (
                    <button type="button" onClick={() => setIsEditingCover(true)} className="w-full flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">
                        <ImageIcon size={16} />
                        <span>Add Cover</span>
                    </button>
                )}
                
                {task && task.id && (
                    <div>
                        <label className="flex items-center space-x-2 text-sm font-medium text-gray-400 mb-2"><MessageSquare size={16}/><span>Activity</span></label>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <input 
                                    type="text" 
                                    value={newComment} 
                                    onChange={(e) => setNewComment(e.target.value)} 
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(e); }}
                                    placeholder="Write a comment..." 
                                    className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button type="button" onClick={handleAddComment} className="p-2 bg-indigo-600 rounded-lg hover:bg-indigo-700">
                                    <Send size={16}/>
                                </button>
                            </div>
                            <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar-thin">
                                {comments.map(comment => (
                                    <div key={comment.id} className="text-sm">
                                        <p className="font-semibold text-gray-300">{comment.authorEmail}</p>
                                        <p className="text-gray-400">{comment.text}</p>
                                        <p className="text-xs text-gray-500 mt-1">{comment.createdAt?.toDate().toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 mt-6 border-t border-gray-700">
          <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">{task && task.id ? 'Save Changes' : 'Add Task'}</button>
        </div>
      </form>
    </Modal>
  );
};
