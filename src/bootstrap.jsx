/**
 * bootstrap.jsx
 *
 * Module Federation requires an async boundary — this file is the
 * dynamic import that lets the shell negotiate shared modules with
 * each remote before rendering begins.
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './style.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
