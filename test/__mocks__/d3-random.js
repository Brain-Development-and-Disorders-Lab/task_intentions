/**
 * Mock for d3-random library for Jest tests
 * Provides deterministic random number generation for testing
 */

// Mock randomUniform function that returns a generator function
const mockRandomUniform = (min, max) => {
  // Return a function that generates deterministic values for testing
  let callCount = 0;
  return () => {
    callCount++;
    // Generate deterministic values based on call count for consistent testing
    const seed = (callCount * 0.1) % 1;
    return min + (max - min) * seed;
  };
};

module.exports = {
  randomUniform: mockRandomUniform,
};
