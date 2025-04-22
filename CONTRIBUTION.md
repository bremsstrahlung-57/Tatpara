# **CONTRIBUTION.md**

## 🚀 **Project Setup Guide**

### **Prerequisites**
- Node.js (includes npm)

- Python 3.10+ (with pip)

- Any preferred code editor (we recommend VS Code)

- Git & GitHub account

## 🛠️**Local Development Setup**
1. Clone the Repository:
```bash
git clone https://github.com/bremsstrahlung-57/tatpara.git
cd tatpara
```
2. Frontend Setup (Vite + Tailwind):
```bash
npm install       # install dependencies
npm run dev       # run development server
```
For building & previewing:
```bash
npm run build     # build for production
npm run preview   # preview production build`\
```
3. Backend Setup (FastAPI + Groq API):
```bash
cd backend
python -m venv .venv
# activate virtual environment:
# For Windows:
.venv\Scripts\activate
# For Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload  # start backend server
```
Make sure your `.env` contains the required keys (e.g., Groq API key).

## 🧠 **Git Workflow & Contribution Guidelines**

### For Core Team Members & Open Source Contributors:
✅ Basic Rules:
- Always work on a separate branch (no direct commits to `main`/`master`).

- Commit messages should be clear: use concise, descriptive messages (e.g., `fix: add null check to XP counter`or `feat: guild chat UI`).

- Test before pushing. Especially if working with backend or stateful frontend logic.

### 🧩 **Git Commands Cheat Sheet**
**Set upstream** (for forks only):
```bash
git remote add upstream https://github.com/bremsstrahlung-57/tatpara.git
git fetch upstream
```
**Create a feature branch:**
```bash
git checkout -b feat/your-feature-name
```
**Push your branch:**
```bash
git push --set-upstream origin feat/your-feature-name
```
**Keep in sync with the main branch:**

If working from a **fork**:
```bash
git pull upstream main
```
If working on the main **repo**:
```bash
git pull origin main
```

### 🧪 **Submitting Your Work**

- Open a Pull Request when your feature is complete.

- Clearly explain what your PR does and why it matters.

- Mention related issues (if any) using GitHub keywords (e.g., `Closes #12`).

- For major changes, open an issue first and discuss it with the team before making the PR.

##🌟 **Pro Tips**
- Stay consistent with code style.

- Don’t commit secrets or .env files.

- Respect the fantasy RPG vibe—commit messages like slayed the goblin of broken CSS are totally valid (and encouraged).

*Happy questing, coder! You’re not just contributing—you’re shaping the fate of Tatpara.* 🧙‍♂️🧩