/**
 * mathematical Vector-Space Information Retrieval Engine
 * Used for AI Candidate Scoring
 */

// Step 1: Formal feature selection through Bag-of-Words (BoW) vectorization
function getFeatureVector(documentText, featureVocabulary) {
  const terms = documentText.toLowerCase().match(/\w+/g) || [];
  
  // Create a multidimensional vector space representing term frequencies
  return featureVocabulary.map(feature => {
     return terms.filter(t => t === feature.toLowerCase()).length;
  });
}

// Step 2: Calculate angle closeness in high-dimensional space
function getCosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0; // Prevent divide by zero for blank vectors
  
  // Return the Cosine value [0.0 to 1.0] of the vectors
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = { getFeatureVector, getCosineSimilarity };
