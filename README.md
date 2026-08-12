# Riya P Ladwa — Full-Stack Developer Portfolio

Professional personal portfolio website demonstrating Computer Science Engineering foundations, practical web applications, and problem-solving focus in Java and Data Structures & Algorithms (DSA).

This project features a client-server architecture including a custom-styled user interface with staggered entrance animations, and a Node.js/Express API backend that persists contact submissions to a local database.

---

## 🛠️ Technologies & Skills

### Broad Skill Profile
* **Languages**: Java, Python, C++, JavaScript
* **Frontend**: HTML5, CSS3, JavaScript ES6+, React.js
* **Backend & APIs**: REST APIs, FastAPI, OpenAI API, Gemini API
* **Databases**: MongoDB, Supabase, SQL
* **Tools**: Git, GitHub, Vercel, Render, VS Code, Vite

### Project Stack (This Portfolio)
* **Frontend**: Vanilla HTML5, CSS3 (CSS Variables, Flexbox, CSS Grid, Fluid Clamp sizing), ES6+ JavaScript.
* **Framework / Bundler**: Vite
* **Backend**: Node.js, Express.js (REST API)
* **Database**: Local JSON storage (`data/messages.json`)

---

## 📁 Projects Featured

### 1. Guardian AI — Cybersecurity Platform
* **Role**: AI-Powered Cybersecurity & Threat Detection Platform
* **Description**: Guardian AI analyzes security logs, identifies potential threats, assesses risk, and assists with security response workflows.
* **Tech Stack**: React.js, TypeScript, Python, FastAPI, MongoDB, OpenAI API
* **Repository**: [github.com/riyaladwa/guardian-ai.git](https://github.com/riyaladwa/guardian-ai.git)

### 2. Civic Twin AI — Urban Simulation
* **Role**: AI-Powered City Digital Twin
* **Description**: Civic Twin AI uses digital-twin concepts, AI-powered predictions, simulations, and map-based visualization to help understand and monitor city-level problems.
* **Tech Stack**: React.js, JavaScript, Vite, Supabase, Google Maps, AI APIs
* **Repository**: [github.com/riyaladwa/civic-twin-ai.git](https://github.com/riyaladwa/civic-twin-ai.git)

### 3. Task Manager Pro — Productivity Tool
* **Role**: Full-Stack Productivity & Task Management Application
* **Description**: Task Manager Pro helps users organize, manage, and track tasks efficiently with full CRUD operations and real-time synchronization.
* **Tech Stack**: React.js, JavaScript, Node.js, Express.js, MongoDB, Supabase, Gemini API, CSS
* **Repository**: [github.com/riyaladwa/TaskPro-Manager.git](https://github.com/riyaladwa/TaskPro-Manager.git)

---

## 💡 Why I Built This

I developed this full-stack portfolio to:
* Present my technical skills in a clean, production-grade interface.
* Showcase practical, functional software applications.
* Document my software development and learning journey.
* Provide recruiters and collaborators with an authentic overview of my capabilities.

---

## 🖥️ Portfolio Features & Design

* **Staggered Animations**: Smooth wave-like reveals on load (`slideUpEntry`, `scaleUpEntry`, `photoEntrance`) using Gaussian blur transitions to focus text elements.
* **Portrait Presentation**: Houses my professional portrait frame featuring subtle accent shifts on hover.
* **Printable A4 Resume Layout**: Built-in print stylesheets (`@media print`) format the entire page as a clean single-page resume when saved as PDF or printed.
* **Interactive Contact Form**: Client-side field validations, submit button loading states, and direct Express API connection.
* **Local Persistence**: Serves contact requests and appends valid messages to local storage.
* **Responsiveness**: Modular fluid typography scales layout automatically across desktop, tablet, and mobile displays.

---

## 📁 Repository Structure

```text
portfolio/
├── data/
│   └── messages.json        # Database persistence layer (JSON Array)
├── public/
│   ├── images/
│   │   └── riya.jpeg        # Professional Portrait Photo
│   ├── favicon.svg
│   ├── icons.svg
│   └── resume.pdf           # Downloadable Resume PDF
├── src/
│   ├── main.js              # Client validation, staggers, and API fetch calls
│   └── style.css            # Responsive styles, project card visual mocks, and Print query
├── index.html               # Main markup document with preloads and metadata
├── package.json             # Build and execution script configuration
├── server.js                # Express API Backend & static server routing
└── vite.config.js           # API dev proxy routing
```

---

## 💻 Run Locally

Ensure you have **Node.js** and **npm** installed on your system.

### 1. Installation
Clone the repository and install dependency packages:
```bash
git clone https://github.com/riyaladwa/portfolio.git
cd portfolio
npm install
```

### 2. Launch Development Environment
Launch the concurrent developer environment:
```bash
npm run dev
```
* **Client Frontend (Vite)**: Ready on [http://localhost:5173/](http://localhost:5173/) (or `http://localhost:5174/`).
* **API Backend (Express)**: Live on port `3000`.

---

## 📦 Build & Production

### 1. Build Client Assets
Compile and bundle front-end files into `/dist`:
```bash
npm run build
```

### 2. Serve Static Production Output
Start the Express static server to host files on port `3000`:
```bash
npm start
```

---

## 🌐 Deployment

This portfolio is configured for deployment on **Vercel** or **Render**. Connect the GitHub repository directly to Vercel/Render, set the root directory to the project root, build command to `npm run build`, and run start to trigger compilation.

---

## 📈 Currently Learning

I am currently strengthening my skills in:
* Java (Language Foundations & Core Concepts)
* Data Structures & Algorithms (Problem solving, complexity optimization)
* Database Management Systems (DBMS)
* Web Development (Advanced frontend architectures)
* AI Application Development (Model chaining, Prompt engineering)

---
## 🤝 Connect With Me

* **GitHub**: [github.com/riyaladwa](https://github.com/riyaladwa)
* **LinkedIn**: [linkedin.com/in/riya-ladwa-b25275306](https://www.linkedin.com/in/riya-ladwa-b25275306)

