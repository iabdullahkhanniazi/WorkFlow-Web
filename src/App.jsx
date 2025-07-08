import React, { useState, useEffect } from 'react';
import { authService } from './services/authService';
import { LoginPage } from './components/LoginPage';
import { KanbanView } from './components/KanbanView';

const quillStyles = `
  .ql-editor { color: #e5e7eb; min-height: 150px; }
  .ql-toolbar { background-color: #4b5563; border-radius: 0.5rem 0.5rem 0 0; border-color: #374151 !important; }
  .ql-container { background-color: #374151; border-radius: 0 0 0.5rem 0.5rem; border-color: #374151 !important; }
  .ql-toolbar .ql-stroke { stroke: #d1d5db; }
  .ql-toolbar .ql-fill { fill: #d1d5db; }
  .ql-toolbar .ql-picker-label { color: #d1d5db; }
`;

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 text-white h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <style>{quillStyles}</style>
      {user ? <KanbanView user={user} /> : <LoginPage />}
    </>
  );
}
