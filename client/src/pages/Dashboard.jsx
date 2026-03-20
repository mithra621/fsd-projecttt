import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, LogOut, BookOpen, CheckSquare, FileText, Briefcase, BarChart, Save, Mic } from 'lucide-react';

import Resources from '../components/dashboard/Resources';
import QuizList from '../components/dashboard/QuizList';
import QuizTake from '../components/dashboard/QuizTake';
import ResumeAnalyzer from '../components/dashboard/ResumeAnalyzer';
import CareerSuggestions from '../components/dashboard/CareerSuggestions';
import ProgressCharts from '../components/dashboard/ProgressCharts';
import Chatbot from '../components/dashboard/Chatbot';
import AdminPanel from './AdminPanel';
import MockInterview from './MockInterview';

function Sidebar({ isOpen, setIsOpen, user }) {
  const location = useLocation();
  const navItems = [
    { name: 'Resources', path: '/dashboard', icon: <BookOpen size={20} /> },
    { name: 'Quizzes', path: '/dashboard/quizzes', icon: <CheckSquare size={20} /> },
    { name: 'Mock Interview', path: '/dashboard/interview', icon: <Mic size={20} /> },
    { name: 'Resume Analyzer', path: '/dashboard/resume', icon: <FileText size={20} /> },
    { name: 'Career Path', path: '/dashboard/career', icon: <Briefcase size={20} /> },
    { name: 'Progress', path: '/dashboard/progress', icon: <BarChart size={20} /> },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Admin Panel', path: '/dashboard/admin', icon: <Save size={20} /> });
  }

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
      <div className="flex items-center justify-center mt-8">
        <div className="flex items-center">
          <span className="text-white text-2xl mx-2 font-semibold dark:text-white">Interview Ace</span>
        </div>
      </div>
      <nav className="mt-10">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link key={item.name} to={item.path} onClick={() => setIsOpen(false)}
                  className={`flex items-center mt-4 py-2 px-6 ${isActive ? 'bg-gray-200 dark:bg-gray-700 bg-opacity-25 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:bg-opacity-25'}`}>
              {item.icon}
              <span className="mx-3">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  );
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} user={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <header className="flex justify-between items-center py-4 px-6 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none lg:hidden">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white lg:ml-0 ml-4">Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <span className="text-gray-800 dark:text-white font-medium">{user?.name}</span>
            <button onClick={logout} className="text-red-500 hover:text-red-600 flex items-center gap-1">
              <LogOut size={20} /> <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          <Routes>
            <Route path="/" element={<Resources />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/quizzes/:id" element={<QuizTake />} />
            <Route path="/interview" element={<MockInterview />} />
            <Route path="/resume" element={<ResumeAnalyzer />} />
            <Route path="/career" element={<CareerSuggestions />} />
            <Route path="/progress" element={<ProgressCharts />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
      <Chatbot />
    </div>
  );
}
