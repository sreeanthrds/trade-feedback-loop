
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Using createRoot which is the recommended way in React 18+
const container = document.getElementById("root");
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);
root.render(<App />);
