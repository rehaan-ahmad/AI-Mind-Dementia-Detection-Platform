
# AI-Mind: Admin Panel Documentation

## 1. Overview

Welcome to the Admin Panel documentation for the AI-Mind platform. This document provides a complete guide for developers and administrators responsible for system oversight, user management, and configuration.

The Admin Panel is a secure, role-protected section of the AI-Mind frontend application, designed to give administrators a centralized command center for monitoring system health, managing user access, and configuring application behavior. It is built with the same modern, responsive technology stack as the main application, ensuring a consistent and intuitive user experience.

### Key Modules:
-   **Dashboard**: A real-time overview of key performance indicators (KPIs), user activity, assessment analytics, and system health.
-   **User Management**: A planned module for comprehensive user lifecycle management, from registration to role assignment and permission control.
-   **System Settings**: A planned interface for configuring application-level settings, AI model parameters, security policies, and notification templates.
-   **Database Management**: A planned interface for browsing live data, managing backups, and monitoring database health.
-   **Audit Trail**: A planned system for logging and reviewing all critical user and system actions for security and compliance purposes.

---

## 2. Access and Authentication

Access to the Admin Panel is strictly limited to users with the `admin` role.

-   **Enabling Admin Mode**: In the current mocked environment, admin access is controlled by the `role` property in the `mockUser` object within `src/app/auth/auth-provider.tsx`. Setting `role: 'admin'` will make the "Admin Panel" link appear in the sidebar. In a production environment, this role would be assigned and verified via Firebase Authentication Custom Claims.
-   **Authentication Flow**: The application uses a context-based authentication provider (`src/app/auth/auth-provider.tsx`). When a user logs in, their role is checked, and the UI is dynamically updated to grant or deny access to administrative sections. All pages, including `/admin`, are protected by a layout component that redirects unauthenticated or unauthorized users.

---

## 3. Dashboard Features

The Admin Dashboard provides a high-level, at-a-glance view of the platform's status. The current implementation is a high-fidelity mock located at `src/app/admin/page.tsx`.

### Key Components:

1.  **System Overview Cards**:
    -   **Total Patients**: Displays the total number of patient records in the system.
    -   **Assessments Completed**: Shows the total volume of completed speech and gait assessments.
    -   **Average Risk Score**: A mock KPI representing the average dementia risk score across all patients.
    -   **System Uptime**: A mock status card indicating the operational health of the platform.

2.  **Assessment Analytics**:
    -   **Assessment Trends Chart**: A line chart (`src/components/assessment-trends-chart.tsx`) visualizes the daily volume of assessments completed over the last week. This component uses `recharts` to render the chart with static mock data.
    -   **Planned Visualizations**: The design anticipates future charts for risk category distribution (pie chart) and modality performance (bar chart).

3.  **Real-Time Activity Feed**:
    -   This section simulates a live feed of important events occurring within the platform.
    -   **Mocked Events**: The feed includes examples of new user registrations, completed assessments (with risk level badges), and system alerts (e.g., API performance warnings).
    -   **Future Implementation**: A production version would be powered by a WebSocket connection to a backend service that pushes events to the client in real time.

---

## 4. User Management (Planned)

The current admin page includes a placeholder card for User Management. The final implementation will be a full-fledged system for managing users and their permissions.

### Planned Features:

-   **User List UI**: A searchable and filterable data table displaying all registered users (patients, healthcare providers, admins).
-   **Bulk Actions**: Functionality to activate, deactivate, or delete multiple users at once.
-   **Profile Management**: A modal or dedicated page to view and edit user details, change roles, and inspect activity history.
-   **Role-Based Access Control (RBAC)**: A visual permission matrix to define and assign granular permissions to different roles.

### Backend Integration (Genkit):
The user management UI will interact with a set of Genkit flows (acting as secure API endpoints) to perform these actions. For example, a `updateUserRole` flow would be called to modify a user's custom claims in Firebase Authentication.

```typescript
// Example of a future Genkit flow for updating a user role
// This code does NOT currently exist in the project.
'use server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
// import { getAuth } from 'firebase-admin/auth'; // Using Firebase Admin SDK

const updateUserRoleFlow = ai.defineFlow({
  name: 'updateUserRoleFlow',
  inputSchema: z.object({ uid: z.string(), newRole: z.string() }),
  outputSchema: z.object({ success: z.boolean() }),
}, async ({ uid, newRole }) => {
  // await getAuth().setCustomUserClaims(uid, { role: newRole });
  return { success: true };
});
```

---

## 5. System Settings (Planned)

The placeholder card for "System Management" also covers the future System Settings module. This will be a tabbed interface allowing administrators to configure various aspects of the application.

### Planned Categories:

-   **Application**: System name, branding, default language, and maintenance mode toggles.
-   **AI Models**: Configuration for Genkit flow parameters, such as selecting the model version (`Gemini 2.5 Flash`, etc.), setting risk score thresholds, and tuning performance parameters like timeouts.
-   **Security**: Managing password policies, session timeouts, and other security-related configurations that would be enforced by Firebase and the application logic.
-   **Notifications**: Template management for email, SMS, and push notifications.

---

## 6. Database Management (Planned)

The admin panel will include a secure interface for direct interaction with the production database (Firestore).

### Planned Features:

-   **Data Browser**: A tool for admins to browse Firestore collections, view documents, and perform validated edits or deletions.
-   **Backup & Restore**: Functionality to trigger manual backups (using Firestore's export/import services) and restore from previous snapshots.
-   **Analytics**: Metrics on storage usage, document counts, and index performance, fetched from Google Cloud's monitoring services.

---

## 7. Audit Trail (Planned)

A comprehensive audit trail is critical for HIPAA compliance and security. The admin panel will feature a dedicated module for this.

### Planned Features:

-   **Activity Logging**: A backend service will log every significant action (user login, data access, admin change) to a dedicated `audit_logs` collection in Firestore.
-   **Log Viewer UI**: A searchable and filterable interface in the admin panel will allow administrators to review these logs.
-   **Real-time Streaming**: A WebSocket connection will provide a real-time view of audit events as they happen.

```typescript
// Example of a future AuditLogEntry type
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string; // The user who performed the action
  userEmail: string;
  action: string; // e.g., 'user_update', 'assessment_completed'
  resource: string; // e.g., 'patient', 'system_settings'
  resourceId?: string;
  details: Record<string, any>; // Changes made or data involved
  ipAddress: string;
  severity: 'info' | 'warning' | 'error';
}
```

---

## 8. Implementation Details

-   **React Components**: The Admin Panel is built using the same Shadcn/UI components as the rest of the application. Key components include:
    -   `src/app/admin/page.tsx`: The main page component for the dashboard.
    -   `src/components/ui/card.tsx`: Used for structuring dashboard widgets.
    -   `src/components/assessment-trends-chart.tsx`: The mock line chart component.
-   **Backend Logic**: All backend operations are handled by **Genkit flows** located in `src/ai/flows/`. In a production scenario, this directory would be expanded to include flows for user management, settings updates, and other administrative tasks.

---

## 9. Testing

-   **Component Tests**: The UI components of the Admin Panel are testable using Jest and React Testing Library, similar to other components in the app.
-   **End-to-End Tests**: A framework like Playwright or Cypress would be used to test the full admin workflow, from login to interacting with dashboard widgets.
-   **Flow Testing**: Genkit flows can be tested in isolation using the Genkit Developer UI (`npm run genkit:watch`), which allows for manually triggering flows and inspecting their inputs and outputs.

---

## 10. Security Considerations

-   **Admin-Only Access**: All admin-related pages and Genkit flows must be protected with role-based checks, ensuring only users with an `admin` claim can access them.
-   **Action Logging**: Every action taken within the admin panel (e.g., changing a setting, deleting a user) must be logged to the audit trail.
-   **Input Validation**: All data submitted from the admin panel to backend flows must be rigorously validated using Zod schemas to prevent invalid or malicious data.

---

## 11. Troubleshooting

-   **Permission Errors**: If you can't access the `/admin` page, ensure the mock user in `src/app/auth/auth-provider.tsx` has its `role` set to `'admin'`. In a real environment, this would involve checking the user's custom claims in Firebase.
-   **Chart Rendering Issues**: The `recharts` library can sometimes have issues with server-side rendering. The `AssessmentTrendsChart` component uses a `useEffect` hook to ensure it only renders on the client, which is a common pattern for fixing hydration errors with charting libraries.
