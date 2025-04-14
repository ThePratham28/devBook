# DevBook Backend

DevBook Backend is a Node.js-based RESTful API for managing developer bookmarks. It allows users to save, tag, and organize bookmarks with categories and notes. The backend is built using **Express.js**, **Sequelize ORM**, and **PostgreSQL**, with additional features like authentication, Redis caching, and email services.

---

## Features

### **Authentication**

-   User signup with email verification.
-   Login with email and password.
-   Google OAuth integration.
-   Forgot password with reset token and reset form.
-   Logout functionality.
-   JWT-based authentication with HTTP-only cookies.

### **Bookmark Management**

-   Create, view, update, and delete bookmarks.
-   Pagination, sorting, and filtering (by tags, categories, and search).
-   Bookmark associations with tags, categories, and notes.

### **Tag Management**

-   Create, view, and delete tags.
-   Many-to-many relationship between bookmarks and tags.

### **Category Management**

-   Create, view, and delete categories.
-   One-to-many relationship between users and categories.
-   One-to-many relationship between categories and bookmarks.

### **Note Management**

-   Create, view, update, and delete notes for bookmarks.
-   One-to-many relationship between bookmarks and notes.

### **Additional Features**

-   Export bookmarks as CSV or JSON (to be implemented).
-   Bookmark sharing functionality (e.g., generate public links) (to be implemented).
-   Analytics to track frequently used tags or categories (to be implemented).

---

## Tech Stack

### **Backend**

-   **Node.js**: Runtime environment.
-   **Express.js**: Web framework.
-   **Sequelize ORM**: Database interaction.
-   **PostgreSQL**: Relational database.
-   **Redis**: Caching for frequently accessed data.
-   **Passport.js**: Authentication (Google OAuth).
-   **Nodemailer**: Email services.

### **Other Tools**

-   **dotenv**: Environment variable management.
-   **winston**: Logging.
-   **express-validator**: Request validation.
-   **argon2**: Password hashing.

---

## Project Structure

```
backend/
├── config/                 # Configuration files
│   ├── passport.config.js  # Passport.js configuration
│   └── db.config.js        # Database configuration
├── controllers/            # Controllers for handling business logic
│   ├── authController.js   # Authentication-related logic
│   ├── bookmarkController.js # Bookmark-related logic
│   ├── tagController.js    # Tag-related logic
│   ├── categoryController.js # Category-related logic
│   └── noteController.js   # Note-related logic
├── db/                     # Database connection and initialization
│   ├── connectDb.js        # Sequelize connection setup
│   └── migrations/         # Sequelize migrations
├── models/                 # Sequelize models
│   ├── user.model.js       # User model
│   ├── bookmark.model.js   # Bookmark model
│   ├── tag.model.js        # Tag model
│   ├── category.model.js   # Category model
│   ├── note.model.js       # Note model
│   └── bookmarkTag.model.js # Bookmark-Tag join table
├── routes/                 # API route definitions
│   ├── authRoutes.js       # Authentication routes
│   ├── bookmarkRoutes.js   # Bookmark routes
│   ├── tagRoutes.js        # Tag routes
│   ├── categoryRoutes.js   # Category routes
│   └── noteRoutes.js       # Note routes
├── services/               # Service layer for reusable logic
│   └── email.service.js    # Email-related logic
├── utils/                  # Utility functions
│   ├── redisClient.js      # Redis client setup
│   └── logger.js           # Winston logger setup
├── middlewares/            # Custom middleware
│   ├── authMiddleware.js   # Middleware for authentication
│   └── validationMiddleware.js # Middleware for request validation
├── public/                 # Static files (e.g., HTML, CSS)
├── tests/                  # Unit and integration tests
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── index.js                # Entry point of the application
└── README.md               # Documentation
```

---

## API Endpoints

### **Authentication**

| Method | Endpoint                    | Description                   |
| ------ | --------------------------- | ----------------------------- |
| POST   | `/api/auth/signup`          | Register a new user           |
| POST   | `/api/auth/login`           | Login and receive a JWT token |
| POST   | `/api/auth/logout`          | Logout the user               |
| POST   | `/api/auth/forgot-password` | Send password reset email     |
| POST   | `/api/auth/reset/:token`    | Reset password using token    |
| GET    | `/api/auth/google`          | Google OAuth login            |
| GET    | `/api/auth/google/callback` | Google OAuth callback         |

### **Bookmarks**

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/bookmarks`     | Create a new bookmark   |
| GET    | `/api/bookmarks`     | Get all bookmarks       |
| GET    | `/api/bookmarks/:id` | Get a specific bookmark |
| PUT    | `/api/bookmarks/:id` | Update a bookmark       |
| DELETE | `/api/bookmarks/:id` | Delete a bookmark       |

### **Tags**

| Method | Endpoint        | Description      |
| ------ | --------------- | ---------------- |
| POST   | `/api/tags`     | Create a new tag |
| GET    | `/api/tags`     | Get all tags     |
| DELETE | `/api/tags/:id` | Delete a tag     |

### **Categories**

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| POST   | `/api/categories`     | Create a new category |
| GET    | `/api/categories`     | Get all categories    |
| DELETE | `/api/categories/:id` | Delete a category     |

### **Notes**

| Method | Endpoint                 | Description                  |
| ------ | ------------------------ | ---------------------------- |
| POST   | `/api/notes`             | Create a new note            |
| GET    | `/api/notes/:bookmarkId` | Get all notes for a bookmark |
| DELETE | `/api/notes/:id`         | Delete a note                |

---

## Installation and Setup

### **Prerequisites**

-   Node.js (v16 or higher)
-   PostgreSQL
-   Redis

### **Steps**

1. Clone the repository:

    ```bash
    git clone https://github.com/your-repo/devbook-backend.git
    cd devbook-backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a

.env

file and configure the following variables:

```env
NODE_ENV=development
PORT=8080
DB_NAME=bookmark_manager_dev
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=127.0.0.1
DB_PORT=5432
JWT_SECRET=your_jwt_secret
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Run database migrations:

    ```bash
    npx sequelize-cli db:migrate
    ```

5. Start the server:

    ```bash
    npm start
    ```

6. Access the API at `http://localhost:8080`.

---

## Testing

### **Run Tests**

-   To run unit and integration tests:
    ```bash
    npm test
    ```

---

## Deployment

### **Docker**

1. Build the Docker image:

    ```bash
    docker build -t devbook-backend .
    ```

2. Run the container:
    ```bash
    docker run -p 8080:8080 --env-file .env devbook-backend
    ```

### **CI/CD**

-   Set up a CI/CD pipeline using GitHub Actions, GitLab CI, or Jenkins to automate deployment.

---

## Future Enhancements

-   Export bookmarks as CSV or JSON.
-   Bookmark sharing functionality (e.g., generate public links).
-   Analytics to track frequently used tags or categories.
-   Role-based access control (RBAC) for admin and user roles.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contributors

-   **Pratham Chopde** - [GitHub Profile](https://github.com/your-profile)

```

```
