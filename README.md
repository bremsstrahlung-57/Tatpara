# Tatpara

RPG-Style Habit Builder

## Prerequisites

- [Node.js](https://nodejs.org/en/) (which includes npm) 
- Any preferred package manager of your choice 

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/bremsstrahlung-57/tatpara.git
   cd tatpara
   ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the development server:**
    ```bash
    npm run dev
    ```

- (After done coding)
4. **Build for production:**
    ```bash
    npm run build
    ```

4. **Preview production build:**
    ```sh
    npm run preview
    ```
**Git Workflow & Contributing**

For team members and contributors, please follow these guidelines:

- **Clone the repository**: Simply clone if you're a team member.

- **Set Upstream Remote** (for forked repos):

    If you've forked the repo, add the original as an upstream remote:
    ```bash
    git remote add upstream https://github.com/bremsstrahlung-57/tatpara.git
    git fetch upstream
    ```
- **Create a new branch for each feature or bug fix:**
    ```bash
    git checkout -b feature/your-feature-name
    ```
- **Push your branch and set the upstream:**
    ```bash
    git push --set-upstream origin feature/your-feature-name
    ```
- **Keep your branch updated with the main branch:** 

    If you're working on a fork:
    ```bash
    git pull upstream master
    ```
    If you're working directly from the main repository:
    ```bash
    git pull origin master
    ```
- **Open a pull request:**

    Once your feature is complete, open a pull request and include a clear description of your changes. For major changes, please discuss them by opening an issue first.


**Happy coding! ^_^** 