import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4">
        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      <h1 className="text-5xl font-extrabold mb-6 text-indigo-600 dark:text-indigo-400">Interview Ace</h1>
      <p className="text-xl mb-8 max-w-2xl text-center text-gray-600 dark:text-gray-300">
        Your ultimate Interview Preparation Portal. Practice quizzes, analyze your resume, and discover your career path.
      </p>
      <div className="flex gap-4">
        <Link to="/login" className="px-6 py-3 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition">Login</Link>
        <Link to="/register" className="px-6 py-3 rounded-lg font-semibold border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800 transition">Register</Link>
      </div>
    </div>
  );
}
