const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

// @desc    Get all quizzes
// @route   GET /api/quiz
// @access  Private
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({}).select('-questions.correctAnswer');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single quiz by id
// @route   GET /api/quiz/:id
// @access  Private
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswer');
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit quiz result
// @route   POST /api/quiz/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score += 1;
      }
    });
    
    const result = await Result.create({
      userId: req.user._id,
      quizId,
      score,
      totalQuestions: quiz.questions.length
    });
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed quizzes
// @route   POST /api/quiz/seed
// @access  Public (for development)
const seedQuizzes = async (req, res) => {
  try {
    await Quiz.deleteMany();
    const seededQuizzes = await Quiz.insertMany([
      {
        title: 'Advanced JavaScript & Types',
        category: 'Technical',
        timeLimitMinutes: 15,
        questions: [
          { questionText: 'What is the output of typeof null?', options: ['null', 'undefined', 'object', 'number'], correctAnswer: 'object' },
          { questionText: 'What does the bind() method do?', options: ['Immediately calls a function', 'Creates a new function with a forced "this" value', 'Links two arrays', 'Connects to an external API'], correctAnswer: 'Creates a new function with a forced "this" value' },
          { questionText: 'Which represents strict equality?', options: ['=', '==', '===', '!==='], correctAnswer: '===' },
          { questionText: 'What is Web Storage API limit for localStorage limit roughly around?', options: ['1MB', '5MB', '50MB', 'Unlimited'], correctAnswer: '5MB' },
          { questionText: 'What does Promise.all() do?', options: ['Waits for all promises to resolve or one to reject', 'Waits for any promise to resolve', 'Rejects all promises', 'It is deprecated'], correctAnswer: 'Waits for all promises to resolve or one to reject' },
          { questionText: 'What is Event Bubbling?', options: ['Events triggering on siblings', 'Events triggering from parent down to child', 'Events triggering from child up to the window', 'A memory leak'], correctAnswer: 'Events triggering from child up to the window' },
          { questionText: 'How do you deep clone an object natively?', options: ['Object.assign()', 'JSON.parse(JSON.stringify())', 'Spread operator', 'clone()'], correctAnswer: 'JSON.parse(JSON.stringify())' },
          { questionText: 'What is Hoisting?', options: ['Lifting heavy DOM elements', 'Loading scripts faster', 'Moving declarations to the top of their scope entirely during compilation', 'A CSS Flexbox property'], correctAnswer: 'Moving declarations to the top of their scope entirely during compilation' }
        ]
      },
      {
        title: 'React.js Deep Dive',
        category: 'Technical',
        timeLimitMinutes: 20,
        questions: [
          { questionText: 'What is the purpose of React.memo?', options: ['To memoize expensive calculations', 'To prevent unnecessary re-renders of a functional component', 'To cache API responses', 'To create global state'], correctAnswer: 'To prevent unnecessary re-renders of a functional component' },
          { questionText: 'How does the Virtual DOM work in React?', options: ['It updates the real DOM on every state change', 'It creates a lightweight copy of the real DOM and diffs it before updating', 'It replaces the browser DOM entirely', 'It is a plugin for faster rendering'], correctAnswer: 'It creates a lightweight copy of the real DOM and diffs it before updating' },
          { questionText: 'What is a closure trap in React hooks?', options: ['When useEffect causes an infinite loop', 'When a state variable inside a hook callback captures a stale value from an older render', 'When a component unmounts unexpectedly', 'When Context API fails to update'], correctAnswer: 'When a state variable inside a hook callback captures a stale value from an older render' },
          { questionText: 'Which hook should be used for mutable variables that do NOT trigger re-renders?', options: ['useState', 'useMemo', 'useRef', 'useEffect'], correctAnswer: 'useRef' },
          { questionText: 'What is the second argument of useEffect used for?', options: ['Dependency array to control execution', 'Error handling', 'Cleanup function', 'State initialization'], correctAnswer: 'Dependency array to control execution' },
          { questionText: 'What is Prop Drilling?', options: ['Passing data deeply through the component tree via props', 'A tool to drill into React internals', 'A method of fetching data', 'Using Context API'], correctAnswer: 'Passing data deeply through the component tree via props' },
          { questionText: 'Which React component lifecycle method is called immediately after a component is mounted?', options: ['componentDidMount', 'componentWillMount', 'componentDidUpdate', 'componentWillUpdate'], correctAnswer: 'componentDidMount' },
          { questionText: 'How do you perform code-splitting in React?', options: ['Using React.lazy and Suspense', 'Using webpack manually', 'Using iframe', 'It is not possible'], correctAnswer: 'Using React.lazy and Suspense' }
        ]
      },
      {
        title: 'Node.js & Backend Architecture',
        category: 'Technical',
        timeLimitMinutes: 20,
        questions: [
          { questionText: 'How does Node.js handle concurrency despite being single-threaded?', options: ['Multi-threading via Web Workers', 'The V8 engine optimizes standard loops', 'Event Loop and asynchronous I/O operations', 'It spawns child processes automatically'], correctAnswer: 'Event Loop and asynchronous I/O operations' },
          { questionText: 'What is the purpose of middleware in Express.js?', options: ['To connect to databases easily', 'To execute code before the final route handler responds', 'To serve HTML files', 'To hash passwords'], correctAnswer: 'To execute code before the final route handler responds' },
          { questionText: 'Which of these is NOT a phase of the Node.js Event Loop?', options: ['Timers', 'Poll', 'Check', 'Render'], correctAnswer: 'Render' },
          { questionText: 'What is an indexing strategy in databases used for?', options: ['Styling the database UI', 'Speeding up data retrieval at the cost of slower writes', 'Increasing the storage capacity', 'Creating primary keys automatically'], correctAnswer: 'Speeding up data retrieval at the cost of slower writes' },
          { questionText: 'How is JWT (JSON Web Token) securely transmitted?', options: ['Via URL parameters', 'Inside the request body', 'Through the Authorization HTTP header', 'Saved in a cookie without HttpOnly'], correctAnswer: 'Through the Authorization HTTP header' },
          { questionText: 'What is the difference between PUT and PATCH?', options: ['PUT is for creating, PATCH is for deleting', 'PUT fully replaces an entity, PATCH partially updates it', 'They are synonymous', 'PATCH is faster than PUT'], correctAnswer: 'PUT fully replaces an entity, PATCH partially updates it' },
          { questionText: 'What does CORS stand for?', options: ['Cross-Origin Resource Sharing', 'Cross-Optimization Runtime System', 'Central Origin Routing Service', 'Computer Operated Routing Switch'], correctAnswer: 'Cross-Origin Resource Sharing' },
          { questionText: 'Why use Redis in a Node.js backend?', options: ['As a primary relational database', 'For extremely fast in-memory caching', 'To serve static files', 'To encrypt passwords'], correctAnswer: 'For extremely fast in-memory caching' }
        ]
      },
      {
        title: 'DSA: Arrays, Trees & Strings',
        category: 'DSA',
        timeLimitMinutes: 25,
        questions: [
          { questionText: 'What is the time complexity of searching an unsorted array?', options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'], correctAnswer: 'O(N)' },
          { questionText: 'Which algorithm finds an element in a sorted array in O(log N) time?', options: ['Linear Search', 'Binary Search', 'Bubble Sort', 'DFS'], correctAnswer: 'Binary Search' },
          { questionText: 'What is an Anagram?', options: ['A word formed by rearranging the letters of another', 'A string with repeating characters', 'A string that reads the same forwards and backwards', 'A numerical string pattern'], correctAnswer: 'A word formed by rearranging the letters of another' },
          { questionText: 'How do you efficiently check if a string is a palindrome?', options: ['Sort the string', 'Two-pointer approach (start and end)', 'Recursion', 'Split and map'], correctAnswer: 'Two-pointer approach (start and end)' },
          { questionText: 'What is a Sliding Window technique?', options: ['Creating a UI window', 'Iterating over a subset of an array to optimize O(N^2) to O(N)', 'Reversing string chunks', 'Sorting data efficiently'], correctAnswer: 'Iterating over a subset of an array to optimize O(N^2) to O(N)' },
          { questionText: 'What data structure is extremely efficient for finding duplicates in an Array?', options: ['A nested for-loop', 'Hash Set', 'Linked List', 'Stack'], correctAnswer: 'Hash Set' },
          { questionText: 'Which Traversal technique visits Left, then Root, then Right?', options: ['Inorder', 'Preorder', 'Postorder', 'Level-order'], correctAnswer: 'Inorder' },
          { questionText: 'Which data structure natively uses LIFO (Last In First Out)?', options: ['Queue', 'Array', 'Stack', 'Tree'], correctAnswer: 'Stack' }
        ]
      },
      {
        title: 'System Design & Scalability',
        category: 'Technical',
        timeLimitMinutes: 25,
        questions: [
          { questionText: 'What is horizontal scaling?', options: ['Upgrading the CPU and RAM of an existing server', 'Adding more servers to a distributed system', 'Moving to a relational database', 'Using microservices'], correctAnswer: 'Adding more servers to a distributed system' },
          { questionText: 'What role does a Load Balancer play?', options: ['Securing the network', 'Distributing incoming traffic across multiple servers', 'Caching API requests', 'Converting NoSQL to SQL'], correctAnswer: 'Distributing incoming traffic across multiple servers' },
          { questionText: 'What is CAP Theorem?', options: ['Consistency, Availability, Partition Tolerance', 'Concurrency, Authorization, Protocol', 'Cache, API, Performance', 'Computing, Application, Publishing'], correctAnswer: 'Consistency, Availability, Partition Tolerance' },
          { questionText: 'When should you use NoSQL (like MongoDB) over SQL (like PostgreSQL)?', options: ['When strict ACID compliance is needed', 'When the schema is highly dynamic and flexible', 'When executing complex JOIN queries', 'When data volume is very small'], correctAnswer: 'When the schema is highly dynamic and flexible' },
          { questionText: 'What is Rate Limiting used for?', options: ['Increasing API speed', 'Preventing DDoS attacks and API abuse', 'Parsing JSON bodies', 'Storing session tokens'], correctAnswer: 'Preventing DDoS attacks and API abuse' },
          { questionText: 'Which protocol is standard for real-time bi-directional messaging?', options: ['HTTP/1.1', 'WebSockets', 'GraphQL', 'REST'], correctAnswer: 'WebSockets' },
          { questionText: 'What is Data Sharding?', options: ['Encrypting sensitive rows', 'Splitting a massive DB table horizontally across multiple machines', 'Adding columns to SQL', 'Caching query results'], correctAnswer: 'Splitting a massive DB table horizontally across multiple machines' },
          { questionText: 'What is the standard latency of reading from RAM?', options: ['100 seconds', '1 millisecond', '~100 nanoseconds', '5 seconds'], correctAnswer: '~100 nanoseconds' }
        ]
      },
      {
        title: 'Logical Reasoning & Quantitative Aptitude',
        category: 'Aptitude',
        timeLimitMinutes: 20,
        questions: [
          { questionText: 'If 5 machines take 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?', options: ['5 minutes', '100 minutes', '20 minutes', '1 minute'], correctAnswer: '5 minutes' },
          { questionText: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?', options: ['$0.10', '$0.05', '$1.00', '$0.50'], correctAnswer: '$0.05' },
          { questionText: 'What comes next in the sequence: 2, 6, 12, 20, 30, ...?', options: ['38', '40', '42', '44'], correctAnswer: '42' },
          { questionText: 'If all bloops are razzies and all razzies are lazzies, are all bloops definitively lazzies?', options: ['Yes', 'No', 'Cannot determine', 'Only sometimes'], correctAnswer: 'Yes' },
          { questionText: 'A clock shows 3:15. What is the angle between the hour and minute hands?', options: ['0 degrees', '7.5 degrees', '15 degrees', '22.5 degrees'], correctAnswer: '7.5 degrees' },
          { questionText: 'If I travel 60mph for 2 hours, and 30mph for 2 hours, what is my average speed?', options: ['45mph', '40mph', '50mph', '15mph'], correctAnswer: '45mph' },
          { questionText: 'Translate the anagram: "dormitory" -> ?', options: ['dirty room', 'door room', 'tired room', 'dorm story'], correctAnswer: 'dirty room' },
          { questionText: 'Can a right triangle have two right angles?', options: ['Yes', 'No', 'Only in 3D space', 'Only if it is isosceles'], correctAnswer: 'No' }
        ]
      },
      {
        title: 'Modern HR Behavioral (STAR Framework)',
        category: 'HR',
        timeLimitMinutes: 10,
        questions: [
          { questionText: 'What does STAR stand for?', options: ['Situation, Task, Action, Result', 'System, Time, Action, Resource', 'Simple, Target, Area, Range', 'State, Topic, Aim, Resolution'], correctAnswer: 'Situation, Task, Action, Result' },
          { questionText: 'What is the purpose of the STAR method?', options: ['To negotiate salary', 'To structure behavioral interview answers logically', 'To design system architectures', 'To solve algorithm problems'], correctAnswer: 'To structure behavioral interview answers logically' },
          { questionText: 'Which part of STAR should take up the most time in your answer?', options: ['Situation', 'Task', 'Action', 'Result'], correctAnswer: 'Action' },
          { questionText: 'When highlighting a past failure, what is the most important element to include?', options: ['Whose fault it was', 'How quickly you quit the project', 'What you specifically learned and how you changed your approach', 'How much money it cost'], correctAnswer: 'What you specifically learned and how you changed your approach' },
          { questionText: 'How long should a standard STAR response last?', options: ['10-15 seconds', '1.5 to 3 minutes', '5-10 minutes', '15 minutes'], correctAnswer: '1.5 to 3 minutes' }
        ]
      }
    ]);
    res.json(seededQuizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new quiz
// @route   POST /api/quiz
// @access  Private/Admin
const createQuiz = async (req, res) => {
  try {
    const { title, category, timeLimitMinutes, questions } = req.body;
    const quiz = await Quiz.create({ title, category, timeLimitMinutes, questions });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getQuizzes, getQuizById, submitQuiz, seedQuizzes, createQuiz };
