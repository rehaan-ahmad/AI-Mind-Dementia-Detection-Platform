
# AI-Mind: Frontend Documentation

## 1. Overview

Welcome to the AI-Mind platform's frontend documentation. This document serves as a comprehensive guide for developers working on the user-facing application.

The AI-Mind frontend is a sophisticated, feature-rich web application built with **Next.js** and **React**. It provides a secure and intuitive user interface for healthcare professionals to manage patients, conduct AI-powered dementia risk assessments, and view detailed analytical results.

### Key Features:

-   **Role-Based Dashboards**: Tailored user experiences for healthcare providers and administrators.
-   **AI-Powered Assessments**: Seamless integration with Genkit flows for real-time speech and gait analysis.
-   **Data Visualization**: Interactive charts and visualizations for interpreting complex risk factors and assessment results.
-   **Patient Management**: A complete system for adding, viewing, and managing patient records.
-   **Responsive Design**: A modern, responsive interface built with Shadcn/UI and Tailwind CSS that works flawlessly on desktop and mobile devices.
-   **Light/Dark Modes**: A themeable UI with support for user-preferred light and dark modes.
-   **HIPAA/Privacy Aware**: Built with patient data privacy and security as a foremost consideration.

---

## 2. Technology Stack

The frontend is built with a modern, performant, and type-safe technology stack.

### Core Dependencies

| Technology         | Version | Description                                            |
| ------------------ | ------- | ------------------------------------------------------ |
| **Next.js**        | `15.3.3`  | React framework with App Router for server components. |
| **React**          | `18.3.1`  | Core library for building the user interface.          |
| **TypeScript**     | `5.x`     | For static typing and improved code quality.           |
| **Shadcn/UI**      | -       | A collection of reusable UI components.                |
| **Tailwind CSS**   | `3.4.1`   | A utility-first CSS framework for styling.             |
| **Genkit**         | `1.20.0`  | AI framework for building and running generative AI flows. |
| **Lucide React**   | `0.475.0` | Library for beautiful and consistent icons.          |
| **Recharts**       | `2.15.1`  | Composable charting library for data visualization.    |
| **Zod**            | `3.24.2`  | Schema validation for forms and API responses.         |
| **React Hook Form**| `7.54.2`  | Performant form management and validation.           |
| **Next-Themes**    | `0.3.0`   | For managing light and dark mode themes.               |

### Development Dependencies

| Technology           | Version | Description                               |
| -------------------- | ------- | ----------------------------------------- |
| **Jest**             | `29.7.0`  | Framework for running unit tests.         |
| **Testing Library**  | `16.0.0`  | Utilities for testing React components.   |
| **ESLint**           | -       | For code linting and style enforcement.   |

---

## 3. Project Structure

The project follows the standard Next.js App Router structure, which emphasizes server-first components and clear feature-based routing.

```
/
├── public/                # Static assets (images, etc.)
├── src/
│   ├── ai/                # Genkit AI Flows
│   │   └── flows/         # Specific AI flow definitions (e.g., speech analysis)
│   ├── app/               # Next.js App Router
│   │   ├── (pages)/         # Route groups for different sections
│   │   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── patients/
│   │   │   └── ...
│   │   ├── api/             # API route handlers (if any)
│   │   ├── auth/            # Authentication components and context
│   │   ├── globals.css      # Global styles and Tailwind directives
│   │   └── layout.tsx       # Root application layout
│   ├── components/        # Reusable React components
│   │   ├── ui/              # Shadcn-UI components (Button, Card, etc.)
│   │   └── *.tsx            # Custom application components (e.g., UserNav, PatientForm)
│   ├── hooks/             # Custom React hooks (e.g., useToast, use-mobile)
│   ├── lib/               # Shared utilities and libraries
│   │   ├── actions.ts       # Server Actions
│   │   ├── data.ts          # Mock data for demonstration
│   │   ├── types.ts         # TypeScript type definitions
│   │   └── utils.ts         # Utility functions (e.g., cn for classnames)
│   └── test-utils/        # Setup and utilities for testing
├── .env                   # Environment variables (must be configured)
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

---

## 4. Setup Instructions

Follow these steps to set up and run the project in a local development environment.

1.  **Prerequisites**:
    *   Node.js (v18.x or later)
    *   npm or yarn

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
    Create a `.env` file in the root of the project by copying the `.env.example` file. This file is required for integrating with services like Firebase.
    ```
    # .env
    NEXT_PUBLIC_FIREBASE_API_KEY="..."
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
    NEXT_PUBLIC_FIREBASE_APP_ID="..."

    GEMINI_API_KEY="..."
    ```
    *Note: Obtain these keys from your Firebase project settings and Google AI Studio.*

5.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

6.  **Run the Genkit Development Server** (for AI features):
    In a separate terminal, run:
    ```bash
    npm run genkit:watch
    ```
    This starts the Genkit development server, allowing you to test and iterate on AI flows.

7.  **Build for Production**:
    To create an optimized production build:
    ```bash
    npm run build
    ```

---

## 5. Key Feature Implementation

### Authentication Flow
-   **Provider**: Authentication is managed via `src/app/auth/auth-provider.tsx`, which uses React Context to provide user session data throughout the application.
-   **Mocked Login**: For demonstration purposes, the login flow is mocked in `src/app/login/page.tsx` and does not require a live Firebase connection.
-   **Protected Routes**: The root layout (`src/app/layout.tsx`) checks for an authenticated user and automatically redirects to the login page if a session is not found, effectively protecting all routes.

### Speech Recording Component (`AudioRecorder`)
The `AudioRecorder` component in `src/components/audio-recorder.tsx` is a key part of the assessment process.
-   **Web Audio API**: It uses `navigator.mediaDevices.getUserMedia` to request microphone access and the `MediaRecorder` API to capture audio.
-   **Real-time Waveform**: A visualizer is included to provide real-time feedback during recording, implemented using the `AnalyserNode` and HTML `Canvas`.
-   **State Management**: It handles various states like `idle`, `recording`, `paused`, and `review`, providing a complete user workflow from recording to submission.

```typescript
// Sample hook usage within the AudioRecorder
React.useEffect(() => {
  async function getMicPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000 } });
      mediaStreamRef.current = stream;
      setHasMicPermission(true);
    } catch (error) {
      // Handle permission denial
    }
  }
  getMicPermission();
}, []);
```

### Gait Data Collection
The gait assessment page (`src/app/assessment/gait/[id]/page.tsx`) uses the device's camera to record video.
-   **Camera Access**: It uses `navigator.mediaDevices.getUserMedia({ video: true })` to access the device's camera.
-   **Video Processing**: The captured video stream is intended to be sent to an AI model for analysis of gait parameters. In the current version, this is handled by a mocked AI flow.

### Results Dashboard
-   **Charts**: The dashboard at `src/app/results/[id]/page.tsx` uses `recharts` to display complex data in an understandable format.
-   **XAI Visualizations**: Components like `RiskFactorChart` help explain the AI's risk assessment by breaking down the contributing factors.
-   **Dynamic Content**: The page fetches AI-generated summaries and recommendations, showcasing the integration between the UI and the backend AI services.

---

## 6. Development Guidelines

### Code Style
-   The project uses **ESLint** and **Prettier** for code formatting and quality. Please run `npm run lint` before committing to ensure your code adheres to the project's standards.

### Component Patterns
-   **Atomic Design Principles**: Components are organized logically. Reusable, low-level components (e.g., `Button`, `Card`) are in `src/components/ui`, while more complex, feature-specific components (`PatientForm`) are at the top level of `src/components`.
-   **TypeScript Interfaces**: All props and data structures are strongly typed using TypeScript, primarily defined in `src/lib/types.ts`.

### State Management
-   **React Context**: For global state like authentication (`useAuth`) and theme (`next-themes`), we use React's built-in Context API.
-   **Component State**: For local UI state, we prefer `useState` and `useReducer` to keep components self-contained.

### Testing
-   **Unit Tests**: The project is configured with **Jest** and **React Testing Library**. Test files are co-located with the components they test (e.g., `audio-recorder.test.tsx`). Run tests with `npm test`.
-   **Coverage**: The goal is to maintain a high level of test coverage. Run `npm run test:coverage` to generate a coverage report.

### Error Handling & Loading States
-   **Loading**: Use skeletons or spinners (`Loader2` icon) to indicate loading states during data fetching or AI processing.
-   **Errors**: Display user-friendly error messages using `Alert` components and provide feedback for failed operations via `Toast` notifications.

---

## 7. Troubleshooting

-   **CORS Errors**: If you encounter CORS issues when calling AI flows, ensure the `Access-Control-Allow-Origin` header is correctly configured on your backend or that you are proxying requests through the Next.js development server.
-   **Firebase Config Issues**: "Firebase: Error (auth/invalid-api-key)" usually means the `.env` file is missing or contains incorrect values. Double-check your Firebase project configuration.
-   **Mobile Permissions**: Camera and microphone access can be tricky on mobile devices. Ensure your application is served over HTTPS (even in development, e.g., using `ngrok`), as browsers require a secure context for these APIs.

---

## 8. Deployment

The application is designed for easy deployment on modern hosting platforms that support Next.js.

### Firebase Hosting
1.  **Install Firebase CLI**: `npm install -g firebase-tools`
2.  **Login**: `firebase login`
3.  **Initialize**: `firebase init hosting` (Connect to your Firebase project).
4.  **Build**: `npm run build`
5.  **Deploy**: `firebase deploy --only hosting`

### Environment Variables
-   For any deployment provider, you must configure the environment variables (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`, `GEMINI_API_KEY`) in the provider's dashboard. Do not commit these secrets to your repository.

---

## 9. Contributing

We welcome contributions! Please follow these guidelines:

-   **Feature Branches**: Create a new branch for each feature or bug fix (`feature/my-new-feature` or `fix/login-bug`).
-   **Pull Requests (PRs)**:
    -   Submit PRs against the `develop` branch.
    -   Ensure all tests pass (`npm test`).
    -   Ensure the code is linted (`npm run lint`).
    -   Provide a clear description of the changes in your PR.
-   **Code Reviews**: All PRs require at least one approval from a maintainer before being merged.

Thank you for contributing to the AI-Mind platform!
