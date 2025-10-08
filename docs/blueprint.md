# **App Name**: AI-Mind Dementia Detection Platform

## Core Features:

- Multi-Modal Data Input: Allows upload and integration of various data types (MRI scans, cognitive test results, patient history).
- AI-Powered Dementia Detection: Utilizes AI to analyze patient data and provide a dementia risk assessment. The risk assessment is based on multiple inputs; reasoning performed by the tool uses available patient information to influence its final risk determination.
- Patient Data Management: Securely store and manage patient data using Firestore with necessary data privacy compliance for healthcare.
- Risk Visualization: Displays risk assessment results in an intuitive and easy-to-understand format, suitable for healthcare professionals.
- Flask Backend Integration: Connects the React frontend with a Python Flask backend for data processing and API functionalities.
- User Authentication and Authorization: Provides secure user authentication and role-based authorization (doctors, admins) using Firebase Authentication.
- Secure Data Storage: Use Firestore's built-in security rules to ensure data is only accessible to authorized personnel.

## Style Guidelines:

- Primary color: Light blue (#ADD8E6) for a calming and trustworthy feel, evoking a sense of health and well-being.
- Background color: Very light blue (#F0F8FF), almost white, to create a clean and professional interface.
- Accent color: Soft green (#90EE90) to highlight important information and actions, symbolizing growth and healing.
- Body and headline font: 'Inter', a sans-serif font for a modern and readable appearance.
- Use clear, universally understood icons from a library like Material Design Icons to represent various data types, actions, and patient statuses.
- Maintain a clean and intuitive layout with consistent spacing and alignment. Prioritize readability and easy navigation.
- Employ subtle animations for transitions and feedback to enhance user experience without distracting from the core functionality.