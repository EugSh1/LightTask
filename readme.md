# LightTask

A **task management application** to simplify task organization and improve productivity. This app allows users to
create, manage, and categorize tasks with an intuitive and easy-to-use interface.

## Features

-   **User Authentication**: Secure login and account creation with JWT-based authentication.
-   **Task Management**:
    -   Create tasks within categories.
    -   Mark tasks as completed or incomplete.
    -   Delete tasks when no longer needed.
-   **Category Management**:
    -   Create, edit, rename and delete categories to organize tasks.
-   **Global Search**: Quickly find categories using a command palette.
-   **Dark Mode**: A stylish dark theme to reduce eye strain.

## Screenshots

![LightTask screenshot](screenshots.jpeg)

## Technologies Used

**Frontend:**

-   **React**: For building the user interface.
-   **Tailwind CSS**: For fast and modern styling.
-   **TypeScript**: For type safety and better development experience.
-   **Zustand**: For lightweight state management.
-   **Axios**: For HTTP requests.

**Backend:**

-   **Node.js**: For server-side runtime.
-   **Express.js**: For building a RESTful API.
-   **Prisma**: For database ORM.
-   **SQLite**: For lightweight and portable database storage.

**Testing:**

-   **Vitest**: For unit testing the backend logic.
-   **Supertest**: For testing HTTP endpoints.

## Usage

1. **Authentication**:
    - Register for an account or log in using your credentials.
2. **Task Management**:
    - Navigate to a category or "All tasks."
    - Add new tasks, mark them as completed, or delete them.
3. **Category Management**:
    - Use the sidebar to create and manage categories.
4. **Search**:
    - Press the search icon or use the global command palette to find tasks or categories.

## Made With

Front-end:

![Made with](https://skillicons.dev/icons?i=react,tailwindcss,typescript)

Back-end:

![Made with](https://skillicons.dev/icons?i=nodejs,expressjs,prisma,sqlite)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
