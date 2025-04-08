
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Make sure we have a valid root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log("Application rendered successfully");
  } catch (error) {
    console.error("Error rendering application:", error);
    // Display a fallback error message in the DOM
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Application Error</h2>
        <p>There was a problem loading the application. Please check the console for details.</p>
      </div>
    `;
  }
}
