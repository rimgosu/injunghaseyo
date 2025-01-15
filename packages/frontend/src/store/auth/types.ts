export type AuthView =
  | 'init'
  | 'login'
  | 'signup'
  | 'search-password'
  | 'oauth-pending'
  | 'select-character';

export interface AuthState {
  currentView: AuthView;
}
