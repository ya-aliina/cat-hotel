export type AuthMode = 'login' | 'register' | 'forgot';

export interface AuthFormProps {
  onSwitch: (mode: AuthMode) => void;
}
