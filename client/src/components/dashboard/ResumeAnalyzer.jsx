import { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, CheckCircle, XCircle } from 'lucide-react';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('resume', file);
    
    setLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/resume/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(data);
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">AI Resume Analyzer</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div 
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-10 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          onClick={() => fileInputRef.current.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".pdf" 
            className="hidden" 
          />
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {file ? file.name : "Click to upload your resume (PDF)"}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">PDF format up to 5MB</p>
        </div>
        
        <button 
          onClick={handleUpload} 
          disabled={!file || loading}
          className="mt-6 px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow disabled:opacity-50 hover:bg-indigo-700 transition"
        >
          {loading ? 'Analyzing with AI...' : 'Analyze Resume'}
        </button>
      </div>

      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <FileText className="text-indigo-600" /> Analysis Report
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase">Overall Match Score</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className={`text-5xl font-extrabold ${result.score > 70 ? 'text-green-500' : result.score > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {result.score}%
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase">Best Fit Role</p>
                <div className="mt-2 text-xl font-bold text-gray-900 dark:text-white">{result.jobRole}</div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase mb-3 flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={18} /> Matched Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.length > 0 ? result.matchedSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  )) : <span className="text-gray-500 text-sm">No specific skills matched.</span>}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase mb-3 flex items-center gap-2">
                  <XCircle className="text-red-500" size={18} /> Missing Skills to Learn
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.length > 0 ? result.missingSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  )) : <span className="text-gray-500 text-sm">You matched all required skills for this role!</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
