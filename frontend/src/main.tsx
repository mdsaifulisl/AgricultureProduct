import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from './app/store';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

// ইমপোর্ট পাথটি আপডেট করা হয়েছে
import { registerSW } from 'virtual:pwa-register';

// Service Worker রেজিস্টার করা হচ্ছে
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Provider>
  </StrictMode>,
)
