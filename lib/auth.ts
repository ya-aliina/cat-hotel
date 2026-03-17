export const AUTH_STORAGE_KEY = 'cat-hotel-auth';
const AUTH_CHANGE_EVENT = 'cat-hotel-auth-change';

export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(AUTH_STORAGE_KEY) === '1';
}

export function signIn() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_STORAGE_KEY, '1');
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function signOut() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function onAuthChange(handler: () => void) {
  if (typeof window === 'undefined') return () => {};

  const listener = () => {
    handler();
  };

  window.addEventListener(AUTH_CHANGE_EVENT, listener);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, listener);
  };
}
