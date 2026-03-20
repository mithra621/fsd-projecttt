import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Clock, Book } from 'lucide-react';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/quiz');
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Practice Quizzes</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{quiz.title}</h3>
            <span className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mb-4">{quiz.category}</span>
            <div className="flex gap-4 text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1">
              <span className="flex items-center gap-1"><Book size={16} /> {quiz.questions.length} questions</span>
              <span className="flex items-center gap-1"><Clock size={16} /> {quiz.timeLimitMinutes} mins</span>
            </div>
            <Link to={`/dashboard/quizzes/${quiz._id}`} 
                  className="w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              Start Quiz
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
