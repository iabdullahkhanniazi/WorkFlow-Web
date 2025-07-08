import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, query, getDocs, doc, serverTimestamp, writeBatch, increment, orderBy } from 'firebase/firestore';

const getBasePath = (userId) => `users/${userId}`;

export const firestoreService = {
  // ... (all existing functions from initializeBoard to startTimer remain the same)

  initializeBoard: async (userId) => {
    const columnsRef = collection(db, getBasePath(userId), 'columns');
    const snapshot = await getDocs(columnsRef);
    if (snapshot.empty) {
      const batch = writeBatch(db);
      const defaultColumns = [
        { title: 'To Do', order: 0 },
        { title: 'In Progress', order: 1 },
        { title: 'Done', order: 2 }
      ];
      defaultColumns.forEach(col => {
        const newColRef = doc(columnsRef);
        batch.set(newColRef, col);
      });
      await batch.commit();
    }
  },

  onColumnsSnapshot: (userId, callback) => {
    const columnsQuery = query(collection(db, getBasePath(userId), 'columns'), orderBy('order'));
    return onSnapshot(columnsQuery, snapshot => {
      const fetchedColumns = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(fetchedColumns);
    });
  },

  onTasksSnapshot: (userId, callback) => {
    const tasksQuery = query(collection(db, getBasePath(userId), 'tasks'));
    return onSnapshot(tasksQuery, snapshot => {
      const tasksByColumn = {};
      snapshot.docs.forEach(doc => {
        const task = { id: doc.id, ...doc.data() };
        if (!tasksByColumn[task.columnId]) tasksByColumn[task.columnId] = [];
        tasksByColumn[task.columnId].push(task);
      });
      callback(tasksByColumn);
    });
  },

  addColumn: (userId, title, order) => {
    const columnsRef = collection(db, getBasePath(userId), 'columns');
    return addDoc(columnsRef, { title, order, createdAt: serverTimestamp() });
  },
  
  deleteColumn: (userId, columnId, tasksInColumn) => {
    const basePath = getBasePath(userId);
    const batch = writeBatch(db);
    tasksInColumn.forEach(task => batch.delete(doc(db, basePath, 'tasks', task.id)));
    batch.delete(doc(db, basePath, 'columns', columnId));
    return batch.commit();
  },

  addTask: (userId, taskData) => {
    const tasksRef = collection(db, getBasePath(userId), 'tasks');
    const newTaskData = { ...taskData, order: 0, timeTracked: 0, isTracking: false, lastStarted: null, createdAt: serverTimestamp() };
    return addDoc(tasksRef, newTaskData);
  },

  updateTask: (userId, taskId, taskData) => {
    const taskRef = doc(db, getBasePath(userId), 'tasks', taskId);
    return updateDoc(taskRef, taskData);
  },
  
  deleteTask: (userId, taskId) => {
    const taskRef = doc(db, getBasePath(userId), 'tasks', taskId);
    return deleteDoc(taskRef);
  },

  moveTask: (userId, taskId, newColumnId, newOrder) => {
    const taskRef = doc(db, getBasePath(userId), 'tasks', taskId);
    return updateDoc(taskRef, { columnId: newColumnId, order: newOrder });
  },

  reorderTasks: (userId, tasksToUpdate) => {
    const batch = writeBatch(db);
    tasksToUpdate.forEach(task => {
        const taskRef = doc(db, getBasePath(userId), 'tasks', task.id);
        batch.update(taskRef, { order: task.order });
    });
    return batch.commit();
  },

  reorderColumns: (userId, columnsToUpdate) => {
    const batch = writeBatch(db);
    columnsToUpdate.forEach(col => {
        const colRef = doc(db, getBasePath(userId), 'columns', col.id);
        batch.update(colRef, { order: col.order });
    });
    return batch.commit();
  },

  startTimer: (userId, taskId) => {
    const taskRef = doc(db, getBasePath(userId), 'tasks', taskId);
    return updateDoc(taskRef, { isTracking: true, lastStarted: serverTimestamp() });
  },

  stopTimer: (userId, taskId, elapsedSeconds) => {
    const taskRef = doc(db, getBasePath(userId), 'tasks', taskId);
    return updateDoc(taskRef, { isTracking: false, lastStarted: null, timeTracked: increment(elapsedSeconds) });
  },

  // --- NEW: Comment Management ---
  addComment: (userId, taskId, commentData) => {
    const commentsRef = collection(db, getBasePath(userId), 'tasks', taskId, 'comments');
    return addDoc(commentsRef, {
      ...commentData,
      createdAt: serverTimestamp()
    });
  },

  onCommentsSnapshot: (userId, taskId, callback) => {
    const commentsQuery = query(collection(db, getBasePath(userId), 'tasks', taskId, 'comments'), orderBy('createdAt', 'desc'));
    return onSnapshot(commentsQuery, snapshot => {
      const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(comments);
    });
  }
};
