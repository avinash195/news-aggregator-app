import { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import { NewsService } from '../services/newsService';
import type { UserPreferences } from '../types';

export function Preferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredSources: [],
    preferredCategories: [],
    preferredAuthors: []
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [categoriesData, sourcesData] = await Promise.all([
          NewsService.getCategories(),
          NewsService.getSources()
        ]);
        setCategories(categoriesData.filter(cat => cat !== 'All Categories'));
        setSources(sourcesData.filter(source => source !== 'All Sources'));
      } catch (error) {
        console.error('Error loading preferences options:', error);
      }
    };

    loadOptions();

    // Load saved preferences from localStorage
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (error) {
        console.error('Error loading saved preferences:', error);
      }
    }
  }, []);

  const handleSourceToggle = (source: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredSources: prev.preferredSources.includes(source)
        ? prev.preferredSources.filter(s => s !== source)
        : [...prev.preferredSources, source]
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(category)
        ? prev.preferredCategories.filter(c => c !== category)
        : [...prev.preferredCategories, category]
    }));
  };

  const handleAuthorAdd = (author: string) => {
    if (author.trim() && !preferences.preferredAuthors.includes(author.trim())) {
      setPreferences(prev => ({
        ...prev,
        preferredAuthors: [...prev.preferredAuthors, author.trim()]
      }));
    }
  };

  const handleAuthorRemove = (author: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredAuthors: prev.preferredAuthors.filter(a => a !== author)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Personalize Your Feed</h1>
            <p className="text-gray-600 text-lg">
              Customize your news experience by selecting your preferred sources, categories, and authors.
            </p>
          </div>

          <div className="p-8 space-y-10">
            {/* Preferred Sources */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Preferred Sources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sources.map((source) => (
                  <label
                    key={source}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={preferences.preferredSources.includes(source)}
                      onChange={() => handleSourceToggle(source)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-base font-medium text-gray-900">{source}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preferred Categories */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Preferred Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={preferences.preferredCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-base font-medium text-gray-900">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preferred Authors */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Preferred Authors</h3>
              <div className="space-y-6">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Enter author name"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        handleAuthorAdd(target.value);
                        target.value = '';
                      }
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      handleAuthorAdd(input.value);
                      input.value = '';
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                  >
                    Add
                  </button>
                </div>
                
                {preferences.preferredAuthors.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {preferences.preferredAuthors.map((author) => (
                      <span
                        key={author}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-blue-100 text-blue-800 font-medium"
                      >
                        {author}
                        <button
                          onClick={() => handleAuthorRemove(author)}
                          className="ml-2 text-blue-600 hover:text-blue-800 font-bold text-lg"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-8 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center space-x-3 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-base"
              >
                {saved ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
