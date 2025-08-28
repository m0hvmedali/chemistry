import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
// import ChatbotTestPage from './ChatbotTestPage.tsx'
import CleanApp from './CleanApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CleanApp />
  </StrictMode>,
)
