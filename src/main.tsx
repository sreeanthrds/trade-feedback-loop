
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check for required environment variables
if (!import.meta.env.VITE_SUPABASE_URL) {
  console.warn('Warning: Missing VITE_SUPABASE_URL environment variable. Some features will be limited.');
  // You might want to display a more user-friendly error in the UI
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Warning: Missing VITE_SUPABASE_ANON_KEY environment variable. Some features will be limited.');
  // You might want to display a more user-friendly error in the UI
}

// Make sure we have a valid root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  const root = createRoot(rootElement);
  root.render(<App />);
}
