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
      <div className="relative h-52 bg-gray-100">
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
              <div className="text-4xl mb-2">📰</div>
              <div className="text-sm">No image available</div>
            </div>
          </div>
        )}
        
        {/* Category and Source Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            getCategoryColor(article.category)
          )}>
            {article.category}
          </span>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {article.source.name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          {article.title}
        </h3>
        
        <p className="text-gray-600 text-base mb-4 line-clamp-3">
          {article.description}
        </p>

        {/* Author and Date */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-5">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.open(article.url, '_blank', 'noopener,noreferrer')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-base transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
            <span>Read More</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              className={cn(
                "p-2 rounded-full transition-colors",
                isSaved 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              )}
              title={isSaved ? "Remove from saved" : "Save article"}
            >
              <Bookmark className={cn("h-5 w-5", isSaved && "fill-current")} />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              title="Share article"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
