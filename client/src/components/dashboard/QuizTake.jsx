import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock } from 'lucide-react';

export default function QuizTake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (quiz && !isFinished) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        submitQuiz();
      }
    }
  }, [timeLeft, quiz, isFinished]);

  const fetchQuiz = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/quiz/${id}`);
      setQuiz(data);
      setTimeLeft(data.timeLimitMinutes * 60);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const submitQuiz = async () => {
    setIsFinished(true);
    const answersArray = quiz.questions.map((_, i) => answers[i] || '');
    try {
      const { data } = await axios.post(`http://localhost:5000/api/quiz/submit`, {
        quizId: id,
        answers: answersArray
      });
      setResult(data);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (!quiz) return <div>Loading...</div>;

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center mt-10">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Quiz Finished!</h2>
        {result ? (
          <div>
            <p className="text-2xl mb-4 text-gray-700 dark:text-gray-300">Your Score: <span className="font-bold text-indigo-600">{result.score} / {result.totalQuestions}</span></p>
            <button onClick={() => navigate('/dashboard/quizzes')} className="mt-4 py-2 px-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Back to Quizzes
            </button>
          </div>
        ) : (
          <p>Calculating results...</p>
        )}
      </div>
    );
  }

  const q = quiz.questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
      <div className="flex justify-between items-center mb-8 border-b pb-4 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{quiz.title}</h2>
        <div className="flex items-center text-red-500 font-bold px-3 py-1 bg-red-100 rounded-md">
          <Clock size={16} className="mr-2" /> {formatTime(timeLeft)}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </h3>
        <p className="text-lg text-gray-800 dark:text-gray-200 mb-6">{q.questionText}</p>
        
        <div className="space-y-3">
          {q.options.map((opt, idx) => (
            <label key={idx} className={`block p-4 border rounded-lg cursor-pointer transition ${answers[currentQuestion] === opt ? 'border-indigo-600 bg-indigo-50 dark:bg-gray-700 shadow-sm' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              <div className="flex items-center">
                <input 
                  type="radio" 
                  name={`q-${currentQuestion}`} 
                  value={opt}
                  checked={answers[currentQuestion] === opt}
                  onChange={() => setAnswers({...answers, [currentQuestion]: opt})}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-3 text-gray-700 dark:text-gray-300">{opt}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button 
          onClick={() => setCurrentQuestion(p => Math.max(0, p - 1))}
          disabled={currentQuestion === 0}
          className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Previous
        </button>
        {currentQuestion === quiz.questions.length - 1 ? (
          <button 
            onClick={submitQuiz}
            className="py-2 px-6 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
          >
            Submit Quiz
          </button>
        ) : (
          <button 
            onClick={() => setCurrentQuestion(p => p + 1)}
            className="py-2 px-4 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
