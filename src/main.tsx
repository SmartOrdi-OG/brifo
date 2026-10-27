import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './context/LanguageContext'
import { DataProvider } from './context/DataContext'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { SubscriptionProvider } from './context/SubscriptionContext'
import { TelegramChrome } from './components/TelegramChrome'
import { enableServiceWorkerAutoReload } from './lib/swAutoReload'
import { installErrorReporting } from './lib/reportError'

// Before the first render, so a fault during start-up is reported too — that
// is the one that takes the screen blank with nothing on it to report from.
installErrorReporting()

enableServiceWorkerAutoReload()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        {/* Above the gates on purpose — see TelegramChrome's own note. */}
        <TelegramChrome />
        <LanguageProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <DataProvider>
                <App />
              </DataProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
