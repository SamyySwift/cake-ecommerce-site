import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ReactLenis } from 'lenis/react'

createRoot(document.getElementById("root")!).render(
  <ReactLenis root>
    <App />
  </ReactLenis>
);
