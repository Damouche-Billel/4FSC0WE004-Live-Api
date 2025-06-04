# Fennec FC - Team Management System

## Project Overview

Fennec FC is a comprehensive football team management system built as a full-stack web application. This project demonstrates modern backend development techniques, RESTful API design, and seamless frontend-backend integration. The system provides complete CRUD (Create, Read, Update, Delete) functionality for managing players, teams, and tournaments with real-time data persistence through MongoDB.

**Live Demo:** [http://localhost:8000](http://localhost:8000) (when running locally)

## Key Features

### Core Functionality
- **Player Management**: Complete player lifecycle management with unique jersey number validation
- **Team Management**: Dynamic team creation with flexible formation systems and player assignments
- **Tournament Management**: Multi-team tournament organization with status tracking and capacity management
- **Real-time Validation**: Client-side and server-side validation ensuring data integrity
- **Responsive Design**: Mobile-first design approach for optimal user experience across all devices

### Technical Highlights
- **RESTful API Design**: Following industry best practices for API development
- **Database Relationships**: Sophisticated MongoDB schema with proper document references
- **Error Handling**: Comprehensive error management with meaningful user feedback
- **Data Validation**: Multi-layer validation ensuring data consistency and security
- **Modern ES6+ JavaScript**: Clean, maintainable code following current standards

## 🛠 Technology Stack

### Backend Technologies
- **Node.js (v16+)**: JavaScript runtime environment
- **Express.js (v4.18.2)**: Fast, unopinionated web framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose (v8.0.3)**: Elegant MongoDB object modeling
- **CORS (v2.8.5)**: Cross-Origin Resource Sharing middleware

### Frontend Technologies
- **HTML5**: Semantic markup with accessibility considerations
- **CSS3**: Modern styling with Flexbox and Grid layouts
- **Vanilla JavaScript (ES6+)**: Client-side functionality without frameworks
- **Fetch API**: Modern HTTP client for API communication

### Development Tools
- **Nodemon (v3.0.2)**: Development server with auto-restart
- **Git**: Version control with comprehensive commit history
- **npm**: Package management and script automation

## Database Architecture

### Schema Design Philosophy
The database follows a document-based approach with strategic use of references to maintain data relationships while preserving MongoDB's flexibility.

### Collections Overview

#### Players Collection
```javascript
{
  _id: ObjectId,
  name: String,           // Player's full name
  position: String,       // Goalkeeper, Defender, Midfielder, Forward
  age: Number,           // Player's age (16-45)
  nationality: String,    // Player's nationality
  jerseyNumber: Number,   // Unique identifier (1-99)
  isAvailable: Boolean,   // Availability status
  createdAt: Date        // Timestamp
}
```

#### Teams Collection
```javascript
{
  _id: ObjectId,
  name: String,                    // Team name
  formation: String,               // Tactical formation
  players: [ObjectId],            // References to Player documents
  createdAt: Date                 // Timestamp
}
```

#### Tournaments Collection
```javascript
{
  _id: ObjectId,
  name: String,                    // Tournament name
  startDate: Date,                 // Start date
  endDate: Date,                   // End date
  location: String,                // Tournament location
  teams: [ObjectId],              // References to Team documents
  maxTeams: Number,               // Maximum team capacity
  status: String,                 // upcoming, ongoing, completed
  createdAt: Date                 // Timestamp
}
```

## API Documentation

### Base URL
```
http://localhost:8000/api
```

### Player Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/players` | Retrieve all players | None |
| GET | `/players/:id` | Get specific player | None |
| POST | `/players` | Create new player | Player object |
| PUT | `/players/:id` | Update player | Updated player object |
| DELETE | `/players/:id` | Delete player | None |

### Team Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/teams` | Retrieve all teams | None |
| GET | `/teams/:id` | Get specific team | None |
| POST | `/teams` | Create new team | Team object |
| PUT | `/teams/:id` | Update team | Updated team object |
| DELETE | `/teams/:id` | Delete team | None |

### Tournament Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/tournaments` | Retrieve all tournaments | None |
| GET | `/tournaments/:id` | Get specific tournament | None |
| POST | `/tournaments` | Create new tournament | Tournament object |
| PUT | `/tournaments/:id` | Update tournament | Updated tournament object |
| DELETE | `/tournaments/:id` | Delete tournament | None |

### Example API Requests

#### Create a New Player
```bash
POST /api/players
Content-Type: application/json

{
  "name": "Lionel Messi",
  "position": "Forward",
  "age": 36,
  "nationality": "Argentina",
  "jerseyNumber": 10
}
```

#### Create a New Team
```bash
POST /api/teams
Content-Type: application/json

{
  "name": "Dream Team",
  "formation": "4-3-3",
  "players": ["player_id_1", "player_id_2", "player_id_3"]
}
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm (comes with Node.js)
- Git (for version control)

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Damouche-Billel/University-Assignment-4FSC0WE004.git
   cd "CODE SNIPPETS"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   - Ensure MongoDB is installed and running
   - Default connection: `mongodb://localhost:27017/fennec_fc`
   - Database will be created automatically on first run

4. **Start the Application**
   ```bash
   # Production mode
   npm start
   
   # Development mode (with auto-restart)
   npm run dev
   ```

5. **Access the Application**
   - Frontend: [http://localhost:8000](http://localhost:8000)
   - API Base: [http://localhost:8000/api](http://localhost:8000/api)

### Environment Configuration
Create a `.env` file for custom configuration:
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/fennec_fc
NODE_ENV=development
```

## Testing & Validation

### API Testing
Recommend using Postman or similar tools to test API endpoints:

1. **Import Collection**: Use the provided Postman collection (if available)
2. **Base URL**: Set to `http://localhost:8000/api`
3. **Test Scenarios**: 
   - Create operations with valid data
   - Update operations with partial data
   - Delete operations and dependency handling
   - Error scenarios (invalid data, missing fields)

### Data Validation Testing
- **Unique Constraints**: Test jersey number uniqueness
- **Required Fields**: Verify all mandatory fields are enforced
- **Data Types**: Confirm proper type validation (numbers, dates, strings)
- **Relationships**: Test foreign key constraints and cascading operations

## Security & Error Handling

### Security Measures
- **Input Validation**: All user inputs are validated and sanitized
- **MongoDB Injection Protection**: Mongoose provides built-in protection
- **CORS Configuration**: Properly configured for secure cross-origin requests
- **Error Message Sanitization**: Sensitive information is not exposed in errors

### Error Handling Strategy
- **Consistent Error Responses**: Standardized error format across all endpoints
- **HTTP Status Codes**: Proper use of 200, 201, 400, 404, 500 status codes
- **User-Friendly Messages**: Clear, actionable error messages for users
- **Logging**: Comprehensive error logging for debugging and monitoring

## Project Structure

```
fennec-fc-management/
├── app.js                 # Main application entry point
├── package.json           # Project dependencies and scripts
├── package-lock.json      # Dependency lock file
├── README.md             # Project documentation
├── .gitignore            # Git ignore rules
└── public/
    └── index.html        # Frontend application
```

## Future Enhancements

### Planned Features
- **User Authentication**: JWT-based authentication system
- **Role-Based Access Control**: Different user roles with varying permissions
- **File Upload**: Player photo uploads and team logos
- **Advanced Analytics**: Performance statistics and team analytics
- **Email Notifications**: Automated email system for tournament updates
- **Mobile App**: React Native or Flutter mobile application

### Technical Improvements
- **Caching Layer**: Redis implementation for improved performance
- **Unit Testing**: Comprehensive test suite with Jest and Supertest
- **CI/CD Pipeline**: Automated deployment with GitHub Actions
- **API Rate Limiting**: Protection against API abuse
- **Data Backup**: Automated database backup strategies

### Code Standards
- Follow existing code style and conventions
- Add comments for complex logic
- Update documentation for new features
- Ensure all tests pass before submitting

## Future Enhancements
Github link: https://github.com/Damouche-Billel/University-Assignment-4FSC0WE004/tree/main/API%20PROJECT

