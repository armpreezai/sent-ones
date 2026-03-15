/**
 * API Configuration
 * 
 * In the AI Studio environment, the frontend and backend run on the same port (3000).
 * Using relative paths like '/api/...' is the most reliable way to ensure
 * the frontend always hits the correct backend for the current environment.
 */

export const getApiUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // For standard web usage in AI Studio, relative paths work best
  return cleanPath;
};
