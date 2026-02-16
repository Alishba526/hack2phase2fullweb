'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  fontSize: number;
  setHighContrast: (enabled: boolean) => void;
  setFontSize: (size: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16); // Default font size in pixels

  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 2);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 2);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        fontSize,
        setHighContrast,
        setFontSize,
        increaseFontSize,
        decreaseFontSize,
      }}
    >
      <div
        style={{
          fontSize: `${fontSize}px`,
          ...(highContrast && {
            backgroundColor: '#000',
            color: '#fff',
            filter: 'invert(100%) hue-rotate(180deg)',
          })
        }}
        className="min-h-screen"
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};