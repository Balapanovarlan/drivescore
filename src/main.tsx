import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import './i18n'
import App from './App'

async function bootstrap() {
  // Demo build: there is no backend — the axios mock adapter serves data
  // from src/data/drivers.mock.ts in every environment, production included.
  await import('./mocks/axiosMock')

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
