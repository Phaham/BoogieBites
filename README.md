# BoogieBites - Food Ordering and Recipe WebApp

A food ordering app with a REST API using MongoDB, Mongoose, Express and Stripe.

## 🎥 Demo
Check out the live demo: [BoogieBites Live](https://boogiebites.onrender.com/)

### process and Key features

- building a REST API with Express, logging requests with Morgan and sending JSend responses.
- using the MVC (Model-View-Controller) architecture with separate routers.
- rendering a server-side website with Pug templates.
- handling log in, sign up and Ordering actions with JavaScript and Axios.
- displaying Recipe of each and every dishes
- showing user-friendly alerts with success/error messages.
- updating user settings, profile picture and showing orders in user dashboard.
- accepting credit card payments with Stripe Checkout and listening to Stripe webhooks.
- sending emails with Pug templates, Nodemailer, Mailtrap and Sendgrid.
- uploading files with multer and processing images with sharp.
- deploying on Render.


## ✨ Features
- **User Authentication**: Sign up, login, password reset.
- **Food Ordering**: Browse the menu, add items to the cart, and place orders.
- **Recipe Collection**: Explore and search for various recipes with detailed instructions.
- **Real-time Notifications**: Receive order status updates in real-time using Socket.io.
- **Payment Integration**: Secure payment processing with Stripe.
- **Admin Dashboard**: Manage menu items, orders, and recipes.
- **Data Security**: Includes data sanitization, rate limiting, and security headers.
- **Email Notifications**: Welcome emails and order confirmation emails using Nodemailer.

## 🛠 Tech Stack

### Backend
- **Node.js**: JavaScript runtime.
- **Express.js**: Web framework.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: MongoDB object modeling.
- **Stripe**: Payment processing.

### Real-time Chat
- **Socket.io**: Real-time chat app for users experience sharing.

### Security
- **Helmet**: Secure HTTP headers.
- **XSS-Clean**: Sanitize user input.
- **Express-Rate-Limit**: Basic rate limiting.

### Dev Tools
- **Nodemon**: Auto-restarting the server.
- **ESLint**: Code linting.
- **Prettier**: Code formatting.
- **Parcel**: Module bundler for JavaScript assets.

## 🚀 Installation
### Prerequisites
- **Node.js** (v18 or above)
- **MongoDB** (Local or Atlas Cloud)

### Steps
1. Clone the repository:
   ```
   git clone https://github.com/Phaham/BoogieBites-.git
   cd BoogieBites-
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the required environment variables (see [Environment Variables](#environment-variables)).
4. Build frontend assets:
   ```
   npm run build:js
   ```
5. Start the development server:
   ```
   npm run dev
   ```

The application will be running at [http://localhost:3000](http://localhost:3000).

#### 📜 Usage
- Open the browser and navigate to [http://localhost:3000](http://localhost:3000).
- Sign up or log in as a user.
- Browse the food menu, add items to your cart, and place orders securely with Stripe.
- Explore a variety of recipes in the recipe section.
- Admin users can manage the menu, orders, and recipes.

#### 📝 Scripts
Here are some useful commands to run during development:

| Command            | Description                                      |
|--------------------|--------------------------------------------------|
| `npm start`        | Start the server in production mode              |
| `npm run dev`      | Start the server in development mode with nodemon|
| `npm run build:js` | Build frontend assets using Parcel               |
| `npm run watch:js` | Watch for changes in frontend assets using Parcel|
| `npm run debug`    | Start the server with ndb debugger               |

#### 🔧 Environment Variables
Create a `.env` file in the root of your project and add the following:

```
NODE_ENV=development | production
PORT=3000
DATABASE=<your-mongodb-connection-string>
DATABASE_PASSWORD=<your-db-password>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
EMAIL_USERNAME=<your-email-username>
EMAIL_PASSWORD=<your-email-password>
EMAIL_HOST=<your-email-host>
EMAIL_PORT=<your-email-port>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
SOCKET_IO_SERVER_URL=<your-socket-io-server-url>
```

### 📁 Folder Structure
```
BoogieBites-/
├── controllers/         # Request handlers
├── models/              # Mongoose schemas
├── public/              # Static files (CSS, JS, images)
├── routes/              # API routes
├── views/               # Pug templates
├── config/              # Configuration files
├── utils/               # Utility functions
├── app.js               # Express app setup
├── server.js            # Server startup
└── .env                 # Environment variables
```

### 📚 API Endpoints

#### **Authentication**
- `POST /api/v1/users/signup` - Sign up a new user
- `POST /api/v1/users/login` - Log in a user
- `POST /api/v1/users/forgotPassword` - Request password reset

- hashing passwords with bcryptjs.
- building a complete authentication workflow with JWT: user sign up, log in and reset password via email.
- protecting routes and restricting access according to user role (user, reviewer, admin).
  
#### **Food Ordering**
- `GET /api/v1/categories` - Get all cuisines items
- `GET /api/v1/category/:id` - Get all dishes in a particular cuisine

#### **Recipes**
- `GET /api/v1/recipes/:id` - Get recipe by ID


## Error handling

- handling operational errors and programmer errors with a middleware wrapping all async controllers.
- sending complete error messages in development and user-friendly messages in production.
- having a safety net for unhandled promise rejections, uncaught exceptions and SIGTERM signals with process.on.
- debugging with ndb.


## Security

- implementing security best practices with express-rate-limit, helmet and CORS.
- sending tokens in secure cookies and reading them with cookie-parser.
- sanitizing data with express-mongo-sanitize, xss-clean and hpp.
  
#### 🤝 Contributing
Contributions are welcome! Please follow these steps:

1. **Fork** the project.
2. **Create** your feature branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. **Commit** your changes:
   ```bash
   git commit -m 'Add YourFeature'
   ```
4. **Push** to the branch:
   ```bash
   git push origin feature/YourFeature
   ```
5. **Open a Pull Request**.

#### Home Page :
![Home Page image](https://i2.paste.pics/OR9O3.png)

#### Category Page :
![Category Page image](https://i2.paste.pics/OR9T6.png)

#### Recipe Page :
![Recipe Page image](https://i2.paste.pics/OR9TI.png)

#### Chat Feature:
![chat_image](https://i2.paste.pics/OR9TR.png)

#### Cart Feature :
![Cart image](https://i2.paste.pics/OR9TW.png)

#### Order Page :
![Order Page_image](https://i2.paste.pics/ORA3J.png)
<br>
