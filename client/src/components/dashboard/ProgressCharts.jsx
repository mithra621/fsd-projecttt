import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { TrendingUp, Award, Target } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ProgressCharts() {
  const [resumeHistory, setResumeHistory] = useState([]);
  // In a real app we'd fetch actual quiz results, mocked here for demonstration if not available
  
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/resume');
      setResumeHistory(data.reverse()); // Chronological 
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const lineChartData = {
    labels: resumeHistory.map((_, i) => `Upload ${i + 1}`),
    datasets: [
      {
        label: 'Resume Match Score (%)',
        data: resumeHistory.map(r => r.score),
        borderColor: 'rgb(79, 70, 229)', // Indigo 600
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        tension: 0.3
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Resume Score Progression' },
    },
    scales: {
      y: { min: 0, max: 100 }
    }
  };
  
  // Mock data for Quiz scores by category
  const barChartData = {
    labels: ['DSA', 'System Design', 'HR/Behavioral', 'React', 'Node.js'],
    datasets: [
      {
        label: 'Average Score (%)',
        data: [65, 45, 80, 75, 60],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Quiz Performance by Topic' },
    },
    scales: {
      y: { min: 0, max: 100 }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Your Progress Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 mr-4">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Next Milestone</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">Learn System Design</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 mr-4">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Current Streak</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">5 Days</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300 mr-4">
            <Award size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Quizzes Passed</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">12/15</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <Bar options={barChartOptions} data={barChartData} />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {resumeHistory.length > 0 ? (
            <Line options={lineChartOptions} data={lineChartData} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>Upload a resume to see your score progression!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
