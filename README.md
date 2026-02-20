# Second Brain AI - Hedamo Assignment

Welcome to the Second Brain AI, built as part of the Altibbe/Hedamo Full-Stack Engineering Internship Assignment. 

This application is an intelligent knowledge management platform that captures, organizes, and intelligently surfaces knowledge via AI.

## Core Features

1. **Smart Dashboard**: A beautifully designed, filterable, and searchable UI to explore your knowledge base.
2. **Knowledge Capture**: Save links, notes, and insights. Uses the OpenAI SDK to auto-summarize and auto-tag content on creation.
3. **Conversational AI / Query**: Ask questions and chat directly with your Second Brain. The AI synthesizes answers using your stored context.
4. **Public Infrastructure API**: An exposed endpoint (`/api/public/brain/query`) to fetch JSON data for embedding the brain externally.

## UI/UX Highlights

- **Motion & Delight**: Utilizing `framer-motion` for buttery smooth layout transitions and micro-interactions on elements.
- **Visual Hierarchy**: Structured using Tailwind CSS with a clean, distraction-free custom design language inspired by modern productivity tools.
- **Portability**: All components are fully responsive and structured under `app/components/ui`, decoupling data from presentation.

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A local PostgreSQL instance or a remote database (e.g. Supabase, Neon).
- An OpenAI API Key (needed for Summarization, Auto-Tagging, and Querying).

### Installation

1. **Clone the repository and install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Database Setup**
   Ensure your PostgreSQL instance contains a database named `second_brain`. Inside it, create the `knowledge` table:
   \`\`\`bash
   CREATE TABLE knowledge (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     content TEXT NOT NULL,
     type VARCHAR(50) NOT NULL,
     tags TEXT,
     summary TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   \`\`\`

3. **Environment Setup**
   Create a `.env.local` file at the root of the project with the following configuration:
   \`\`\`env
   # Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/second_brain

   # OpenAI Key for AI features (Summarization, Auto-tag, Chat)
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`

4. **Run the Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`
   The app will start on [http://localhost:3000](http://localhost:3000).

---

## Documentation

Comprehensive architecture notes, interaction principles, and infrastructure design choices requested by the assignment can be found within the application by navigating to the **Architecture Docs** (`/docs`) page on the sidebar.
