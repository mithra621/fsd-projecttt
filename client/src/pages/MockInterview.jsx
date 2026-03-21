import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Mic, MicOff, User, Bot, Loader2, Volume2 } from 'lucide-react';

export default function MockInterview() {
  const [isRecording, setIsRecording] = useState(false);
  const [history, setHistory] = useState([
    { role: 'model', text: 'Welcome to your AI Mock Interview session! Are you ready to begin? Please click the microphone button and tell me what technical topic or behavioral question you would like to start with.' }
  ]);
  const [loading, setLoading] = useState(false);
  
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript;
        handleSend(text);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current.onerror = (event) => {
         console.error("Speech recognition error:", event.error);
         setIsRecording(false);
      };
    } else {
      alert("Speech Recognition API is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
    }
    
    // Cleanup synthesis on unmount
    return () => {
      window.speechSynthesis.cancel();
    }
  }, []);

  const handleSend = async (userText) => {
    if (!userText.trim()) return;
    setLoading(true);
    
    const newHistory = [...history, { role: 'user', text: userText }];
    setHistory(newHistory);

    // Format for Gemini API array state, omitting the artificial first 'model' greeting
    // Gemini REQUIRES the first interaction in history to be from 'user'.
    const apiHistory = newHistory.slice(1);
    
    const geminiHistory = apiHistory.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chat`, { 
        history: geminiHistory 
      });
      const botResponse = res.data.reply;
      setHistory(prev => [...prev, { role: 'model', text: botResponse }]);
      speak(botResponse);
    } catch (err) {
      const serverErrMsg = err.response?.data?.reply || err.response?.data?.message || err.message;
      const errMsg = `A connection error occurred: ${serverErrMsg}`;
      setHistory(prev => [...prev, { role: 'model', text: errMsg }]);
      speak("An error occurred connecting to the backend.");
    } finally {
      setLoading(false);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Remove markdown for speech synthesis reading
      const cleanText = text.replace(/[*#_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      // Cancel any ongoing bot speech so it doesn't listen to itself
      window.speechSynthesis.cancel();
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Mic start failed", err);
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 animate-fade-in relative">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 shadow-sm flex items-center gap-4 z-10 relative">
        <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full text-indigo-600 dark:text-indigo-400">
          <Volume2 size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold dark:text-white text-gray-800">AI Voice Mock Interview</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Practice answering questions live with your microphone. The AI will speak back to you.</p>
        </div>
      </div>

      {/* Transcript Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {history.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`p-2 rounded-full shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm text-base leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="flex bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 items-center gap-3 rounded-tl-none">
              <Loader2 className="animate-spin text-indigo-500" size={20} />
              <span className="text-gray-500 dark:text-gray-400">AI is evaluating your response...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Control Area */}
      <div className="bg-white dark:bg-gray-800 p-6 shadow-lg border-t border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-4 sticky bottom-0 z-10 w-full relative">
        <button
          onClick={toggleRecording}
          disabled={loading}
          className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse scale-105' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105'
          } ${loading && 'opacity-50 cursor-not-allowed'}`}
        >
          {isRecording ? <MicOff size={28} /> : <Mic size={28} />}
          {isRecording ? 'Stop Recording' : 'Hold to Speak / Tap to Start'}
        </button>
        <p className={`text-sm ${isRecording ? 'text-red-500 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
          {isRecording ? 'Listening carefully... please speak.' : 'Click the button and start speaking your answer.'}
        </p>
      </div>
    </div>
  );
}
