# ⚡ GitPulse — AI-Powered Developer Content Generator

GitPulse turns your GitHub activity into professional, ready-to-review social media content.

It analyzes commits, pull requests, repositories, and programming activity, then uses AI to transform that activity into platform-specific posts for **LinkedIn, Instagram, Facebook, and X/Twitter**.

GitPulse is designed around a **human-review-first workflow** — generated content is reviewed and edited before publishing.

## 🌐 Live Demo

**[ai-post-generater.vercel.app](https://ai-post-generater.vercel.app/)**

## ✨ Features

- 🐙 GitHub activity analysis
- 🤖 AI-powered post generation
- 💼 LinkedIn-ready content
- 📸 Instagram-ready content
- 📘 Facebook-ready content
- 𝕏 X/Twitter-ready content
- 📝 Review and edit generated drafts
- 🔐 User authentication
- 🗄️ MongoDB-backed data
- 👤 GitHub OAuth support
- 📊 Developer activity summaries
- ⚡ Next.js App Router architecture
- 🎨 Responsive Tailwind CSS interface

## 🔄 How It Works

```text
GitHub Activity
      │
      ▼
GitHub REST API
      │
      ▼
Activity Analysis
      │
      ▼
AI Content Generation
      │
      ▼
Platform-Specific Draft
      │
      ▼
Review → Edit → Copy
```

GitPulse collects relevant GitHub activity and summarizes it before sending the information to the AI generation layer.

The generated content is then adapted for different social platforms while keeping the content grounded in the user's actual development activity.

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- Tailwind CSS
- JavaScript

### Backend

- Next.js App Router
- API Routes
- GitHub REST API

### AI

- Anthropic SDK
- Claude

### Database & Authentication

- MongoDB
- GitHub OAuth
- HttpOnly sessions
- bcrypt

### Deployment

- Vercel

## 📂 Project Structure

```text
app/
├── api/
│   ├── github-activity/
│   ├── generate-post/
│   └── auth/
│
components/
├── ...
│
lib/
├── github.js
├── generatePost.js
└── ...

models/
├── ...
│
public/
└── ...
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AkmalDoghar/AI-Post-Generator.git
```

### 2. Navigate to the project

```bash
cd AI-Post-Generator
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env.local` file based on `.env.example`.

Required configuration includes:

```env
GITHUB_TOKEN=
GITHUB_USERNAME=
ANTHROPIC_API_KEY=
MONGODB_URI=
AUTH_SECRET=
AUTH_URL=
AUTH_GITHUB_CALLBACK_URL=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

Never commit real API keys or secrets to the repository.

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 🎯 Project Purpose

GitPulse was built to solve a practical developer-content problem: turning everyday coding activity into useful professional content without manually writing every post from scratch.

The project combines:

- GitHub API integration
- AI content generation
- Authentication
- Database integration
- Platform-specific content formatting
- Human-in-the-loop review

## 🔮 Future Improvements

Possible future improvements include:

- Scheduled content generation
- Direct LinkedIn publishing
- Facebook and Instagram integrations
- X/Twitter publishing
- Generated visual/stat cards
- Post analytics
- Engagement tracking
- Multi-user workspace support
- Automated weekly developer summaries

## 👨‍💻 Developer

**Muhammad Akmal**

- 🌐 Portfolio: [akmalcode.vercel.app](https://akmalcode.vercel.app/)
- 💼 LinkedIn: [Muhammad Akmal](https://www.linkedin.com/in/muhammad-akmal-dev/)
- 🐙 GitHub: [AkmalDoghar](https://github.com/AkmalDoghar)

---

⭐ If you find GitPulse interesting, consider giving the repository a star.
