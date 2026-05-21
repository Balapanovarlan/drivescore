import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import './i18n'
import App from './App'

async function bootstrap() {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    await import('./mocks/axiosMock')
  }
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
