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
* **Framework**: Next.js 16 (App Router with Turbopack) & React 19
* **Styling & Motion**: Tailwind CSS v4, Framer Motion, Lenis Smooth Scroll, Lucide React
* **Backend & API**: Next.js API Routes (`app/api/contact/route.js`)
* **Database**: MongoDB Atlas Cluster (via official `mongodb` Node driver)
* **Email Service**: Nodemailer with Gmail SMTP Integration
* **Persistence Fallback**: Serverless file cache (`/tmp/messages.json`)

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

* **Staggered Animations**: Smooth wave-like reveals on load using Framer Motion and custom blur transitions.
* **Interactive Contact Form**: Real-time validation, dynamic submission feedback, direct connection to MongoDB Atlas and automated Gmail notifications.
* **Dual Persistence Layer**: Automatically writes submissions to MongoDB Atlas while keeping a `/tmp/messages.json` fallback.
* **Responsive Layout**: Designed for seamless viewing across mobile, tablet, and ultra-wide screens.
* **Smooth Scrolling**: Lenis physics-based inertial scrolling.

---

## 📁 Repository Structure

```text
portfolio/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.js     # Next.js API Route for contact submissions & SMTP trigger
│   ├── globals.css          # Tailwind CSS v4 styling & CSS variables
│   ├── layout.jsx           # Root layout with fonts, metadata, and smooth scroll
│   └── page.jsx             # Portfolio single-page layout composition
├── components/              # Modular UI components (Hero, About, Projects, Contact, etc.)
├── lib/
│   └── mongodb.js           # Reusable MongoDB Atlas connection pool
├── public/                  # Static assets (images, icons, resume.pdf)
├── .env.local               # Environment variables (MongoDB URI & Gmail SMTP)
├── package.json             # Next.js dependencies & scripts
└── next.config.js           # Next.js configuration
```

---

## 💻 Run Locally

Ensure you have **Node.js** (v18+) and **npm** installed on your system.

### 1. Installation
Clone the repository and install dependency packages:
```bash
git clone https://github.com/riyaladwa/portfolio.git
cd portfolio
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the project root:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=Cluster0
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_TO=recipient_email@gmail.com
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build & Production

### 1. Build Client Assets
Compile the optimized Next.js production build:
```bash
npm run build
```

### 2. Start Production Server
```bash
npm start
```

---

## 🌐 Deployment

This portfolio is optimized for deployment on **Vercel**:
1. Push your repository to GitHub.
2. Import the project into your Vercel Dashboard.
3. In **Settings > Environment Variables**, add:
   * `MONGODB_URI` (MongoDB Atlas connection string)
   * `EMAIL_TO` (Recipient address for portfolio inquiries, e.g. `riyaladwa9@gmail.com`)
   * For Gmail SMTP: `EMAIL_USER` & `EMAIL_PASS` (16-char Google App Password)
   * OR for Resend API: `RESEND_API_KEY` (and optionally `RESEND_FROM`)
4. Deploy! Next.js App Router and API routes will function as serverless edge/lambda handlers.

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

