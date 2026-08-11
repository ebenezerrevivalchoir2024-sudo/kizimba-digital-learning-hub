type SwCallback = (status: {
  isOnline: boolean;
  isRegistered: boolean;
  hasUpdate: boolean;
}) => void;

let listeners: SwCallback[] = [];

let currentStatus = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isRegistered: false,
  hasUpdate: false,
};

function notifyListeners() {
  listeners.forEach((cb) => cb({ ...currentStatus }));
}

export function subscribeSwStatus(callback: SwCallback) {
  listeners.push(callback);
  callback({ ...currentStatus });
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('[SW] Service workers not supported');
    return;
  }

  // Listen for online/offline events
  window.addEventListener('online', () => {
    currentStatus.isOnline = true;
    notifyListeners();
  });

  window.addEventListener('offline', () => {
    currentStatus.isOnline = false;
    notifyListeners();
  });

  window.addEventListener('load', () => {
    const swUrl = '/sw.js';

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('[SW] Registered successfully:', registration.scope);
        currentStatus.isRegistered = true;
        notifyListeners();

        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) return;

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('[SW] New content is available; please refresh.');
                currentStatus.hasUpdate = true;
                notifyListeners();
              } else {
                console.log('[SW] Content is cached for offline use.');
              }
            }
          };
        };
      })
      .catch((error) => {
        console.warn('[SW] Registration failed:', error);
      });
  });
}

export function cacheUrlsInServiceWorker(urls: string[]) {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_URLS',
      urls,
    });
  }
}
