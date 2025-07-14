# CookBook

## Overview

CookBook is a modern and intuitive Full Stack application designed to help users manage their recipes efficiently. It allows users to create, view, update, and delete recipes, as well as organize their favorite dishes. The application also includes user authentication features to provide a personalized experience.

## Features

* **Recipe Management:**
    * `createRecipe`: Add new recipes to your collection.
    * `deleteRecipe`: Remove unwanted recipes.
    * `getAllRecipes`: Browse all available recipes.
    * `getUserRecipes`: View recipes you've created.
    * `getRecipeById`: Access detailed information for a specific recipe.
    * `updateRecipe`: Modify existing recipe details.
* **Favorites System:**
    * `addToFavorites`: Mark recipes as favorites for quick access.
    * `removeFromFavorites`: Unmark recipes from your favorites.
    * `getFavoriteRecipes`: View all your favorited recipes.
* **User Authentication:**
    * `registerUser`: Create a new user account.
    * `login`: Log in to your existing account.
    * `logoutUser`: Securely log out.
    * `getCurrentUser`: Retrieve current user's details.
* **Rich Text Editing for Recipe Details:**
    * Utilizes **Tiptap** for a robust and user-friendly content editor, allowing for rich text formatting (bold, italic, underline, strike, code, lists, headings, links) in recipe descriptions and instructions.
* **Responsive Design:** (Assumed based on common frontend practices and Tailwind CSS usage)

---

## Technologies Used

This project is built using a modern JavaScript stack, leveraging powerful libraries and tools:

* **Frontend Framework:** [React](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **State Management & Data Fetching:**
    * [@tanstack/react-query](https://tanstack.com/query/latest/docs/react/overview): For efficient data fetching, caching, and synchronization.
    * [axios](https://axios-http.com/): Promise-based HTTP client for the browser and Node.js.
* **Routing:** [react-router-dom](https://reactrouter.com/en/main)
* **Forms:** [react-hook-form](https://react-hook-form.com/)
* **UI/Styling:**
    * [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework.
    * [autoprefixer](https://github.com/postcss/autoprefixer), [postcss](https://postcss.org/): For CSS processing.
* **Rich Text Editor:**
    * [@tiptap/react](https://tiptap.dev/): Headless rich text editor for React.
    * [@tiptap/starter-kit](https://tiptap.dev/api/extensions/starter-kit), [@tiptap/extension-link](https://tiptap.dev/api/extensions/link), [@tiptap/extension-underline](https://tiptap.dev/api/extensions/underline): Tiptap extensions for common formatting.
* **Icons:** [lucide-react](https://lucide.dev/icons/)
* **Notifications:** [react-hot-toast](https://react-hot-toast.com/)
* **Code Linting:** [ESLint](https://eslint.org/)

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* **Node.js**: Ensure you have Node.js (version 18 or higher recommended) installed.
    * You can download it from [nodejs.org](https://nodejs.org/).
* **npm** or **Yarn**: Node Package Manager (npm) usually comes with Node.js. Yarn can be installed separately.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/NikhilSharma-007/cookbook_frontend.git](https://github.com/NikhilSharma-007/cookbook_frontend.git)
    ```
2.  **Navigate into the project directory:**
    ```bash
    cd cookbook_frontend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Application

To run the development server:

```bash
npm run dev
# or
yarn dev
