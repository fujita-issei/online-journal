import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from "./store.ts"
import { Provider } from "react-redux"
import { BrowserRouter as Router } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ""

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
    <Router>
    <Provider store = {store}>
    <App />
    </Provider>
    </Router>
    </GoogleOAuthProvider>
  </StrictMode>,
)
