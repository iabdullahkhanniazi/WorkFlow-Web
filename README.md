# TaskFlow

## _Your Personal Command Center for Tasks_

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TaskFlow is a cloud-enabled, mobile-ready, real-time-syncing, React-powered HTML5 task management application.

- Create columns for your workflow
- Add tasks with rich details
- Drag and drop to manage your progress
- ✨ It all syncs instantly ✨

## Features

- **Dual-View Interface:** Switch between a Kanban Board and a full-page Calendar view.
- **Rich Task Management:** Add descriptions, checklists, priorities, cover images, and due dates.
- **Drag & Drop:** Reorder tasks within columns and move columns themselves.
- **Time Tracking:** A built-in, pausable timer for every task.
- **Secure Authentication:** User registration and login using Firebase.
- **Dark/Light Mode:** A beautiful and functional UI in your preferred theme.

TaskFlow is designed to be a clean and intuitive tool for organizing your work. The goal is to provide a seamless and visually pleasing user experience, making task management less of a chore.

## Tech Stack

TaskFlow uses a number of open-source projects to work properly:

- [React] - A JavaScript library for building user interfaces!
- [Vite] - Next Generation Frontend Tooling.
- [Firebase] - A comprehensive app development platform for the backend.
- [Tailwind CSS] - A utility-first CSS framework for rapid UI development.
- [React Quill] - A powerful rich text editor for React.
- [Lucide] - Beautiful & consistent icons.
- [node.js] - We all need it to run our dev environment.

And of course, TaskFlow itself is open source with a [public repository][dill]
on GitHub.

## Installation

TaskFlow requires [Node.js](https://nodejs.org/) v18+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd workflow
npm install
npm run dev

You will also need to set up your own Firebase project and add your API keys to a .env.local file as described in the project setup.

Deployment
This application is configured for easy deployment to GitHub Pages.

Configure the homepage in package.json and base in vite.config.js.

Run the deployment script:

npm run deploy

Set your GitHub repository's Pages source to the gh-pages branch.

License
MIT

Free Software, Hell Yeah!
```
