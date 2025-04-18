# DevBook Frontend

The **DevBook Frontend** is a React-based web application that allows users to manage their developer bookmarks. It provides features such as user authentication, bookmark creation, editing, filtering, and organization using categories and tags.

---

## Features

### **Authentication**

-   User signup with email verification.
-   Login with email and password.
-   Forgot password with reset functionality.
-   OAuth integration (e.g., Google).
-   Protected routes for authenticated users.

### **Bookmark Management**

-   Create, view, update, and delete bookmarks.
-   Add categories and tags to bookmarks.
-   Filter bookmarks by categories, tags, and search terms.
-   Sort bookmarks by title or creation date.
-   Mark bookmarks as public or private.

### **User Dashboard**

-   View all bookmarks in a paginated format.
-   Search, filter, and sort bookmarks.
-   Manage categories and tags.

---

## Tech Stack

### **Frontend**

-   **React.js**: Component-based UI library.
-   **React Router**: For routing and navigation.
-   **Axios**: For making API requests.
-   **React Icons**: For icons used in the UI.
-   **React Toastify**: For notifications and alerts.
-   **Tailwind CSS**: For styling and responsive design.

---

## Project Structure

```
frontend/
├── public/                     # Static files
├── src/
│   ├── components/             # React components
│   │   ├── CreateBookmark.jsx  # Component for creating bookmarks
│   │   ├── EditBookmark.jsx    # Component for editing bookmarks
│   │   ├── dashboard.jsx       # User dashboard
│   │   ├── Login.jsx           # Login page
│   │   ├── Signup.jsx          # Signup page
│   │   ├── ForgotPassword.jsx  # Forgot password page
│   │   ├── ResetPassword.jsx   # Reset password page
│   │   ├── ProtectedRoute.jsx  # Wrapper for protected routes
│   │   └── OAuthCallback.jsx   # OAuth callback handler
│   ├── contexts/               # Context API for global state
│   │   └── AuthContext.jsx     # Authentication context
│   ├── services/               # API service
│   │   └── api.js              # Axios API service
│   ├── App.jsx                 # Main application component
│   ├── index.jsx               # Entry point of the application
│   └── index.css               # Global styles
├── .env                        # Environment variables
├── package.json                # Project dependencies
└── README.md                   # Documentation
```

---

## Installation and Setup

### **Prerequisites**

-   Node.js (v16 or higher)
-   npm or yarn

### **Steps**

1. Clone the repository:

    ```bash
    git clone https://github.com/your-repo/devbook-frontend.git
    cd devbook-frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and configure the following variables:

    ```env
    REACT_APP_API_URL=http://localhost:8080/api
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

5. Access the application at `http://localhost:3000`.

---

## Available Scripts

### **Start Development Server**

```bash
npm run dev
```

### **Build for Production**

```bash
npm run build
```

### **Lint Code**

```bash
npm run lint
```

---

## Key Components Walkthrough

### **Authentication**

-   **Signup.jsx**: Allows users to create an account.
-   **Login.jsx**: Handles user login.
-   **ForgotPassword.jsx**: Sends a password reset email.
-   **ResetPassword.jsx**: Allows users to reset their password using a token.
-   **AuthContext.jsx**: Provides authentication state and functions (e.g., login, logout).

### **Dashboard**

-   **dashboard.jsx**: Displays all bookmarks with options to filter, search, and sort.
-   **CreateBookmark.jsx**: Allows users to create new bookmarks with categories and tags.
-   **EditBookmark.jsx**: Enables users to edit existing bookmarks.

### **Protected Routes**

-   **ProtectedRoute.jsx**: Ensures that only authenticated users can access certain routes.

---

## API Integration

The frontend communicates with the backend using the following API endpoints:

### **Authentication**

| Method | Endpoint                | Description                   |
| ------ | ----------------------- | ----------------------------- |
| POST   | `/auth/signup`          | Register a new user           |
| POST   | `/auth/login`           | Login and receive a JWT token |
| POST   | `/auth/logout`          | Logout the user               |
| POST   | `/auth/forgot-password` | Send password reset email     |
| POST   | `/auth/reset/:token`    | Reset password using token    |

### **Bookmarks**

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| POST   | `/bookmarks`     | Create a new bookmark   |
| GET    | `/bookmarks`     | Get all bookmarks       |
| GET    | `/bookmarks/:id` | Get a specific bookmark |
| PUT    | `/bookmarks/:id` | Update a bookmark       |
| DELETE | `/bookmarks/:id` | Delete a bookmark       |

### **Tags**

| Method | Endpoint    | Description      |
| ------ | ----------- | ---------------- |
| POST   | `/tags`     | Create a new tag |
| GET    | `/tags`     | Get all tags     |
| DELETE | `/tags/:id` | Delete a tag     |

### **Categories**

| Method | Endpoint          | Description           |
| ------ | ----------------- | --------------------- |
| POST   | `/categories`     | Create a new category |
| GET    | `/categories`     | Get all categories    |
| DELETE | `/categories/:id` | Delete a category     |

---

## Deployment

### **Build for Production**

1. Build the application:

    ```bash
    npm run build
    ```

2. Deploy the `build/` directory to a static hosting service (e.g., Netlify, Vercel, AWS S3).

---

## Future Enhancements

-   Add analytics to track frequently used tags or categories.
-   Implement bookmark sharing functionality (e.g., generate public links).
-   Add role-based access control (RBAC) for admin and user roles.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contributors

-   **Pratham Chopde** - [GitHub Profile](https://github.com/your-profile)
