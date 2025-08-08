# News Aggregator Application

A modern, responsive news aggregator web application built with React.js, TypeScript, and Tailwind CSS. The application aggregates news articles from multiple reputable sources including NewsAPI, The Guardian, and The New York Times.

## 🚀 Features

### Core Features
- **Multi-Source News Aggregation**: Fetch articles from NewsAPI, The Guardian, and The New York Times
- **Advanced Search & Filtering**: Search by keywords and filter by category, source, date range, and sort options
- **Personalized Feed**: Customize your news experience with preferred sources, categories, and authors
- **Responsive Design**: Mobile-first design that works seamlessly across all devices
- **Real-time Updates**: Live search with debounced input and automatic refresh
- **Article Actions**: Save articles, share content, and read full articles

### Technical Features
- **Modern Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions
- **Component Architecture**: Reusable, single-responsibility components
- **State Management**: Custom React hooks for efficient state management
- **Error Handling**: Graceful error handling with user-friendly messages
- **Performance Optimized**: Lazy loading, debounced search, and efficient rendering

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

3. **Set up environment variables** (optional)
   Create a `.env` file in the root directory:
   ```env
   VITE_NEWS_API_KEY=your_news_api_key
   VITE_GUARDIAN_API_KEY=your_guardian_api_key
   VITE_NYT_API_KEY=your_nyt_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
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

## 📱 Usage

### Navigation
- **Home**: Browse latest news articles with filters
- **Trending**: View trending articles (coming soon)
- **Saved Articles**: Access your saved articles (coming soon)
- **Personalize Feed**: Customize your news preferences

### Search & Filters
1. Use the search bar to find articles by keywords
2. Apply filters using the sidebar:
   - **Category**: Filter by news categories
   - **Source**: Choose specific news sources
   - **Date Range**: Filter by time period
   - **Sort By**: Sort articles by date, title, or source

### Article Actions
- **Read More**: Open the full article in a new tab
- **Save**: Bookmark articles for later reading
- **Share**: Share articles via native sharing or copy link

### Personalization
1. Click "Personalize Feed" in the navbar
2. Select your preferred sources and categories
3. Add preferred authors
4. Save your preferences

## 🏗️ Project Structure

```
src/
├── api/                 # API integration services
│   ├── newsApi.ts      # NewsAPI integration
│   ├── guardianApi.ts  # Guardian API integration
│   └── nytApi.ts       # NYT API integration
├── components/         # Reusable UI components
│   ├── ArticleCard.tsx
│   ├── Filters.tsx
│   ├── Navbar.tsx
│   ├── SearchBar.tsx
│   ├── Loader.tsx
│   └── ErrorMessage.tsx
├── hooks/             # Custom React hooks
│   ├── useNewsApi.ts
│   └── useFilters.ts
├── pages/             # Page components
│   ├── Home.tsx
│   └── Preferences.tsx
├── services/          # Business logic services
│   └── newsService.ts
├── styles/            # Global styles
│   └── globals.css
├── types/             # TypeScript type definitions
│   └── index.ts
├── lib/               # Utility functions
│   └── utils.ts
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## 🔧 Configuration

### API Keys Setup

To get the full functionality, you'll need API keys from the following services:

1. **NewsAPI** (https://newsapi.org/)
   - Free tier available
   - Rate limit: 1,000 requests/day

2. **The Guardian** (https://open-platform.theguardian.com/)
   - Free tier available
   - Rate limit: 500 requests/day

3. **The New York Times** (https://developer.nytimes.com/)
   - Free tier available
   - Rate limit: 1,000 requests/day

### Environment Variables

```env
# NewsAPI Configuration
VITE_NEWS_API_KEY=your_news_api_key

# Guardian API Configuration
VITE_GUARDIAN_API_KEY=your_guardian_api_key

# NYT API Configuration
VITE_NYT_API_KEY=your_nyt_api_key
```

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Code Style

The project uses ESLint for code linting and follows TypeScript best practices. Run `npm run lint` to check for code style issues.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Docker
```bash
# Start development server in Docker
docker-compose up --build

# Access at http://localhost:5173
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NewsAPI](https://newsapi.org/) for providing news data
- [The Guardian](https://open-platform.theguardian.com/) for their open platform
- [The New York Times](https://developer.nytimes.com/) for their developer API
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide React](https://lucide.dev/) for the beautiful icons
- [React Router](https://reactrouter.com/) for client-side routing

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

---

**Happy News Reading! 📰**
