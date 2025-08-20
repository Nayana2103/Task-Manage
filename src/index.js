import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Dynamically create root div
function component() {
  const element = document.createElement('div');
  element.id = 'root';
  return element;
}
document.body.appendChild(component());

// Now use ReactDOM to render your app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
