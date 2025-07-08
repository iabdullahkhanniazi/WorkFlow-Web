import React, { useState, useEffect } from 'react';
import { authService } from './services/authService';
import { LoginPage } from './components/LoginPage';
import { KanbanView } from './components/KanbanView';

const quillStyles = `
  /* Light Mode Quill Styles */
  .light .ql-editor { color: #111827; }
  .light .ql-toolbar { background-color: #f3f4f6; border-color: #d1d5db !important; }
  .light .ql-container { background-color: #f9fafb; border-color: #d1d5db !important; }
  .light .ql-toolbar .ql-stroke { stroke: #4b5563; }
  .light .ql-toolbar .ql-fill { fill: #4b5563; }
  .light .ql-toolbar .ql-picker-label { color: #4b5563; }

  /* Dark Mode Quill Styles */
  .dark .ql-editor { color: #e5e7eb; }
  .dark .ql-toolbar { background-color: #4b5563; border-color: #374151 !important; }
  .dark .ql-container { background-color: #374151; border-color: #374151 !important; }
  .dark .ql-toolbar .ql-stroke { stroke: #d1d5db; }
  .dark .ql-toolbar .ql-fill { fill: #d1d5db; }
  .dark .ql-toolbar .ql-picker-label { color: #d1d5db; }
`;

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = authService.onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 h-screen flex items-center justify-center">
        <p className="text-gray-900 dark:text-white">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <style>{quillStyles}</style>
      <div className={theme}>
        {user ? <KanbanView user={user} theme={theme} setTheme={setTheme} /> : <LoginPage />}
      </div>
    </>
  );
}
