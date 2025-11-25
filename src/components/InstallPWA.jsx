import { useEffect, useState } from 'react';
import './InstallPWA.css';

export default function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    const handler = (e) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
      setIsVisible(true);
      document.body.classList.add('has-pwa-banner');
    };

    // Check if the app is already installed
    const checkIfAppInstalled = () => {
      const isAppInstalled = 
        window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');
      
      setIsInstalled(isAppInstalled);
      if (isAppInstalled) {
        setIsVisible(false);
        document.body.classList.remove('has-pwa-banner');
      }
    };

    // Initial check
    checkIfAppInstalled();

    // Listen for app installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      document.body.classList.remove('has-pwa-banner');
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('beforeinstallprompt', handler);

    // Check again after a delay to ensure we catch the PWA state
    const timer = setTimeout(() => {
      checkIfAppInstalled();
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
      document.body.classList.remove('has-pwa-banner');
    };
  }, []);

  const installApp = async () => {
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
    const { outcome } = await promptInstall.userChoice;
    if (outcome === 'accepted') {
      setSupportsPWA(false);
      setIsInstalled(true);
    }
  };

  if (!isVisible || !supportsPWA || isInstalled) {
    return null;
  }

  return (
    <div className="install-pwa-banner">
      <div className="d-flex align-items-center justify-content-between p-3 bg-white shadow-sm">
        <div className="d-flex align-items-center">
          <i className="fas fa-mobile-alt me-2 text-primary"></i>
          <div>
            <div className="fw-bold">Cài đặt ứng dụng</div>
            <small className="text-muted">Truy cập nhanh hơn và sử dụng offline</small>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button 
            onClick={() => {
              setIsVisible(false);
              document.body.classList.remove('has-pwa-banner');
            }}
            className="btn btn-outline-secondary btn-sm"
          >
            Bỏ qua
          </button>
          <button 
            onClick={installApp}
            className="btn btn-primary btn-sm"
          >
            Cài đặt
          </button>
        </div>
      </div>
    </div>
  );
}
