import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.jsx';

// Auto-update: when new SW takes control, reload so fresh assets are used
registerSW({
  immediate: true,
  onRegisteredSW(swUrl, r) {
    r && setInterval(() => r.update(), 60_000);
  },
  onNeedRefresh() {},
  onOfflineReady() {},
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
