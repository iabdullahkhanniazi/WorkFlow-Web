# TaskFlow Board - Task Management App

TaskFlow is a modern, web-based task management application inspired by services like Trello and Asana. It provides a clean, Kanban-style interface for users to manage their projects and workflows efficiently. Built with React and Firebase, it offers real-time data synchronization and a rich user experience.

## Features

- **User Authentication:** Secure user registration and login using Firebase Authentication (Email/Password).
- **Kanban Board:** A drag-and-drop interface to move tasks between customizable columns.
- **Task Management:** Create, edit, and delete tasks with a feature-rich modal.
- **Rich Text Descriptions:** A WYSIWYG editor (`react-quill`) for detailed task descriptions with formatting options.
- **Task Priority:** Assign Low, Medium, or High priority to tasks, displayed with colored badges.
- **Due Dates & Times:** Set specific deadlines for tasks, with visual indicators for overdue items and remaining time.
- **Time Tracking:** A built-in timer for each task to track the time spent, which is saved automatically.
- **Real-time Database:** All changes are instantly synced across sessions using Firebase Firestore.
- **Domain-Driven Design:** The codebase is structured with a clear separation of concerns, separating UI components from business logic and data services.

## Tech Stack

- **Frontend:** React.js, Vite
- **Styling:** Tailwind CSS
- **Backend & Database:** Firebase (Authentication, Firestore)
- **Icons:** Lucide React
- **Rich Text Editor:** React Quill

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or higher recommended)
- `npm` (usually comes with Node.js)
- A Firebase account

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/taskflow-react-app.git](https://github.com/your-username/taskflow-react-app.git)
    cd taskflow-react-app
    ```

2.  **Install NPM packages:**

    ```bash
    npm install
    ```

3.  **Set up Firebase Environment Variables:**

    - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    - In your project, go to **Project settings** > **General** and register a new web app.
    - Copy the `firebaseConfig` object.
    - In the root of your project, create a new file named `.env.local`.
    - Add your Firebase config values to the `.env.local` file. **Important:** Vite requires environment variables to be prefixed with `VITE_`.
      ```
      VITE_API_KEY="AIza..."
      VITE_AUTH_DOMAIN="your-project.firebaseapp.com"
      VITE_PROJECT_ID="your-project-id"
      VITE_STORAGE_BUCKET="your-project.appspot.com"
      VITE_MESSAGING_SENDER_ID="..."
      VITE_APP_ID="..."
      ```
    - Create a new file `src/firebase.js` and use the environment variables to initialize Firebase:

      ```javascript
      // src/firebase.js
      import { initializeApp } from "firebase/app";
      import { getAuth } from "firebase/auth";
      import { getFirestore } from "firebase/firestore";

      const firebaseConfig = {
        apiKey: import.meta.env.VITE_API_KEY,
        authDomain: import.meta.env.VITE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_APP_ID,
      };

      const app = initializeApp(firebaseConfig);
      export const auth = getAuth(app);
      export const db = getFirestore(app);
      ```

    - **Security:** The `.env.local` file is automatically ignored by Git in a Vite project, so your keys will not be uploaded to GitHub.

4.  **Configure Firebase Services:**

    - In the Firebase Console, go to **Authentication** > **Sign-in method** and enable **Email/Password**.
    - Go to **Firestore Database**, create a database, and in the **Rules** tab, paste the following rules:
      ```
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /artifacts/{appId}/users/{userId}/{allPaths=**} {
            allow read, write: if request.auth != null && request.auth.uid == userId;
          }
        }
      }
      ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

## Project Structure

The project follows a Domain-Driven Design approach to keep the code organized and maintainable.

src/
├── components/ # UI components
│ ├── kanban/ # Components specific to the Kanban board
│ ├── shared/ # Reusable components (e.g., Modal)
│ └── LoginPage.jsx # The main login/signup page
│ └── KanbanView.jsx# The main view for the Kanban board
├── services/ # Business logic and data access
│ ├── authService.js # Handles all authentication logic
│ └── firestoreService.js # Handles all Firestore database interactions
├── App.jsx # Main component, acts as a router
├── firebase.js # Firebase configuration and initialization
└── ...

This structure separates the "how" (services) from the "what" (components), making the code easier to test, debug, and scale.
