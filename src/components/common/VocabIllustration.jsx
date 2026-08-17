import React, { useState } from 'react';
import { getVocabularyIcon } from '../../data/vocabulary';

/**
 * VocabIllustration Component
 * Renders dedicated 2D vector Japanese-style illustrations for vocabulary items
 * with multi-format progressive fallback (webp -> jpg -> png -> Lucide vector icon).
 */
export default function VocabIllustration({ 
  id, 
  keyword = '', 
  alt = '', 
  className = 'w-16 h-16', 
  iconClassName = 'w-8 h-8',
  containerClassName = '' 
}) {
  const [extIndex, setExtIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const extensions = ['jpg', 'webp', 'png'];
  const baseUrl = import.meta.env.BASE_URL || '/';
  const currentExt = extensions[extIndex];
  const imgUrl = `${baseUrl}images/vocab/${id}.${currentExt}`;

  const IconComponent = getVocabularyIcon(keyword);

  const handleImageError = () => {
    if (extIndex < extensions.length - 1) {
      setExtIndex(prev => prev + 1);
    } else {
      setImgError(true);
    }
  };

  if (imgError) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary ${className} ${containerClassName}`}>
        <IconComponent className={iconClassName} />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl ${className} ${containerClassName}`}>
      {/* Background icon placeholder while loading or as backing */}
      <div className={`absolute inset-0 flex items-center justify-center bg-zen-primary/10 dark:bg-zen-dark-primary/20 text-zen-primary dark:text-zen-dark-primary transition-opacity duration-300 ${imgLoaded ? 'opacity-0' : 'opacity-100'}`}>
        <IconComponent className={iconClassName} />
      </div>

      {/* Primary Illustration Image */}
      <img
        key={`${id}-${currentExt}`}
        src={imgUrl}
        alt={alt || keyword || id}
        loading="lazy"
        onLoad={() => setImgLoaded(true)}
        onError={handleImageError}
        className={`w-full h-full object-contain p-0.5 rounded-2xl transition-all duration-300 ${imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      />
    </div>
  );
}
