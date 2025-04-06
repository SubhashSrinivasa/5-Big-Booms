# News App Frontend

This is the frontend part of the News App, built using React. It fetches and displays current news issues from the backend API.

## Features

- A responsive navigation bar for easy access to different sections.
- Display of five current news issues in expandable tabs.
- Each tab includes:
  - Context
  - Summary
  - Implications
  - Links to external articles

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the frontend directory:
   ```
   cd news-app/frontend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application

To start the development server, run:
```
npm start
```

The application will be available at `http://localhost:3000`.

## Components

- **Navbar**: Renders the navigation bar at the top of the page.
- **NewsTabs**: Displays the news issues in expandable tabs.

## API Integration

The frontend communicates with the backend API to fetch news data. Ensure the backend server is running to retrieve the news issues.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.