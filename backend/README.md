# News App Backend

## Overview
This is the backend for the News App, built using Express.js. It provides an API to fetch current news issues, which can be consumed by the frontend React application.

## Setup Instructions

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd news-app/backend
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the `backend` directory to store any necessary environment variables (e.g., API keys).

4. **Start the server**
   ```
   npm start
   ```
   The server will run on `http://localhost:5000` by default.

## API Endpoints

### GET /api/news
Fetches the latest news issues. The response will include:
- Title
- Context
- Summary
- Implications
- Links to external articles

## Technologies Used
- Express.js
- Axios
- Cheerio
- Puppeteer

## Folder Structure
- **src/**: Contains the main application code.
  - **app.js**: Entry point of the application.
  - **routes/**: Contains route definitions.
    - **newsRoutes.js**: Defines the news API routes.
  - **controllers/**: Contains the logic for handling requests.
    - **newsController.js**: Handles fetching and processing news data.

## Contributing
Feel free to submit issues or pull requests for improvements or bug fixes.