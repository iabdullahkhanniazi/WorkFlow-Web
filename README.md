# TaskFlow
## _Your Personal Command Center for Tasks_

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TaskFlow is a cloud-enabled, mobile-ready, real-time-syncing, React-powered HTML5 task management application. It is designed to be a clean and intuitive tool for organizing your work, providing a seamless and visually pleasing user experience that makes task management less of a chore and more of a streamlined process.

-   Create columns for your workflow
-   Add tasks with rich details
-   Drag and drop to manage your progress
-   ✨ It all syncs instantly ✨

## Features

* **Secure User Authentication:**
    * User registration and login with Email/Password.
    * User profile creation with display name and photo URL.
    * Secure session management with Firebase Authentication.

* **Dual-View Interface:**
    * **Kanban Board View:** A classic drag-and-drop interface to move tasks between customizable columns.
    * **Calendar View:** A full-page calendar to visualize tasks by their due dates, with priority filters and weekend highlighting.

* **Advanced Task Management:**
    * Create, edit, and delete tasks in a comprehensive detail modal.
    * **Rich Text Descriptions:** Use a WYSIWYG editor for detailed descriptions with formatting.
    * **Cover Images:** Add banner images to tasks for visual context.
    * **Priority Levels:** Assign Low, Medium, or High priority, visualized with colored badges and icons.
    * **Due Dates & Times:** Set specific deadlines with a `datetime-local` picker.
    * **Time Tracking:** A built-in timer for each task to track time spent, with start/pause functionality.
    * **Checklists:** Break down tasks into smaller, manageable sub-items with a progress bar.
    * **Comments & Activity:** Add comments to tasks to collaborate and track progress.

* **Interactive UI/UX:**
    * **Dark/Light Mode Toggle:** Switch between themes for user comfort.
    * **Inline Editing:** Click to edit due dates and priorities directly in the task detail view.
    * **Drag-and-Drop:** Reorder both tasks within columns and the columns themselves.
    * **Real-time Updates:** All changes are instantly synced across sessions using Firebase Firestore.
    * **Protected Columns:** The default "To Do", "In Progress", and "Done" columns are protected from deletion.
    * **Data Reset:** A secure option for users to reset their board to the default state.

## Tech Stack

TaskFlow uses a number of open-source projects to work properly:

-   [React] - A JavaScript library for building user interfaces!
-   [Vite] - Next Generation Frontend Tooling.
-   [Firebase] - A comprehensive app development platform for the backend.
-   [Tailwind CSS] - A utility-first CSS framework for rapid UI development.
-   [React Quill] - A powerful rich text editor for React.
-   [Lucide] - Beautiful & consistent icons.
-   [node.js] - We all need it to run our dev environment.

And of course, TaskFlow itself is open source with a [public repository][dill]
on GitHub.

## Installation

TaskFlow requires [Node.js](https://nodejs.org/) v18+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd workflow
npm install
npm run dev
```

You will also need to set up your own Firebase project and add your API keys to a `.env.local` file as described in the project setup.

## Deployment

This application is configured for easy deployment to **GitHub Pages**.

1. Configure the `homepage` in `package.json` and `base` in `vite.config.js`.

2. Run the deployment script:

   ```sh
   npm run deploy
   ```

3. Set your GitHub repository's Pages source to the `gh-pages` branch.

## Environment Variables and Security

**This is the most important step for security.** Your secret Firebase API keys should never be committed to a public GitHub repository. This project uses a `.env.local` file to manage these keys securely.

1.  **Create the File:** In the root folder of your project, create a new file named exactly `.env.local`.

2.  **Add Your Keys:** Paste your Firebase config values into this file. **Vite requires that all environment variables be prefixed with `VITE_`**.

    ```
    # .env.local
    VITE_API_KEY="AIza..."
    VITE_AUTH_DOMAIN="your-project.firebaseapp.com"
    VITE_PROJECT_ID="your-project-id"
    VITE_STORAGE_BUCKET="your-project.appspot.com"
    VITE_MESSAGING_SENDER_ID="..."
    VITE_APP_ID="..."
    ```

3.  **How it Works:** The `firebase.js` file is configured to read these variables. The `.env.local` file itself is listed in `.gitignore`, which means Git will never track it or upload it to GitHub. This keeps your secret keys safe on your local machine while allowing the code to be shared publicly.

## License

MIT

**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job.)

[dill]: <https://github.com/iabdullahkhanniazi/workflow>
[React]: <https://react.dev/>
[Vite]: <https://vitejs.dev/>
[Firebase]: <https://firebase.google.com/>
[Tailwind CSS]: <https://tailwindcss.com/>
[React Quill]: <https://github.com/zenoamaro/react-quill>
[Lucide]: <https://lucide.dev/>
[node.js]: <http://nodejs.org>
