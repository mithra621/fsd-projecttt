async function seed() {
  try {
    const res1 = await fetch('http://localhost:5000/api/resources/seed', { method: 'POST' });
    console.log('Resources Seed Status:', res1.status);
    
    const res2 = await fetch('http://localhost:5000/api/quiz/seed', { method: 'POST' });
    console.log('Quiz Seed Status:', res2.status);
  } catch(err) {
    console.error('Seed error:', err.message);
  }
}
seed();
