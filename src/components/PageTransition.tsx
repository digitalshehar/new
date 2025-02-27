import React, { useEffect, useState, type PropsWithChildren } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface Props extends PropsWithChildren {}

export const PageTransition: React.FC<Props> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
      setIsVisible(false);
    };

    const handleDone = () => {
      setIsLoading(false);
      setTimeout(() => setIsVisible(true), 50);
    };

    // Add event listeners for Astro's page transitions
    document.addEventListener('astro:page-load', handleDone);
    document.addEventListener('astro:before-preparation', handleStart);

    // Initial load
    handleDone();

    return () => {
      document.removeEventListener('astro:page-load', handleDone);
      document.removeEventListener('astro:before-preparation', handleStart);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      )}
      <div
        className={`transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
