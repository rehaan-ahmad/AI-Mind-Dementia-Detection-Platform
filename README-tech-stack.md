# AI-MIND: Technology Stack

This document provides a comprehensive overview of the technology stack used to build the AI-MIND platform. The stack was chosen to prioritize rapid development, scalability, type safety, and the seamless integration of modern AI and UI components.

---

## 1. Frontend

The frontend is a modern, server-first web application built for performance and maintainability.

| Technology          | Version | Description                                                                                          |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| **Next.js**         | `15.3.3`  | The core React framework, utilizing the App Router for server-centric architecture and routing.        |
| **React**           | `18.3.1`  | The fundamental library for building the component-based user interface.                               |
| **TypeScript**      | `~5.0`    | Provides static typing for the entire codebase, enhancing code quality and reducing runtime errors.    |
| **React Hook Form** | `7.54.2`  | Manages complex, multi-step forms with efficient state handling and validation.                        |
| **Zod**             | `3.24.2`  | A TypeScript-first schema declaration and validation library, used for form and API data validation.   |
| **date-fns**        | `3.6.0`   | A modern JavaScript date utility library for formatting and manipulating dates.                      |

---

## 2. Backend

The backend is a serverless architecture integrated directly within the Next.js framework, powered by Genkit for AI orchestration.

| Technology | Version | Description                                                                                             |
| ---------- | ------- | ------------------------------------------------------------------------------------------------------- |
| **Next.js**  | `15.3.3`  | Provides the server environment (via Node.js) for executing server-side logic and hosting Genkit flows. |
| **Genkit**   | `1.20.0`  | The core AI framework used to define, run, and monitor backend AI flows that perform complex analysis.  |
| **Node.js**  | `20.x`    | The underlying runtime environment for the Next.js server.                                              |

---

## 3. APIs

The application interacts with both server-side and browser-native APIs to deliver its features.

| API                          | Type          | Description                                                                                                                              |
| ---------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js Server Actions**   | Server-side   | Used as the primary mechanism for the frontend to securely call backend Genkit flows without needing to manually create API endpoints.       |
| **Web Audio API**            | Browser-native | Used in the `AudioRecorder` component to capture, process, and visualize microphone input in real-time for the speech assessment feature.    |
| **`getUserMedia`**           | Browser-native | A core browser API used to request access to and stream media from the user's microphone and camera for speech and gait assessments.        |

---

## 4. Database

The platform is architected for a modern, scalable NoSQL database, though the current implementation uses mock data for rapid prototyping.

| Technology         | Type    | Description                                                                                                                               |
| ------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Firebase Firestore** | NoSQL   | The designated production database. It's a highly scalable, real-time NoSQL database ideal for storing patient data, user profiles, and assessments. |
| **Mock Data Files**  | Static  | In the current version, patient data (`src/lib/data.ts`) and image placeholders (`src/lib/placeholder-images.json`) are hard-coded for development. |

---

## 5. AI Tools

The AI capabilities are powered by Google's latest models and orchestrated via the Genkit framework.

| Technology               | Version | Description                                                                                             |
| ------------------------ | ------- | ------------------------------------------------------------------------------------------------------- |
| **Genkit**               | `1.20.0`  | The primary framework for building, testing, and deploying the AI logic in a structured, serverless manner. |
| **`@genkit-ai/google-genai`** | `^1.20.0` | The official Genkit plugin for integrating with Google's generative AI models, including the Gemini family. |
| **Google AI - Gemini**   | `2.5-flash` | The specific model used for all generative tasks, including patient data summarization, rationale explanation, and multi-modal analysis. |

---

## 6. UI and Animation Tools

The user interface is built with a modern, utility-first component library that is both highly customizable and accessible.

| Technology                  | Version    | Description                                                                                                   |
| --------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| **Shadcn/UI**               | `n/a`      | A collection of beautifully designed, accessible, and composable UI components built on top of Radix UI and Tailwind CSS. |
| **Tailwind CSS**            | `3.4.1`    | A utility-first CSS framework that enables rapid and consistent styling directly within the markup.           |
| **`tailwindcss-animate`**   | `1.0.7`    | A Tailwind CSS plugin for creating animations, used for effects like accordion expansion.                       |
| **Recharts**                | `2.15.1`   | A composable charting library used to build all data visualizations, including the admin and results dashboards. |
| **Lucide React**            | `0.475.0`  | Provides the clean and lightweight icon set used throughout the application.                                  |
| **`next-themes`**           | `0.3.0`    | Enables the seamless light mode, dark mode, and system theme functionality.                                     |
| **`class-variance-authority`** | `0.7.1`    | A utility for creating type-safe and reusable component variants with different styles.                       |
| **`clsx` & `tailwind-merge`** | `~2.x`     | Helper libraries for conditionally joining and merging Tailwind CSS class names without conflicts.            |
