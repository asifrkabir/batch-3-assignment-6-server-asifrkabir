# Pawfect Server

Welcome to the Pawfect Server! This application serves as the backend for the Pawfect platform, enabling users to access pet care tips and stories, manage user profiles, and utilize nutrition calculators. Below are the instructions on how to set up and run the application locally.

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js
- MongoDB

## Installation

1. Clone the repository to your local machine:

```bash
git clone https://github.com/asifrkabir/batch-3-assignment-6-server-asifrkabir

```

2. Navigate to the project directory:

```bash
cd batch-3-assignment-6-server-asifrkabir

```

3. Install dependencies::

```bash
npm install

```

## Configuration

1. Create a .env file in the root directory of the project.

2. Add the following environment variables to the .env file:

```plaintext
NODE_ENV=development
PORT=5000
DATABASE_URL={}
CLIENT_URL={}
BCRYPT_SALT_ROUNDS={}
DEFAULT_PASSWORD={}
JWT_ACCESS_SECRET={}
JWT_ACCESS_EXPIRES_IN={}
# JWT_ACCESS_EXPIRES_IN={}
JWT_REFRESH_SECRET={}
JWT_REFRESH_EXPIRES_IN={}

# Cloudinary
NODEMAILER_EMAIL={}
NODEMAILER_PASSWORD={}

# Cloudinary
CLOUDINARY_CLOUD_NAME={}
CLOUDINARY_API_KEY={}
CLOUDINARY_API_SECRET={}
STRIPE_SECRET_KEY={}
```

Adjust the values to match your application.

## Running the Application

To start the application, run the following command:

```bash
npm run start:dev

```

The application will be running at http://localhost:5000.
