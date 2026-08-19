import React from 'react';

/**
 * Parses a string containing Furigana markup.
 * Format: {BaseText}[furigana]
 * Example: "私{日本}[にほん]へ行きます"
 */
export const parseFuriganaString = (text) => {
  if (!text) return [];
  
  const regex = /\{([^}]+)\}\[([^\]]+)\]/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    
    parts.push({
      type: 'ruby',
      base: match[1],
      furi: match[2]
    });
    
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return parts;
};

const FuriganaText = ({ 
  text, 
  showFurigana = true, 
  className = '',
  furiganaClassName = 'text-zen-primary dark:text-zen-dark-primary'
}) => {
  if (!text) return null;

  const parts = parseFuriganaString(text);

  return (
    <span className={`leading-normal ${className}`}>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <span key={index}>{part.content}</span>;
        }

        return (
          <ruby key={index} className="ruby-base">
            {part.base}
            {/* We render the RT tag even when hidden to prevent line-height jumping, using opacity-0 */}
            <rt 
              className={`text-[0.6em] select-none tracking-normal font-medium ${
                showFurigana ? furiganaClassName : 'opacity-0 invisible'
              }`}
            >
              {part.furi}
            </rt>
          </ruby>
        );
      })}
    </span>
  );
};

export default FuriganaText;
