import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { i18nReady } from './i18n'
import './styles/global.css'
import './styles/reference-scenes.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('The application root element was not found.')
}

await i18nReady

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
