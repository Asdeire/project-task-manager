# Project & Task Manager (Vue 3 SPA)

A Single Page Application (SPA) for managing projects and their associated tasks, developed as a technical assessment for a Frontend Developer position.

🔗 **[Live Demo on Vercel](https://project-task-manager-indol.vercel.app/)**

---

## 🛠 Tech Stack

- **Framework:** Vue.js 3 (Composition API)  
- **Language:** TypeScript  
- **State Management:** Pinia (with LocalStorage synchronization)  
- **HTTP Client:** Axios (with a custom Mock API adapter for production)  
- **Styling:** SCSS  
- **Drag-and-Drop:** VueDraggable Next  

---

## ✨ Key Features

- **Project Management (CRUD):** Create, read, update, and delete projects.  
- **Task Management (CRUD):** Add, edit, and delete tasks within specific projects.  
- **Interactive Data Tables:**
  - Sort by columns.
  - Filter data by text and status.
  - Custom column resizing (drag to resize).
  - Responsive text wrapping and truncation for optimal UI.
- **Kanban Board:** A dedicated view for tasks featuring drag-and-drop to easily change task statuses and reorder them.  
- **Data Persistence:** Global state is deeply synced with `LocalStorage` so users never lose their data upon page refresh. Saved preferences include table sorting and active filters.  
- **UI/UX Enhancements:**
  - Global toast notification system for user feedback.
  - Dashboard statistics showing task distribution by status.
  - Seamless switching between Table and Kanban views.

---

## 🚀 Local Development Setup

To run this project locally, you need Node.js installed on your machine.

1. **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd project-task-manager
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Start the local mock API (JSON Server):**  
   Open a terminal and run the database server. It will watch `db.json` and run on port `3001`.
    ```bash
    npm run server
    ```

4. **Start the Vite development server:**  
   Open a second terminal window/tab and run:
    ```bash
    npm run dev
    ```
   The application will be available at [http://localhost:5173](http://localhost:5173).

---

## 📦 Deployment Process

This project is deployed on Vercel.

To meet the requirement of functioning correctly without a local backend (while maintaining full CRUD capabilities and state persistence), a special approach was used for production:

- **Mock API via Axios Interceptors:**  
  In the production environment (`import.meta.env.PROD`), Axios is configured with an interceptor that acts as an in-browser backend. It intercepts HTTP requests, simulates network latency, and performs full CRUD operations directly against the browser's `LocalStorage`.

- **Routing:**  
  A `vercel.json` file is included to rewrite all incoming traffic to `index.html`, ensuring Vue Router handles SPA navigation flawlessly without triggering 404 errors on direct URL visits or page reloads.
