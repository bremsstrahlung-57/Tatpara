![github-submission-banner](https://github.com/user-attachments/assets/a1493b84-e4e2-456e-a791-ce35ee2bcf2f)

# 🚀 Project Title

> Tatpara: Become the chosen one... by doing the dishes.

---

## 📌 Problem Statement

**Problem Statement 9: Build the Ultimate Digital Habit Builder**

---

## 🎯 Objective

You ever open a productivity app, stare at your tasks, and immediately dissociate? Yeah, same. Tatpara is here to rescue your attention span from the shadow realm.

We’re not just solving productivity—we’re straight-up gaslighting your brain into thinking doing laundry is part of a heroic quest. This is for students, dreamers, overthinkers, underachievers, and anyone who's ever added a task after doing it just to feel something.

Tatpara turns your to-do list into a full-blown RPG. You do tasks → you get XP → the story unfolds → you feel like a legend for finally cleaning your room. Every checkbox you tick? That’s character development, baby. Every skipped task? The villain grows stronger. Your focus timer? Literal spell-casting. Your habit streak? Lore canon now.

Basically, it’s productivity with plot twists. Because adulting is hard—but being the chosen one? That hits different.

---

## 🧠 Team & Approach

### Team Name:

`Eye of Ra`

### Team Members:

- [Sagar Sharma](https://github.com/bremsstrahlung-57)
- [Vedansh Rai](https://github.com/Mr-Underdog)
- [Lavanya Saini](https://github.com/Lavan08-op)

### Your Approach:

- **Why we chose this problem**:

    Because let’s be honest—building habits and staying productive in this attention-deficit multiverse is hella hard. Most of us have tried 5 different productivity apps, only to abandon them after 3 days and spiral back into YouTube shorts. We wanted to create something that actually feels fun to use. Something that tricks our goblin brains into doing things that are good for us—like brushing teeth or studying for that exam we’ve been dodging.

- **Key challenges we addressed**:

    - Making habit-building feel less like a spreadsheet and more like a quest from Skyrim.

    - Keeping users engaged after the initial dopamine rush dies.
    
    - Blending productivity features (focus timer, tasks, habit streaks) with a legit story that evolves with progress.

    - Designing an experience that rewards consistency without shaming you for messing up (because mental health >>> hustle culture).

- **Pivots, brainstorms, breakthroughs**:

    At first, it was just “get XP for tasks.” Cool idea. But then the ✨brain blast✨ hit: What if there’s a whole fantasy world behind this? A story that only reveals itself as you level up IRL? That’s when Tatpara became more than just a tracker—it became an interactive saga.
    Also, we debated giving the user a pet goblin companion, but... scope creep said no (for now 👀).

---

## 🛠️ Tech Stack

### Core Technologies Used:

- **Frontend**:
Built using Vite with vanilla JavaScript. Tailwind and CSS handles the styling.

- **Backend**:
FastAPI for creating API calls.

- **Database**:
No dedicated database. We're using localStorage to manage user data like task progress, XP, and unlocked story content.

- **APIs**:
We used Groq API to have some motivational quotes through FastAPI.

- **Hosting**:
Frontend deployed through [Netlify](https://www.netlify.com/) and backend is rendered by [Render](https://render.com/).



### Sponsor Technologies Used (if any):

- [✅] **Groq:** Our in-game "AI Sensei" that drops motivational gems and life hacks like a digital monk. FastAPI talks to Groq to keep players inspired between tasks.

---

## ✨ Key Features

- **Habit Tracking with XP Rewards**:
Track your daily tasks and earn XP for completing them. The more you do, the stronger you get, just like a real RPG character!

- **Story Progression**:
Unlock a unique, evolving storyline as you level up by completing tasks. Your personal quest grows with you, revealing new chapters and twists.

- **Focus Timer**:
Use the built-in focus timer to boost productivity. Set your focus periods and dive into tasks, gamifying the process to keep you engaged and on track.

- **Task Management**:
Organize and manage your daily tasks easily. Categorize them by priority and see your progress in real-time as you complete them, earning rewards along the way.

- **Wise Mentor Quotes (Powered by AI)**: 
Your digital sensei serves up motivational quotes and life lessons as you level up.


Add images, GIFs, or screenshots if helpful!

---

## 📽️ Demo & Deliverables

- **Demo Video Link:** [Paste YouTube or Loom link here]
- **Pitch Deck / PPT Link:** [Paste Google Slides / PDF link here]

---

## ✅ Tasks & Bonus Checklist

- [✅] **All members of the team completed the mandatory task - Followed at least 2 of our social channels and filled the form**
- [ ] **All members of the team completed Bonus Task 1 - Sharing of Badges and filled the form (2 points)**
- [ ] **All members of the team completed Bonus Task 2 - Signing up for Sprint.dev and filled the form (3 points)**

---

## 🧪 How to Run the Project

### Requirements:

- Node.js (version 16 or higher)

- Vite (for frontend build tool)

- Tailwind CSS (installed via PostCSS)

- Git (for version control and cloning the repo)

- FastAPI (Python Library)

- Groq (For quotes)

### Local Setup:

```bash
# Clone the repo
git clone https://github.com/bremsstrahlung-57/tatpara

# Install dependencies
cd tatpara
npm install

# For python backend
cd backend
python -m venv .venv # make a virtual enviroment
.venv\Scripts\activate # windows
source .venv/bin/activate #linux
pip install -r requirements.txt


# Start development server
npm run dev

# For python backend
uvicorn main:app --reload
```

---

## 🧬 Future Scope

- 🗣️ **Guild & World Chat**:
Add a community feature where users can chat, join guilds, and interact with others on their journey. Create a space to motivate and share tips with fellow habit-builders.
- 🔙 **Backend for Cross-Device Data Syncing**:
Implement a backend to securely save user data across multiple devices. This ensures that progress and achievements sync seamlessly, whether you're on desktop or mobile.
- 🎮 **Expanded Game Mechanics**:
Introduce additional RPG mechanics like side quests, achievements, or boss fights that unlock as users progress in real life. Gamify habits even further to boost engagement.
- 🌐 **Localization / Broader Accessibility**:
Localize the app into multiple languages to reach a global audience. Improve accessibility with support for screen readers, high contrast modes, and keyboard navigation for a broader user base.

---

## 📎 Resources / Credits

- [Toastify-JS](https://apvarun.github.io/toastify-js/) — toast notifications that slap.
- [Flaticons](https://www.flaticon.com/) — icons with ✨personality✨.
- [Groq API](https://groq.com) — for generating AI-powered life advice, motivational quotes, and reminding us to hydrate.
- [ChatGPT (OpenAI)](https://openai.com/chatgpt) — for brainstorming plot twists, writing prompts, and keeping us sane during merge conflicts.
- [Claude (Anthropic)](https://www.anthropic.com/index/claude) — for refining our ideas, polishing our text, and being the chill AI friend who always vibes with your vision.

---

## 🏁 Final Words

Building Tatpara was nothing short of an adventure in itself. From brainstorming the idea to staying up late debugging (who needs sleep, right?), this hackathon taught us the importance of iteration, creativity, and teamwork.

**Challenges:**

The hardest part was definitely balancing between making the app fun and functional. We wanted it to be more than just a task manager, so blending RPG mechanics with habit-building took a lot of tweaking and testing. The focus timer feature, in particular, needed a bit of extra magic to keep it engaging.

**Learnings:**

Aside from the usual tech stack hacks, we learned the value of simple design. Sometimes, the most straightforward ideas lead to the most fun experiences. And hey, React and Tailwind were life-savers—shoutout to modern frontend tooling for making life easier.

**Fun Moments:**

The best part? Turning our daily tasks into epic quests. Seriously, when you unlock a new story chapter for finally doing your laundry, it feels like you’ve defeated a dragon. Also, brainstorming the “guild chat” feature was a highlight—we almost went off the rails with ridiculous ideas, but hey, it made the project even more unique.

**Shout-Outs**:

[Yashasvi Tiwari](https://www.linkedin.com/in/yashasvi-tiwari-2308702ab?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app ) for helping us creating our Project logo.

Massive shout-out to the hackathon organizers for creating a platform where we could bring ideas to life. And to the team—couldn’t have asked for better collaborators. You guys are the true heroes of this story.

Looking forward to taking this project to the next level, making it a fully immersive experience, and maybe even getting a pet goblin companion in the future.

---
