import { useState } from 'react';
import { ExternalLink, Bookmark, Share2, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../lib/utils';
import type { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onSave?: (article: Article) => void;
  onShare?: (article: Article) => void;
  className?: string;
}

export function ArticleCard({ article, onSave, onShare, className }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(article);
  };

  const handleShare = () => {
    onShare?.(article);
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: article.url
      });
    } else {
      navigator.clipboard.writeText(article.url);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown date';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Business': 'bg-green-100 text-green-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Sports': 'bg-orange-100 text-orange-800',
      'Science': 'bg-indigo-100 text-indigo-800',
      'Health': 'bg-red-100 text-red-800',
      'World': 'bg-gray-100 text-gray-800',
      'Politics': 'bg-yellow-100 text-yellow-800',
      'Environment': 'bg-emerald-100 text-emerald-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <article className={cn("bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200", className)}>
      {/* Image */}
      <div className="relative h-40 sm:h-48 lg:h-52 bg-gray-100">
        {!imageError && article.urlToImage && article.urlToImage !== '/placeholder-image.jpg' ? (
          <img
            src={article.urlToImage}
            alt={article.title}
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-gray-400 text-center">
              <div className="text-3xl sm:text-4xl mb-2">📰</div>
              <div className="text-xs sm:text-sm">No image available</div>
            </div>
          </div>
        )}
        
        {/* Category and Source Tags */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-wrap gap-1.5 sm:gap-2">
          <span className={cn(
            "px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium",
            getCategoryColor(article.category)
          )}>
            {article.category}
          </span>
          <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {article.source.name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 lg:p-5">
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-3">
          {article.description}
        </p>

        {/* Author and Date */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 lg:mb-5 space-y-1 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <User className="h-3 sm:h-4" />
            <span className="truncate">{article.author}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-3 sm:h-4" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <button
            onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
            className="flex items-center justify-center sm:justify-start space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base transition-colors w-full sm:w-auto"
          >
            <ExternalLink className="h-4 sm:h-5 w-4 sm:w-5" />
            <span>Read More</span>
          </button>

          <div className="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-3">
            <button
              onClick={handleSave}
              className={cn(
                "p-1.5 sm:p-2 rounded-full transition-colors",
                isSaved 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              )}
              title={isSaved ? "Remove from saved" : "Save article"}
            >
              <Bookmark className={cn("h-4 sm:h-5 w-4 sm:w-5", isSaved && "fill-current")} />
            </button>
            
            <button
              onClick={handleShare}
              className="p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              title="Share article"
            >
              <Share2 className="h-4 sm:h-5 w-4 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
