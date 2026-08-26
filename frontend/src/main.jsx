/**
 * main.jsx — React application entry point.
 *
 * This is the very first JavaScript file that runs.
 * It mounts the React app into the <div id="root"> element in index.html.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
