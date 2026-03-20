import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Save } from 'lucide-react';

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('resources');
  
  // Resource Form
  const [resTitle, setResTitle] = useState('');
  const [resCategory, setResCategory] = useState('DSA');
  const [resLink, setResLink] = useState('');
  const [resDesc, setResDesc] = useState('');

  // Quiz Form
  const [quizTitle, setQuizTitle] = useState('');
  const [quizCategory, setQuizCategory] = useState('Technical');
  const [quizTime, setQuizTime] = useState(10);
  const [questions, setQuestions] = useState([{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);

  const handleResourceSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/resources', {
        title: resTitle,
        category: resCategory,
        link: resLink,
        description: resDesc
      });
      alert('Resource created successfully!');
      setResTitle(''); setResLink(''); setResDesc('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating resource');
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/quiz', {
        title: quizTitle,
        category: quizCategory,
        timeLimitMinutes: quizTime,
        questions
      });
      alert('Quiz created successfully!');
      setQuizTitle('');
      setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating quiz');
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const updateQuestion = (index, field, value) => {
    const newQs = [...questions];
    newQs[index][field] = value;
    setQuestions(newQs);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQs = [...questions];
    newQs[qIndex].options[oIndex] = value;
    setQuestions(newQs);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex bg-gray-100 dark:bg-gray-900 justify-center items-center h-full w-full">
        <h2 className="text-2xl text-red-500 font-bold p-8">Unauthorized. Admin Access Only.</h2>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm w-full p-8 max-w-4xl mx-auto my-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Admin Control Panel</h2>
      
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`py-2 px-6 ${activeTab === 'resources' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('resources')}
        >
          Add Resource
        </button>
        <button
          className={`py-2 px-6 ${activeTab === 'quizzes' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 dark:text-gray-400'}`}
          onClick={() => setActiveTab('quizzes')}
        >
          Add Quiz
        </button>
      </div>

      {activeTab === 'resources' && (
        <form onSubmit={handleResourceSubmit} className="space-y-4 animate-fade-in">
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input required type="text" value={resTitle} onChange={e=>setResTitle(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2" /></div>
          
          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select value={resCategory} onChange={e=>setResCategory(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2">
            <option>DSA</option><option>Technical</option><option>HR</option><option>Aptitude</option><option>Prep</option><option>Other</option>
          </select></div>

          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL Link</label>
          <input required type="url" value={resLink} onChange={e=>setResLink(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2" /></div>

          <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea required value={resDesc} onChange={e=>setResDesc(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"></textarea></div>

          <button type="submit" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"><Save size={18}/> Save Resource</button>
        </form>
      )}

      {activeTab === 'quizzes' && (
        <form onSubmit={handleQuizSubmit} className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quiz Title</label>
            <input required type="text" value={quizTitle} onChange={e=>setQuizTitle(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 bg-gray-50 dark:bg-gray-700 dark:text-white p-2" /></div>
            
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select value={quizCategory} onChange={e=>setQuizCategory(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 bg-gray-50 dark:bg-gray-700 dark:text-white p-2">
              <option>DSA</option><option>Technical</option><option>HR</option><option>Aptitude</option>
            </select></div>
            
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time Limit (mins)</label>
            <input required type="number" min="1" value={quizTime} onChange={e=>setQuizTime(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 bg-gray-50 dark:bg-gray-700 dark:text-white p-2" /></div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Questions</h3>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                <input required type="text" placeholder="Question Text" value={q.questionText} onChange={e => updateQuestion(qIndex, 'questionText', e.target.value)} className="w-full mb-3 p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700" />
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {q.options.map((opt, oIndex) => (
                    <input key={oIndex} required type="text" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={e => updateOption(qIndex, oIndex, e.target.value)} className="p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-700" />
                  ))}
                </div>
                
                <input required type="text" placeholder="Correct Answer (Must perfectly match one option)" value={q.correctAnswer} onChange={e => updateQuestion(qIndex, 'correctAnswer', e.target.value)} className="w-full p-2 border rounded border-green-300 bg-green-50 dark:bg-gray-800 dark:text-white dark:border-green-800" />
              </div>
            ))}
            
            <button type="button" onClick={addQuestion} className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800"><PlusCircle size={18}/> Add Another Question</button>
          </div>

          <button type="submit" className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700 text-lg"><Save size={20}/> Publish Quiz</button>
        </form>
      )}
    </div>
  );
}
