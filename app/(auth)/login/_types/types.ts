export type AuthMode = 'login' | 'register' | 'forgot' | 'verify';

export interface AuthFormProps {
  onSwitch: (mode: AuthMode) => void;
  oauthError?: string | null;
}
