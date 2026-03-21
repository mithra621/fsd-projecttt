import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, ArrowRight, BrainCircuit, Code2, Target } from 'lucide-react';

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-[#0B0F19] transition-colors duration-500 font-sans">
      
      {/* Dynamic Background Blurs */}
      <div className="absolute top-0 -left-4 w-72 h-72 lg:w-96 lg:h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 lg:w-96 lg:h-96 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 lg:w-96 lg:h-96 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Navigation Glass Bar */}
        <nav className="flex justify-between items-center py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <BrainCircuit className="text-white" size={28} />
            </div>
            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Interview<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Ace</span></span>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={toggleTheme} className="p-3 rounded-full glass hover:bg-white/50 dark:hover:bg-white/20 transition-all duration-300 shadow-sm">
              {theme === 'dark' ? <Sun className="text-yellow-400" size={22} /> : <Moon className="text-indigo-600" size={22} />}
            </button>
            <Link to="/login" className="hidden md:block px-6 py-3 font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sign In</Link>
            <Link to="/register" className="px-7 py-3 rounded-full font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/10">
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="mt-20 lg:mt-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-dark dark:glass mb-10 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">InterviewAce 2.0 logic engine online</span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 dark:text-white max-w-5xl leading-[1.05] mb-8">
            Master your next tech interview with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-glow">Native AI.</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mb-14 leading-relaxed mix-blend-luminosity">
            Upload your resume for exact mathematical ML scoring, take dynamic programming quizzes, and practice live verbal interviews directly against the Gemini Neural Net.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            <Link to="/register" className="px-10 py-5 rounded-full font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-[0_0_50px_rgba(79,70,229,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group">
              Start Practicing Free <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="px-10 py-5 rounded-full font-bold text-lg glass text-slate-800 dark:text-white hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-300">
              Sign In to Dashboard
            </Link>
          </div>

          {/* Floating UI Cards */}
          <div className="mt-28 w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-4 relative pb-20">
            <div className="glass dark:glass-dark p-8 rounded-3xl animate-float text-left border border-slate-200/50 dark:border-white/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-200 dark:border-indigo-500/30">
                <Target className="text-indigo-600 dark:text-indigo-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Resume ML Scorer</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">Our cutting-edge ML Engine utilizes Cosine Similarity Euclidean mapping to score your uploaded PDF.</p>
            </div>
            
            <div className="glass dark:glass-dark p-8 rounded-3xl animate-float-delayed text-left border border-slate-200/50 dark:border-white/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 md:translate-y-12">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-200 dark:border-purple-500/30">
                <BrainCircuit className="text-purple-600 dark:text-purple-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Real-time Voice AI</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">Practice verbal behavioral and technical interviews seamlessly with Google's Gemini LLM stateful architecture.</p>
            </div>

            <div className="glass dark:glass-dark p-8 rounded-3xl animate-float text-left border border-slate-200/50 dark:border-white/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center mb-6 border border-pink-200 dark:border-pink-500/30">
                <Code2 className="text-pink-600 dark:text-pink-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Dynamic Roadmaps</h3>
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">Instantly render distinct markdown career structures generated on-the-fly directly to your workspace.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
