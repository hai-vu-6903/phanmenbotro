import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import '@fortawesome/fontawesome-free/css/all.min.css';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    // Khi có bản SW mới -> hỏi user có muốn cập nhật không
    if (confirm("Có phiên bản mới. Bạn muốn tải lại không?")) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log("PWA đã sẵn sàng hoạt động offline!");
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// registerSW({
//   immediate: true
// });
