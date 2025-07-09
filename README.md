TaskFlow: A Modern Task Management Application
TaskFlow is a feature-rich, web-based task management application inspired by services like Trello, Asana, and Jira. It provides a clean, Kanban-style interface for users to manage their projects and workflows efficiently. Built with React and Firebase, it offers real-time data synchronization, multiple views, and a polished user experience with both dark and light themes.

Live Demo
(Link to your deployed GitHub Pages site will go here)

Features
Secure User Authentication:

User registration and login with Email/Password.

User profile creation with display name and photo URL.

Secure session management with Firebase Authentication.

Dual-View Interface:

Kanban Board View: A classic drag-and-drop interface to move tasks between customizable columns.

Calendar View: A full-page calendar to visualize tasks by their due dates, with priority filters and weekend highlighting.

Advanced Task Management:

Create, edit, and delete tasks in a comprehensive detail modal.

Rich Text Descriptions: Use a WYSIWYG editor for detailed descriptions with formatting.

Cover Images: Add banner images to tasks for visual context.

Priority Levels: Assign Low, Medium, or High priority, visualized with colored badges and icons.

Due Dates & Times: Set specific deadlines with a datetime-local picker.

Time Tracking: A built-in timer for each task to track time spent, with start/pause functionality.

Checklists: Break down tasks into smaller, manageable sub-items with a progress bar.

Comments & Activity: Add comments to tasks to collaborate and track progress.

Interactive UI/UX:

Dark/Light Mode Toggle: Switch between themes for user comfort.

Inline Editing: Click to edit due dates and priorities directly in the task detail view.

Drag-and-Drop: Reorder both tasks within columns and the columns themselves.

Real-time Updates: All changes are instantly synced across sessions using Firebase Firestore.

Protected Columns: The default "To Do", "In Progress", and "Done" columns are protected from deletion.

Data Reset: A secure option for users to reset their board to the default state.

Tech Stack
Frontend: React.js, Vite

Styling: Tailwind CSS (with Dark Mode)

Backend & Database: Firebase (Authentication, Firestore)

Icons: Lucide React

Rich Text Editor: React Quill

Getting Started
Follow these instructions to get a copy of the project up and running on your local machine.

Prerequisites
Node.js (v20.x or higher recommended)

npm (comes with Node.js)

A Google account for Firebase

1. Clone the Repository
git clone [https://github.com/your-username/workflow.git](https://github.com/your-username/workflow.git)
cd workflow

2. Install Dependencies
npm install

3. Set Up Firebase & Secure API Keys
This is the most important step for security. Your secret keys should never be committed to GitHub.

Create a Firebase Project: Go to the Firebase Console and create a new project.

Register a Web App: In your project's settings, register a new web app and copy the firebaseConfig object.

Create an Environment File: In the root folder of your project, create a new file named .env.local.

Add Your Keys: Paste your Firebase config values into .env.local. Vite requires that these keys be prefixed with VITE_.

# .env.local
VITE_API_KEY="AIza..."
VITE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_PROJECT_ID="your-project-id"
VITE_STORAGE_BUCKET="your-project.appspot.com"
VITE_MESSAGING_SENDER_ID="..."
VITE_APP_ID="..."

Configure firebase.js: Make sure your src/firebase.js file loads these variables. It should already be set up this way.

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  // ...etc
};

Enable Firebase Services:

In the Firebase Console, go to Authentication -> Sign-in method and enable Email/Password.

Go to Firestore Database, create a database, and in the Rules tab, paste the following rules and publish:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

4. Run the App Locally
npm run dev

Deployment to GitHub Pages
Install gh-pages:

npm install gh-pages --save-dev

Configure package.json: Add a "homepage" property and the "predeploy" and "deploy" scripts.

{
  "name": "workflow",
  "homepage": "[https://iabdullahkhanniazi.github.io/workflow](https://iabdullahkhanniazi.github.io/workflow)",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist",
    // ...
  },
  // ...
}

Configure vite.config.js: Add the base property.

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/workflow/', // Your repository name
  plugins: [react()],
})

Deploy:

npm run deploy

Configure GitHub Settings:

In your GitHub repository settings, go to Pages.

Set the Source to Deploy from a branch.

Set the Branch to gh-pages with the / (root) folder.

Save and wait a few minutes for the site to go live.
