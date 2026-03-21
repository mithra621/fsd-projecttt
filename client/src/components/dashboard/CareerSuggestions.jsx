import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Target, ArrowRight } from 'lucide-react';

export default function CareerSuggestions() {
  const { user } = useAuth();
  const [skillsStr, setSkillsStr] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);

  useEffect(() => {
    if (user && user.skills && user.skills.length > 0) {
      setSkillsStr(user.skills.join(', '));
    }
  }, [user]);

  const handleSuggest = async (e) => {
    e?.preventDefault();
    if (!skillsStr.trim()) return;
    
    setLoading(true);
    try {
      const skillsArray = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/career/suggest`, { skills: skillsArray });
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error('Error fetching career suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRoadmap = async (suggestion) => {
    setGeneratingRoadmap(true);
    setActiveRoadmap(null);
    try {
      const promptText = `Generate a clear, step-by-step career roadmap for becoming a ${suggestion.role}. I already know these skills: ${suggestion.matchedSkills.join(', ')}. I urgently need to learn these missing skills: ${suggestion.missingSkills.join(', ')}. Format the roadmap in clean Markdown. Keep it actionable and highly structured.`;
      
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chat`, { message: promptText });
      setActiveRoadmap(data.reply);
    } catch (error) {
       console.error("Roadmap HTTP Request error:", error);
       const errorText = error?.response?.data?.reply || error?.message || "Unknown Network Error";
       setActiveRoadmap(`Oops, the Roadmap API encountered a problem:\n\n${errorText}\n\nMake sure your server is running and the Gemini API key is correct!`);
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto relative">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Career Path Suggestions</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Enter your current skills, and our rule-based engine will recommend the best fitting job roles.
        </p>
        <form onSubmit={handleSuggest} className="flex gap-4">
          <input 
            type="text" 
            value={skillsStr}
            onChange={(e) => setSkillsStr(e.target.value)}
            placeholder="e.g. JavaScript, React, Tailwind, Python"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
          />
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow disabled:opacity-50 hover:bg-indigo-700 transition flex items-center gap-2"
          >
            {loading ? 'Analyzing...' : <><Target size={20} /> Get Suggestions</>}
          </button>
        </form>
      </div>

      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((sug, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-2 h-full ${sug.matchPercentage > 70 ? 'bg-green-500' : sug.matchPercentage > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              
              <div className="flex justify-between items-start mb-4">
                <Briefcase className="text-indigo-600 dark:text-indigo-400" size={32} />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{sug.matchPercentage}%</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{sug.role}</h3>
              
              <div className="flex-1 mt-4">
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">You Have:</h4>
                <div className="flex flex-wrap gap-1 mb-4">
                  {sug.matchedSkills.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">{kw}</span>
                  ))}
                </div>
                
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">You Need:</h4>
                <div className="flex flex-wrap gap-1">
                  {sug.missingSkills.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs rounded-full">{kw}</span>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => handleViewRoadmap(sug)}
                className="mt-6 w-full py-2 flex justify-center items-center gap-2 text-indigo-600 font-medium hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md transition"
              >
                View Roadmap <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dynamic Roadmap Modal */}
      {(activeRoadmap || generatingRoadmap) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-fade-in border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <Briefcase className="text-indigo-500" size={28} /> AI Career Roadmap
              </h3>
              <button 
                onClick={() => { setActiveRoadmap(null); setGeneratingRoadmap(false); }} 
                className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition"
              >
                 ✖
              </button>
            </div>
            <div className="p-8 overflow-y-auto flex-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {generatingRoadmap ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                  <p className="text-gray-600 dark:text-gray-400 text-lg font-medium animate-pulse">Gemini is dynamically rendering your tailored roadmap...</p>
                </div>
              ) : (
                <div className="prose prose-indigo dark:prose-invert max-w-none">
                  {activeRoadmap}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
