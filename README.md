# Puesto de Campo Web

## 📖 Project Overview

Welcome to the **Puesto de Campo Web** repository. This project is a modern web application built to allow online shopping, and improve sales performance.

## 🎨 Design System

### Color Palette
The application uses a specific color scheme to ensure brand consistency.

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Primary** | `#3FA69D` | Main buttons, active states, headers (Teal) |
| **Secondary**| `#292E36` | Accents, highlights (Dark Grey) |
| **Background**| `#121417` | Page backgrounds (Charcoal) |
| **Surface** | `#1B1E24` | Cards, modals, sidebars (Light Charcoal) |
| **Text** | `#F0EFE9` | Primary text content (Cream) |
| **Accent** | `#D4A047` | Highlights, special actions (Gold) |

### Typography
- **Headings**: **Playfair Display** (Serif). Used for page titles and section headers.
- **Body**: **Lato** (Sans-serif). Used for primary text content.

## 🛠 Tech Stack

This project utilizes a modern, robust technology stack:

### Frontend
- **Framework**: React
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Query / TanStack Query (if applicable)

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Hosting**: Vercel

## 🗄 Database Implementation

### Connection
The application connects to the Supabase database using environment variables. Ensure these are set in your local `.env` file and in your deployment environment.

```env
VITE_SHEET_URL=your_google_seet_url
```

### Data Structure
*Briefly describe the core data models if necessary, e.g.:*
- **Users**: Stores user profile information.
- **Products**: Inventory items.
- **Orders**: Transaction records.

## 🚀 Deployment (Vercel)

To deploy this project on Vercel:

1.  **Push to GitHub**: Ensure your `main` branch is up to date.
2.  **Import Project in Vercel**:
    - Go to your Vercel Dashboard.
    - Click **Add New > Project**.
    - Select your GitHub repository.
3.  **Configure Build Settings**:
    - **Framework Preset**: Vite
    - **Root Directory**: `./` (default)
4.  **Environment Variables**:
    - Copy the variables from your `.env` file into the Vercel Environment Variables section.
5.  **Deploy**: Click **Deploy**. Vercel will build the project and provide a live URL.

## 🌿 Branching Strategy

We follow a structured workflow to ensure code quality:

- **`main`**: The production-ready branch. Deploys are triggered automatically when code is pushed here.
- **`develop`** (Optional): A staging branch for testing features before they go live.
- **`feature/feature-name`**: Created for specific tasks or new features.
- **`fix/bug-name`**: Created for resolving specific bugs.

**Workflow:**
1.  Create a new branch from `main` (or `develop`).
2.  Commit changes.
3.  Open a Pull Request (PR).
4.  Review and merge.

## 💻 Local Development

1.  **Clone the repo**:
    ```sh
    git clone <YOUR_GIT_URL>
    ```
2.  **Install dependencies**:
    ```sh
    npm install
    ```
3.  **Start development server**:
    ```sh
    npm run dev
    ```

