import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { fetchCsrfToken } from './services/api'

import './styles/index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

fetchCsrfToken().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})