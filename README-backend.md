# AI-Mind: Backend & AI Services Documentation

## 1. Overview

Welcome to the backend and AI services documentation for the AI-Mind platform. This document provides a complete guide for developers working on the server-side logic, which is responsible for AI-powered analysis, data processing, and business logic.

The backend is built as a serverless architecture using **Genkit** and deployed within the **Next.js** framework. This modern approach allows for scalable, maintainable, and tightly integrated AI features. The backend's primary role is to expose secure, efficient functions (called "flows") that the frontend can call to perform complex tasks like analyzing patient speech, assessing gait from video, and generating clinical recommendations.

### Key Features:

-   **RESTful AI Flows**: Server-side functions that act like API endpoints for multi-modal analysis (speech, gait, clinical text).
-   **Serverless Architecture**: Built with Genkit, allowing for easy deployment and scaling without managing traditional server infrastructure.
-   **Multi-Modal AI Pipeline**: Integrates state-of-the-art Google AI models (like Gemini) to process diverse data types.
-   **Security & Type Safety**: Leverages TypeScript and Zod for robust input validation and type-safe data handling from end to end.
-   **HIPAA/Privacy Aware**: Designed with patient data privacy as a core principle, ensuring all processing is secure.

---

## 2. Technology Stack

The backend services are built with a modern, TypeScript-native stack designed for building production-ready AI applications.

| Technology         | Version  | Description                                                              |
| ------------------ | -------- | ------------------------------------------------------------------------ |
| **Next.js**        | `15.3.3`   | Provides the server environment for running Genkit flows via Server Actions. |
| **Genkit**         | `1.20.0`   | The core AI framework for defining, running, and monitoring AI flows.      |
| **TypeScript**     | `5.x`      | Ensures type safety for all server-side logic and data schemas.        |
| **Zod**            | `3.24.2`   | Used for defining and validating the input/output schemas for all AI flows. |
| **Google AI for Genkit** | `^1.20.0` | Plugin to integrate Google's Gemini family of models.                  |
| **Dotenv**         | `16.5.0`   | For managing environment variables, such as the `GEMINI_API_KEY`.          |

The backend runs in a Node.js environment, as provided by Next.js. A local Genkit development server is used for testing and debugging flows.

---

## 3. Project Structure

The backend logic is co-located within the main Next.js project structure, primarily residing in the `src/ai/` directory.

```
/
├── src/
│   ├── ai/                # Core directory for all AI and backend services
│   │   ├── flows/         # Contains all Genkit flow definitions
│   │   │   ├── analyze-gait-for-dementia-indicators.ts
│   │   │   ├── analyze-speech-for-dementia-indicators.ts
│   │   │   ├── generate-recommendations.ts
│   │   │   └── ... (other flow files)
│   │   ├── genkit.ts      # Genkit initialization and configuration
│   │   └── dev.ts         # Entry point for the local Genkit development server
│   ├── app/               # Next.js App Router (Frontend)
│   │   └── (pages)/       # Frontend pages that consume the AI flows
│   └── lib/
│       └── actions.ts     # Server Actions that might call backend logic
├── .env                   # Environment variables (GEMINI_API_KEY)
└── package.json           # Project dependencies
```

---

## 4. Setup Instructions

The backend setup is part of the main frontend application setup.

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
    Create a `.env` file in the project root and add your Google AI API key. This is required for Genkit to authenticate with the Gemini models.
    ```
    # .env
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```

5.  **Run the Next.js Development Server**:
    This server runs both the frontend and hosts the server-side environment for the AI flows.
    ```bash
    npm run dev
    ```

6.  **Run the Genkit Development Server** (for debugging):
    To inspect, run, and debug the AI flows independently, use the Genkit development UI. In a separate terminal, run:
    ```bash
    npm run genkit:watch
    ```
    Navigate to `http://localhost:4000` to view the Genkit developer UI.

7.  **Build for Production**:
    ```bash
    npm run build
    ```
    This command builds both the frontend and the server-side Genkit flows into an optimized production output.

---

## 5. API (Flow) Documentation

The backend exposes functions called "flows" that are consumed by the frontend, typically via Server Actions. These flows are strongly typed with Zod schemas for input and output.

### Flow: `analyzeSpeechForDementiaIndicators`
-   **File**: `src/ai/flows/analyze-speech-for-dementia-indicators.ts`
-   **Description**: Analyzes a provided audio file for linguistic and acoustic indicators of cognitive decline.
-   **Input Schema (`AnalyzeSpeechForDementiaIndicatorsInputSchema`)**:
    -   `audioDataUri` (string): Base64-encoded data URI of the patient's speech.
    -   `transcript` (string, optional): A pre-existing transcript.
-   **Output Schema (`AnalyzeSpeechForDementiaIndicatorsOutputSchema`)**:
    -   `linguistic_features`: Object detailing word-finding difficulty, repetition, etc.
    -   `acoustic_features`: Object with speech rate, pitch variability, etc.
    -   `risk_probability` (number): The AI-calculated probability (0-1) of dementia indicators.
    -   `confidence` (number): The model's confidence in its analysis.
    -   `key_indicators` (array of strings): A list of the most prominent observed indicators.

### Flow: `analyzeGaitForDementiaIndicators`
-   **File**: `src/ai/flows/analyze-gait-for-dementia-indicators.ts`
-   **Description**: Analyzes a video of a patient's gait to extract biomechanical metrics and assess risk.
-   **Input Schema**:
    -   `videoDataUri` (string): Base64-encoded data URI of the gait video.
-   **Output Schema**:
    -   `gait_speed`, `stride_length`, `cadence`, `gait_variability` (numbers).
    -   `risk_probability` (number): Probability of dementia indicators from gait.
    -   `confidence` (number): Model's confidence in the gait analysis.

*(Other flows like `generateRecommendations` and `generateInitialPatientSummary` follow a similar input/output pattern.)*

---

## 6. AI Model Implementation Details

The backend leverages the **Genkit framework** to orchestrate calls to powerful generative AI models provided by the Google AI platform.

### Text & Reasoning Pipeline
-   **Model**: `Gemini 2.5 Flash`
-   **Usage**: Used for all text-based reasoning tasks, such as:
    -   Summarizing clinical notes (`generateInitialPatientSummary`).
    -   Explaining the rationale behind a risk score (`explainRiskAssessmentRationale`).
    -   Generating clinical recommendations (`generateRecommendations`).
-   **Implementation**: A "prompt" is defined in Genkit with a Handlebars template and a Zod schema for the desired JSON output. Genkit handles the complexities of calling the model and coercing the output to the specified schema, ensuring reliable, structured data.

```typescript
// Example from src/ai/flows/generate-recommendations.ts

const prompt = ai.definePrompt({
  name: 'generateRecommendationsPrompt',
  input: {schema: GenerateRecommendationsInputSchema},
  output: {schema: GenerateRecommendationsOutputSchema}, // <-- Enforces JSON output
  prompt: `You are an expert medical AI assistant...
Analyze the following patient data:
{{{patientData}}}
...return the recommendations in the specified JSON format.`,
});

const generateRecommendationsFlow = ai.defineFlow({ ... },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
```

### Multi-Modal Analysis Pipeline (Speech & Gait)
-   **Model**: Gemini 2.5 Flash (capable of multi-modal input)
-   **Usage**: Analyzes audio and video data URI's passed directly into the prompt.
-   **Implementation**: Media is passed into the prompt context using the `{{media url=...}}` Handlebars helper. The model can "see" the video or "hear" the audio and extract the requested information, returning it in the structured JSON format defined by the output schema.

```typescript
// Example from src/ai/flows/analyze-gait-for-dementia-indicators.ts
const prompt = ai.definePrompt({
  // ...
  prompt: `You are an AI expert in biomechanics...
Analyze the provided video: {{media url=videoDataUri}}
...
Return your analysis in a structured JSON format.`,
});
```

### Performance
-   **Inference Time**: By using the efficient Gemini Flash model, most text-based flows complete in **<2 seconds**. Multi-modal flows take longer, typically in the range of **5-10 seconds**.
-   **Scalability**: The serverless nature of the Genkit/Next.js architecture means that the backend can scale automatically to handle fluctuating loads.

---

## 7. Database Integration

This project is currently architected to be stateless on the backend, using mock data on the frontend (`src/lib/data.ts`). However, it is designed for seamless integration with a database like **Firebase Firestore**.

### Proposed Firestore Schema
-   **`patients`**: Collection to store all patient records, matching the `Patient` type defined in `src/lib/types.ts`.
-   **`users`**: Collection for application users (providers, admins), including roles and permissions.
-   **`assessments`**: Collection to store the results of all speech and gait analyses, linked to a patient ID.

### Security Rules
-   When implemented, Firestore Security Rules would be used to enforce access control. For example, a healthcare provider should only be able to read data for patients assigned to them, while an admin might have broader access.

---

## 8. Security Features

-   **Input Validation**: All data passed to Genkit flows is rigorously validated against Zod schemas, preventing invalid or malicious data from reaching the AI models.
-   **Environment Variable Management**: Sensitive keys, like `GEMINI_API_KEY`, are managed via the `.env` file and are not exposed to the client-side, in accordance with best practices.
-   **CORS**: When deployed, Next.js and hosting platforms like Vercel provide sensible defaults for Cross-Origin Resource Sharing to prevent unauthorized domains from accessing the AI flows.
-   **Audit Logging**: While not yet implemented, a production system would include a logging service (e.g., a custom logger that writes to Firestore or a dedicated logging service) to track all flow invocations, inputs, and outputs for compliance and security monitoring.

---

## 9. Testing

-   **Unit/Integration Tests**: Genkit flows can be tested using standard frameworks like Jest. A test would involve importing the flow function, passing it mock input, and asserting that the output matches the expected schema and values.
-   **Flow Debugging**: The Genkit Developer UI (`npm run genkit:watch`) provides an essential tool for testing flows in isolation, inspecting inputs/outputs, and viewing traces of the model calls.

---

## 10. Deployment

-   **Provider**: The application is designed for easy deployment on modern hosting platforms that support Next.js, such as **Vercel** or **Firebase App Hosting**.
-   **Process**: A standard `git push` to a connected repository branch (e.g., `main`) would trigger an automatic build and deployment.
-   **Environment Variables**: The `GEMINI_API_KEY` must be configured in the deployment provider's dashboard to ensure the production environment has access to the Google AI services.

---

## 11. Troubleshooting

-   **`429 Too Many Requests`**: This error from the Gemini API typically means you have exceeded your rate limit. Check your usage on the Google AI Studio dashboard.
-   **Flow Fails with No Output**: Often caused by a mismatch between the AI model's output and the Zod schema. Use the Genkit Developer UI to inspect the raw model output and adjust your prompt or schema accordingly.
-   **Authentication Errors**: Ensure your `GEMINI_API_KEY` is correctly set in the `.env` file for local development and in the environment variables for your production deployment.

---

## 12. Contributing

-   **Branching**: Create a new feature branch for any new AI flow or modification (e.g., `feature/add-new-flow`).
-   **Flow Structure**: New flows should be created in their own file within `src/ai/flows/` and should export the main function and its input/output types.
-   **Code Reviews**: All new flows should be reviewed to ensure they have clear Zod schemas, well-defined prompts, and handle potential errors gracefully.
-   **Testing**: Before submitting a pull request, thoroughly test the flow using the Genkit Developer UI with a variety of inputs.
