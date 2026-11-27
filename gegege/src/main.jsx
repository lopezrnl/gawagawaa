import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import DataProvider from './state/DataProvider.jsx'
import UIProvider from './state/UIProvider.jsx'
import ToastProvider from './components/ToastProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DataProvider>
        <UIProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </UIProvider>
      </DataProvider>
    </BrowserRouter>
  </StrictMode>,
)
