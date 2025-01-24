General Rules for Project Organization
1. Folder Structure Guidelines
Keep It Feature-Centric: Group files by feature or functionality to make the project easier to navigate and scale.
Example structure:


ether-app/
├── app/ (or src/)
│   ├── components/ (Reusable components)
│   ├── pages/ (Next.js pages)
│   ├── hooks/ (Custom hooks)
│   ├── utils/ (Utility functions)
│   ├── styles/ (Global and feature-specific styles)
│   └── api/ (Centralized API calls)
├── public/ (Static files like SVGs and images)
├── .env.local (Environment variables)
└── package.json (Dependencies and scripts)
Organize Components by Feature: Place all files related to a specific feature in a folder (e.g., Tasks, Projects).

2. Code Cleanliness
Use a Code Formatter: Enforce consistent formatting using tools like Prettier and ESLint.
Write Meaningful Comments: Add comments for non-obvious logic to make the code easier to understand and maintain.
Avoid Magic Numbers and Strings: Use constants for repeated values (e.g., STATUS_TODO = "To Do").
3. Reusability and DRY (Don’t Repeat Yourself)
Use shared components for repeated UI elements (e.g., buttons, modals).
Abstract repeated database calls into utility functions in a utils/ or api/ folder.
4. Commit Practices
Commit small, incremental changes.
Use clear commit messages:
Example: feat(tasks): add drag-and-drop functionality to Kanban board
Example: fix(auth): resolve login redirect issue
Rules Applied to Your Schema
1. app/ Directory
Follow Next.js conventions:

Use app/layout.tsx for defining the app-wide layout (e.g., sidebar, top bar).
Use app/page.tsx as the default home page (e.g., Dashboard).
Split pages into meaningful folders for features:
Copiar
Editar
app/
├── dashboard/
│   ├── page.tsx
├── projects/
│   ├── page.tsx
├── tasks/
│   ├── page.tsx
Use React Server Components where possible for faster performance (Next.js 13+).

2. public/ Directory
Store static assets like SVGs, images, and fonts in this folder.
Organize into subfolders if necessary:
arduino
Copiar
Editar
public/
├── icons/
├── images/
└── logos/
Use Next.js's <Image> component for optimized image handling.
**3. .env.local
Add all environment variables securely here:

makefile
Copiar
Editar
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
Avoid hardcoding sensitive information anywhere in your codebase.

Rule: Validate variables in a config.js file before using them:

javascript
Copiar
Editar
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Supabase environment variables are missing!");
}
4. General Rules for Files in Your Schema
For Components (app/components/)
Single Responsibility: Each component should handle one thing well (e.g., TaskCard displays a task).
Naming Convention: Use PascalCase for components (TaskCard, ProjectList).
Reusability: Place shared components (e.g., buttons, forms) in app/components/common/.
For Pages (app/pages/)
Keep pages feature-focused (e.g., Projects, Tasks).
Limit logic within pages; move reusable or complex logic into hooks or utils.
For Hooks (app/hooks/)
Store reusable custom React hooks here:
Example: useFetchTasks.ts for fetching task data.
Example: useAuth.ts for managing user authentication.
For Utilities (app/utils/)
Use this folder for helper functions and reusable logic:
Database calls: api.js
Data formatting: formatDate.js
Example:
javascript
Copiar
Editar
export async function fetchTasks() {
  const { data, error } = await supabase.from('Tasks').select('*');
  if (error) throw new Error(error.message);
  return data;
}
For Styles (app/styles/)
Use Tailwind CSS for styling.
Define custom styles in global CSS files or Tailwind’s extend section in tailwind.config.js.
Workflow-Specific Rules
Tackle Features Incrementally

Implement features one at a time:
Build the UI first (static version).
Connect the UI to Supabase (dynamic version).
Add real-time updates if necessary.
Follow the "Static to Dynamic" Rule

Always start with static data before connecting to Supabase.
Example:
Step 1: Hardcode tasks in the Kanban board.
Step 2: Fetch tasks from the database.
Step 3: Add real-time updates to sync tasks.
Real-Time Features

Only add real-time updates for critical features (e.g., tasks, notifications).
Use listeners carefully to avoid performance bottlenecks.
Testing and Debugging

Test each page after connecting it to the database.
Use browser dev tools and Supabase logs to debug errors.
Responsive Design

Use Tailwind’s responsive utilities (sm:, md:, lg:) to ensure the app works on all devices.
