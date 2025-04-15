
import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 smooth-transition shadow-sm"
      aria-label="Toggle theme"
    >
      {!isDarkMode ? (
        <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      ) : (
        <Sun className="h-5 w-5 text-amber-500" />
      )}
    </button>
  );
};

export default ThemeToggle;
