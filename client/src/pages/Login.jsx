import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-semibold">Register</Link>
        </p>
      </div>
    </div>
  );
}
