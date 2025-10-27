# Taobei Login System

A modern phone verification login system with Taobao-inspired UI design, built with React TypeScript frontend and Node.js backend.

![Taobei Login System](image.png)

## 🌟 Overview

This project demonstrates a complete authentication system using phone number verification, similar to popular Chinese e-commerce platforms. It features a clean, responsive interface with Taobao-style design and secure backend implementation.

## ✨ Features

- 📱 **Phone Verification**: Chinese mobile number validation and SMS-style verification
- 🎨 **Taobao UI**: Orange-themed design matching Taobao's visual style  
- 🔐 **Secure Authentication**: JWT tokens and input validation
- 💾 **Persistent Sessions**: Login state saved across browser sessions
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Modern Stack**: React TypeScript + Node.js + SQLite
- 🧪 **Test-Driven Development**: Comprehensive test coverage with TDD approach

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/xilinyu716/SE-Temp.git
cd SE-Temp

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

```bash
# Copy environment variables file
cd backend
cp .env.example .env
```

Edit the `.env` file with your configuration if needed.

### 3. Start the Application

```bash
# Terminal 1: Start backend server
cd backend
npm run dev
# Backend runs on http://localhost:3001

# Terminal 2: Start frontend server  
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Test the System

1. Open http://localhost:5173 in your browser
2. Click "注册/登录" (Register/Login) tab
3. Enter a Chinese mobile number (e.g., 13800138000)
4. Click "获取验证码" (Get Verification Code)
5. Enter any 6-digit code (e.g., 123456)
6. Click "注册/登录" (Register/Login)

## 📁 Project Structure

```
taobei-login/
├── backend/                 # Node.js backend server
│   ├── src/                # Source code
│   │   ├── config/         # Configuration files
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── test/               # Backend tests
│   └── package.json        # Backend dependencies
├── frontend/               # React TypeScript frontend
│   ├── src/                # Source code
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   └── utils/          # API utilities
│   ├── test/               # Frontend tests
│   └── package.json        # Frontend dependencies
├── .artifacts/             # Interface specifications
│   ├── api_interface.yml   # API interface definitions
│   ├── ui_interface.yml    # UI interface definitions
│   └── data_interface.yml  # Data interface definitions
└── README.md               # This file
```

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Vitest** for testing
- **React Testing Library** for component testing
- **React Router DOM** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **SQLite** database with better-sqlite3
- **JWT** authentication
- **Jest** for testing
- **Supertest** for API testing
- **bcryptjs** for password hashing

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/send-code` - Request verification code
- `POST /api/auth/login` - Login with phone and code  
- `POST /api/auth/register` - Register with phone and code

### User Management
- `GET /api/user/profile` - Get user profile information

## 🧪 Testing

This project follows Test-Driven Development (TDD) principles:

### Backend Testing
```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

### Frontend Testing
```bash
cd frontend
npm test              # Run all tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Generate coverage report
```

### Test Strategy
- **Unit Tests**: Individual components and functions
- **Integration Tests**: API endpoints and database operations
- **End-to-End Tests**: Complete user workflows

## 🎨 Key Components

### Frontend Components
- **PhoneNumberInput** - Chinese mobile number validation
- **VerificationCodeInput** - 6-digit code input with validation
- **LoginForm** - Complete login interface
- **RegisterForm** - User registration interface

### Backend Features
- **User Management** - SQLite-based user storage
- **Verification System** - Code generation and validation
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Comprehensive request validation

## 🔒 Security Features

- Input validation and sanitization
- JWT token authentication
- SQL injection prevention
- CORS configuration
- Password hashing with bcrypt
- Rate limiting protection

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd backend
npm start
```

### Environment Requirements
- Node.js >= 16.0.0
- npm >= 8.0.0

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Implement your feature
5. Ensure all tests pass
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines
- Follow TDD principles (write tests first)
- Maintain code coverage above 80%
- Use TypeScript for type safety
- Follow existing code style and conventions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions or issues:
1. Check the [Issues](https://github.com/xilinyu716/SE-Temp/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your environment and the issue

## 🙏 Acknowledgments

- Inspired by Taobao's user interface design
- Built with modern web development best practices
- Follows industry-standard security guidelines

---

**Happy Coding! 🎉**