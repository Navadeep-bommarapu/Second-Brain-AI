# Second Brain AI: A Simple Overview

Welcome to my **Second Brain AI** project! I built this application to help capture, organize, and interact with knowledge effortlessly. 

This document explains what this app is, how all the different parts talk to each other, and how the "AI" actually works inside of it—all in plain English.

---

## 🗂️ Project Structure

Here is a simplified map of the project files to help you navigate:

### `app/` (The User Interface & Routes)
This folder controls what you see and the hidden paths the data takes.
- **`layout.tsx`**: The outer shell of the app. It contains the sidebar navigation on the left that shows up on every single page.
- **`page.tsx` (Dashboard)**: The main home screen. It connects to the database, fetches all your saved notes, and displays them as clean, white cards. It also has the search bar and filters.
- **`capture/page.tsx`**: The "New Note" screen. It has the form where you type in a title, choose a type (Note, Link, Insight), and paste your content.
- **`item/[id]/page.tsx`**: The detail view. If you click "Open" on a card in the dashboard, it brings you here to read the full note.
- **`docs/page.tsx`**: The page containing the core architectural principles.

### `app/components/` (The Building Blocks)
Instead of building a button from scratch every time, I built one `Button.tsx` and reuse it.
- **`CardChat.tsx`**: This is the chat window at the bottom of an open note where you can talk to the AI about that specific note.
- **`ItemActions.tsx` & `DeleteConfirmationModal.tsx`**: These control the edit and delete buttons, including the popup that asks "Are you sure?" before deleting a note.
- **`ui/` folder**: Contains basic, reusable Lego bricks like Buttons, Text Inputs, and Badges (the little colored tags).

### `app/api/` (The Hidden Messengers)
When you click "Save" on the website, the website can't talk directly to the database. It has to send a messenger. These files are the messengers.
- **`knowledge/route.ts`**: Handles saving new notes (`POST`) and fetching all notes (`GET`). **This is where the AI Magic happens during saving.** (More on this below).
- **`knowledge/[id]/route.ts`**: Handles updating (`PUT`) or deleting (`DELETE`) a specific single note.
- **`chat/route.ts`**: Handles the back-and-forth conversation when you are chatting with the AI.

### `lib/` (The Engine Room Tools)
- **`db.ts`**: This is the secure wire that connects the app to the PostgreSQL database.
- **`queries.ts`**: Contains the actual SQL commands (like telling the database "Delete item #5" or "Find all items with the tag 'react'").

---

## 🧠 The Big Picture (What is this?)

Imagine a digital notebook where you can dump your scattered thoughts, links, and ideas. Normally, you'd have to neatly organize these yourself with folders and tags, or they'd get lost forever. 

**Second Brain AI** does the organizing for you. When you save something, an AI reads it, summarizes it, and tags it automatically. Later, instead of just searching for keywords, you can "chat" with your notebook, and the AI will read through all your past notes to answer your questions.

---

## 🛠️ The Tools I Used (The Tech Stack)

Here are the main tools I used to build this, explained simply:

1. **Next.js (React):** This is the foundation of the website. It handles both what you see on the screen (the buttons, the text) and the "server" (the hidden engine room that processes data before sending it to the screen).
2. **Tailwind CSS:** This is my digital paintbrush. Instead of writing long files of design code, Tailwind lets me style buttons and cards quickly using simple keywords.
3. **PostgreSQL (Database):** Think of this as a highly organized Excel spreadsheet that lives in the cloud. Every note, link, or insight you save gets its own row in this spreadsheet.
4. **Vercel AI SDK:** This is a special toolkit that makes it incredibly easy for the website to talk to AI brains (like Google's Gemini).

---

## 🏗️ Architectural Principles

This app adheres to four core principles:

1. **Portable Architecture:** Built in separate layers (Frontend UI, Postgres Database, AI SDK). I can easily swap out the UI framework, database provider, or AI model without breaking the whole app.
2. **Principles-Based UX:** Designed for clear hierarchy, contextual motion (smooth, helpful animations), and "quiet AI" that works in the background without interrupting the user.
3. **Agent Thinking:** The app actively organizes itself by auto-summarizing and auto-tagging content upon creation, preventing it from becoming a chaotic dump of links.
4. **Infrastructure Mindset:** Includes an open `/api/public/brain/query` endpoint, allowing other widgets or websites to query this knowledge base externally.

---

## 🚀 Installation & Setup

Want to run this app yourself? Here is the step-by-step guide:

### Prerequisites
- Node.js (v18+ recommended)
- A local PostgreSQL instance or a remote database (e.g. Supabase, Neon)
- A Google Gemini API Key

### 1. Database Setup
Ensure your PostgreSQL instance contains a database named `second_brain`. Run this SQL query to create the table:
```sql
CREATE TABLE knowledge (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  tags TEXT,
  summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Environment Setup
Create a `.env.local` file at the root of the project:
```env
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/second_brain

# Gemini API Key for AI features (Summarization, Auto-tag, Chat)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```

### 3. Run the App
Install dependencies and strictly run the server:
```bash
npm install
npm run dev
```
The app will start on [http://localhost:3000](http://localhost:3000).
