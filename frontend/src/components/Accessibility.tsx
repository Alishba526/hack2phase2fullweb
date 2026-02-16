'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'larger';
  toggleHighContrast: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');

  useEffect(() => {
    // Load preferences from localStorage
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedFontSize = localStorage.getItem('fontSize') as 'normal' | 'large' | 'larger' | null;
    
    setHighContrast(savedHighContrast);
    if (savedFontSize) setFontSize(savedFontSize);
  }, []);

  useEffect(() => {
    // Apply high contrast class to body
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    // Apply font size class to body
    document.body.classList.remove('font-size-normal', 'font-size-large', 'font-size-larger');
    document.body.classList.add(`font-size-${fontSize}`);
  }, [highContrast, fontSize]);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('highContrast', String(newValue));
  };

  const increaseFontSize = () => {
    const sizes: Array<'normal' | 'large' | 'larger'> = ['normal', 'large', 'larger'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      const newSize = sizes[currentIndex + 1];
      setFontSize(newSize);
      localStorage.setItem('fontSize', newSize);
    }
  };

  const decreaseFontSize = () => {
    const sizes: Array<'normal' | 'large' | 'larger'> = ['normal', 'large', 'larger'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      const newSize = sizes[currentIndex - 1];
      setFontSize(newSize);
      localStorage.setItem('fontSize', newSize);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        fontSize,
        toggleHighContrast,
        increaseFontSize,
        decreaseFontSize,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

// Accessibility toolbar component
export function AccessibilityToolbar() {
  const { highContrast, fontSize, toggleHighContrast, increaseFontSize, decreaseFontSize } = useAccessibility();

  return (
    <div className="fixed bottom-20 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200 z-50">
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleHighContrast}
          className={`p-2 rounded-full ${highContrast ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          aria-label={highContrast ? "Disable high contrast" : "Enable high contrast"}
        >
          🌙
        </button>
        <button
          onClick={decreaseFontSize}
          className="p-2 rounded-full bg-gray-200 text-gray-700"
          aria-label="Decrease font size"
        >
          A-
        </button>
        <button
          onClick={increaseFontSize}
          className="p-2 rounded-full bg-gray-200 text-gray-700"
          aria-label="Increase font size"
        >
          A+
        </button>
      </div>
    </div>
  );
}