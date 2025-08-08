import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Preferences } from './pages/Preferences';

function App() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = useCallback((query: string) => {
    console.log('App: Received search query:', query);
    setSearchQuery(query);
  }, []);

  const handlePersonalizeFeed = () => {
    // Navigate to preferences page
    window.location.href = '/preferences';
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={handleSearch} onPersonalizeFeed={handlePersonalizeFeed} />
        <div className="pt-20">
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
