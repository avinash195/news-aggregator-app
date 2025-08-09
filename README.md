# News Aggregator Application

A modern, responsive news aggregator web application built with React.js, TypeScript, and Tailwind CSS. The application aggregates news articles from multiple reputable sources including NewsAPI, The Guardian, and The New York Times.

## 🚀 Features

### Core Features
- **Multi-Source News Aggregation**: Fetch articles from NewsAPI, The Guardian, and The New York Times
- **Advanced Search & Filtering**: Search by keywords and filter by category, source, date range, and sort options
- **Personalized Feed**: Customize your news experience with preferred sources, categories, and authors
- **Responsive Design**: Mobile-first design that works seamlessly across all devices

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- API keys for news services (optional for development)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd news-aggregator-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🐳 Docker Development

### Local Development with Docker
```bash
# Build and start the development server
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build

# Stop the container
docker-compose down
```

The application will be available at `http://localhost:5173` with hot reload enabled.






