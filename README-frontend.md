# AI-Mind: Frontend Documentation

## 1. Overview

Welcome to the frontend documentation for the AI-MIND platform. This document provides a complete guide for developers working on the client-side of the application, which is the primary interface for healthcare providers, patients, and administrators.

The frontend is a modern, server-first web application built with **Next.js 15 (App Router)** and **React**. It is designed to be a secure, responsive, and intuitive user interface for managing patients, conducting multi-modal assessments, and visualizing AI-driven results.

### Key Architectural Features:

-   **Role-Based Access Control (RBAC)**: The UI dynamically adapts based on the user's role (`healthcare_provider` or `admin`), showing or hiding relevant navigation items and pages.
-   **Server-First Components**: We leverage React Server Components (RSC) by default to improve performance, rendering much of the UI on the server and minimizing the client-side JavaScript bundle.
-   **Multi-Modal Assessment Interfaces**: Dedicated pages for conducting real-time speech and gait assessments using browser APIs (Web Audio API, `getUserMedia`).
-   **Interactive Dashboards**: Data-rich dashboards for providers (patient lists) and admins (system analytics) using `recharts` for data visualization.
-   **Responsive & Themeable Design**: Built with Shadcn/UI and Tailwind CSS, the application is fully responsive and supports both light and dark modes out of thethe-box.
-   **Integrated AI Workflows**: The frontend seamlessly calls server-side Genkit "flows" (via Next.js Server Actions) to perform complex tasks like analyzing speech, summarizing patient data, and generating recommendations.

---

## 2. Technology Stack

The frontend is built with a modern, production-ready stack that prioritizes developer experience, performance, and type safety.

| Technology      | Version    | Description                                                                 |
| --------------- | ---------- | --------------------------------------------------------------------------- |
| **Next.js**     | `15.3.3`     | The core React framework, using the App Router for routing and server components. |
| **React**       | `18.3.1`     | The fundamental UI library for building components.                         |
| **TypeScript**  | `5.x`      | Ensures type safety throughout the entire application.                    |
| **Shadcn/UI**   | `n/a`      | A collection of beautifully designed, accessible UI components.           |
| **Tailwind CSS**| `3.4.1`    | A utility-first CSS framework for rapid and consistent styling.             |
| **Recharts**    | `2.15.1`   | A composable charting library for building data visualizations.             |
| **Lucide React**| `0.475.0`  | Provides a comprehensive and lightweight icon set.                        |
| **Zod**         | `3.24.2`   | Used for schema validation, especially for forms (`react-hook-form`).       |
| **Genkit**      | `1.20.0`   | The AI framework used on the backend, consumed via Server Actions.          |

---

## 3. Project Structure

The frontend is co-located with the backend logic within a single Next.js project.

```
/
├── src/
│   ├── app/                 # Next.js App Router directory
│   │   ├── (main)/          # Route group for the main application layout
│   │   │   ├── dashboard/   # Patient dashboard page
│   │   │   ├── patients/    # Patient details, new patient form
│   │   │   ├── assessment/  # Speech and Gait assessment pages
│   │   │   ├── results/     # In-depth results dashboard
│   │   │   ├── admin/       # Admin dashboard page
│   │   │   └── layout.tsx   # Main application layout with sidebar and header
│   │   ├── login/           # Login page
│   │   ├── layout.tsx       # Root layout (includes AuthProvider)
│   │   └── page.tsx         # Landing page
│   ├── components/
│   │   ├── ui/              # Reusable Shadcn UI components (Button, Card, etc.)
│   │   ├── audio-recorder.tsx # Component for recording audio
│   │   ├── main-nav.tsx     # The main sidebar navigation
│   │   ├── patient-form.tsx # Multi-step form for adding a new patient
│   │   └── ... (other reusable components)
│   ├── hooks/
│   │   ├── use-toast.ts     # Custom hook for showing toast notifications
│   │   └── use-mobile.ts    # Custom hook for detecting mobile viewports
│   ├── lib/
│   │   ├── actions.ts       # Next.js Server Actions for form submissions
│   │   ├── data.ts          # Mock data for patients
│   │   ├── types.ts         # Core TypeScript types (Patient, TimelineEvent)
│   │   └── utils.ts         # Utility functions (e.g., cn for classnames)
│   └── ai/
│       └── flows/           # Backend Genkit flows consumed by the frontend
├── public/                  # Static assets (e.g., images, favicons)
└── tailwind.config.ts       # Tailwind CSS configuration
```

---

## 4. Setup Instructions

1.  **Prerequisites**:
    *   Node.js (v18.x or later)
    *   npm (v9.x or later)

2.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

3.  **Install Dependencies**:
    ```bash
    npm install
    ```

4.  **Environment Variables**:
    Create a `.env` file in the project root. This file is primarily for the backend Genkit flows to connect to the Google AI services.
    ```
    # .env
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```

5.  **Run the Development Server**:
    This single command starts the Next.js development server, which includes the frontend and the server-side environment for the AI flows.
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

6.  **Run the Genkit Inspector** (Optional but Recommended):
    To debug and test the AI flows in isolation, run the Genkit developer UI in a separate terminal.
    ```bash
    npm run genkit:watch
    ```
    Navigate to `http://localhost:4000` to inspect flows.

7.  **Build for Production**:
    ```bash
    npm run build
    ```
    This command compiles the Next.js application, including both frontend and backend code, into an optimized production-ready output.

---

## 5. Key Feature Implementation Details

### 5.1. Authentication and Authorization
-   **Mechanism**: Authentication is currently mocked in `src/app/auth/auth-provider.tsx`. It uses a React Context (`useAuth`) to manage the user's session state.
-   **Role-Based Access**: The `AuthProvider` defines a mock `user` object with a `role` property ('admin' or 'healthcare_provider'). The main navigation component (`src/components/main-nav.tsx`) reads this role to conditionally render the "Admin Panel" link.
-   **Protected Routes**: The root layout (`src/app/layout.tsx`) wraps the application in the `AuthProvider`. A custom `AppLayout` component checks if a user is logged in. If not, it redirects them to the `/login` page, effectively protecting all routes.

### 5.2. Speech Assessment
-   **Component**: `src/components/audio-recorder.tsx`
-   **Core API**: It uses the browser's **Web Audio API** (`navigator.mediaDevices.getUserMedia` and `MediaRecorder`) to capture audio from the user's microphone.
-   **Real-time Visualization**: The `AudioVisualizer` sub-component uses `AnalyserNode` to create a real-time waveform of the audio input, providing visual feedback to the user.
-   **Data Handling**: When the recording is complete, the audio is encoded as a `Blob` and then converted to a Base64 data URI. This URI is sent to the `analyzeSpeechForDementiaIndicators` Genkit flow for analysis.

### 5.3. Gait Assessment (Video-based)
-   **Component**: `src/app/assessment/gait/[id]/page.tsx`
-   **Core API**: It uses `navigator.mediaDevices.getUserMedia({ video: true })` to access the device's camera.
-   **Implementation**: A live video stream from the camera is rendered into a `<video>` element, allowing the provider to record the patient's gait. The current implementation is a mock and does not yet handle video recording or submission. A production version would use `MediaRecorder` to capture the video stream, similar to the audio recorder.

### 5.4. Results Dashboard & XAI
-   **Components**: `src/app/results/[id]/page.tsx`, `src/components/risk-factor-chart.tsx`.
-   **Visualization**: We use **Recharts** to create interactive charts that explain the AI's reasoning (Explainable AI). The `RiskFactorChart` (a bar chart) shows how different clinical and behavioral factors contribute to the overall risk score.
-   **Data Fetching**: This page uses React Server Components to fetch data from multiple AI flows (`generateRecommendations`) concurrently on the server, before the page is rendered. This improves performance by reducing client-side waterfalls.

---

## 6. Development Guidelines

-   **Code Style**: The project is configured with **ESLint** and **Prettier** to enforce a consistent code style. Run `npm run lint` to check for issues.
-   **Component Patterns**: We follow a feature-based structure. Reusable, generic components are in `src/components/ui`, while more complex, feature-specific components are at the root of `src/components` (e.g., `patient-form.tsx`). All components are written in TypeScript with clearly defined props interfaces.
-   **State Management**:
    -   **React Context**: Used for simple, global state like authentication (`useAuth`) and theme (`useTheme`).
    -   **`useState` / `useReducer`**: Used for local component state.
    -   **URL State**: Used for managing filters and sorting on the dashboard via query parameters.
-   **Testing**:
    -   **Jest & React Testing Library**: Used for unit and integration testing of components. Test files are co-located with their components (e.g., `audio-recorder.test.tsx`). Run tests with `npm test`.
    -   **Genkit Developer UI**: The primary tool for testing the backend AI flows.
-   **Error Handling & Loading States**:
    -   **Loading**: Use `Loader2` from `lucide-react` for spinners. For page-level loading, Next.js provides `loading.js` files. For components, Suspense boundaries should be used.
    -   **Errors**: Use the `useToast` hook to display user-friendly error messages. For critical errors, Next.js provides `error.js` files to create error boundaries.

---

## 7. Troubleshooting

-   **Hydration Errors**: These often occur when the server-rendered HTML differs from the initial client render. A common cause is using browser-only APIs (like `window` or `new Date()`) outside of a `useEffect` hook or rendering a `<div>` inside a `<p>`. Always ensure client-specific code runs after hydration.
-   **Permissions Issues (Mic/Camera)**: If the audio or video recorder fails, it's almost always because the user has denied browser permissions. The components include `Alert` popups to guide the user to their browser settings.
-   **Genkit Flow Errors**: If an AI analysis fails, use the Genkit Developer UI (`http://localhost:4000`) to inspect the flow's input, output, and any errors returned by the model. This is the most effective way to debug backend issues.

---

## 8. Deployment

-   **Hosting**: The application is designed for and deployed on **Firebase App Hosting**, which offers a seamless CI/CD pipeline and is optimized for Next.js applications.
-   **Process**: Connecting the GitHub repository to a Firebase App Hosting backend will enable automatic deployments on every push to the `main` branch.
-   **Environment Variables**: The `GEMINI_API_KEY` must be configured as a secret in the Firebase App Hosting dashboard for the production environment.

---

## 9. Contributing

-   **Branching**: Create a new feature branch from `main` for any new feature or bugfix (e.g., `feature/add-patient-search` or `fix/login-button-bug`).
-   **Pull Requests (PRs)**:
    -   Submit PRs against the `main` branch.
    -   Ensure all tests pass (`npm test`).
    -   Ensure the code is linted (`npm run lint`).
    -   Provide a clear description of the changes in the PR.
-   **Code Reviews**: All PRs require at least one approval from a maintainer before being merged.

---
