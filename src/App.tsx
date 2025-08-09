import { useState, useCallback, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Preferences } from './pages/Preferences';
import { PreferencesModal } from './components/PreferencesModal';
import type { UserPreferences } from './types';

function App() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredSources: [],
    preferredCategories: [],
    preferredAuthors: []
  });
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);

  // Load preferences from localStorage on app start
  useEffect(() => {
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (error) {
        console.error('Error loading saved preferences:', error);
      }
    }
  }, []);

  // Memoize preferences to prevent unnecessary re-renders
  const memoizedPreferences = useMemo(() => preferences, [
    preferences.preferredSources.join(','),
    preferences.preferredCategories.join(','),
    preferences.preferredAuthors.join(',')
  ]);

  const handleSearch = useCallback((query: string) => {
    console.log('App: Received search query:', query);
    setSearchQuery(query);
  }, []);

  const handlePersonalizeFeed = () => {
    setIsPreferencesModalOpen(true);
  };

  const handlePreferencesSaved = useCallback((newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    // Close modal is handled in PreferencesModal
  }, []);

  const handleClosePreferencesModal = useCallback(() => {
    setIsPreferencesModalOpen(false);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar onSearch={handleSearch} onPersonalizeFeed={handlePersonalizeFeed} />
        <div className="pt-20">
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} preferences={memoizedPreferences} />} />
            <Route path="/preferences" element={<Preferences />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        
        {/* Preferences Modal */}
        <PreferencesModal
          isOpen={isPreferencesModalOpen}
          onClose={handleClosePreferencesModal}
          onPreferencesSaved={handlePreferencesSaved}
        />
      </div>
    </Router>
  );
}

export default App;
