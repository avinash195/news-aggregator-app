import { useState, useEffect } from 'react';
import { Save, Check, X } from 'lucide-react';
import { NewsService } from '../services/newsService';
import type { UserPreferences } from '../types';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreferencesSaved: (preferences: UserPreferences) => void;
}

export function PreferencesModal({ isOpen, onClose, onPreferencesSaved }: PreferencesModalProps) {
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
    if (isOpen) {
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
          const parsedPrefs = JSON.parse(savedPrefs);
          setPreferences(parsedPrefs);
        } catch (error) {
          console.error('Error loading saved preferences:', error);
        }
      }
    }
  }, [isOpen]);

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
      
      // Call the callback to notify parent component
      onPreferencesSaved(preferences);
      
      // Close modal after a short delay
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Personalize Your Feed</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Preferred Sources */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Preferred Sources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sources.map((source) => (
                <label
                  key={source}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={preferences.preferredSources.includes(source)}
                    onChange={() => handleSourceToggle(source)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">{source}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Categories */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Preferred Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={preferences.preferredCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Authors */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Preferred Authors</h3>
            <div className="space-y-4">
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    handleAuthorAdd(input.value);
                    input.value = '';
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium text-sm"
                >
                  Add
                </button>
              </div>
              
              {preferences.preferredAuthors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {preferences.preferredAuthors.map((author) => (
                    <span
                      key={author}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium"
                    >
                      {author}
                      <button
                        onClick={() => handleAuthorRemove(author)}
                        className="ml-2 text-blue-600 hover:text-blue-800 font-bold text-sm"
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
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 