import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, getStoredUser, getStoredToken, getCurrentUser } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: { user: User; token: string } }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_INITIAL_STATE'; payload: { user: User | null; token: string | null } };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_INITIAL_STATE':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: Boolean(action.payload.user && action.payload.token),
        isLoading: false,
      };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = getStoredUser();
        const storedToken = getStoredToken();

        if (storedUser && storedToken) {
          // Verify token is still valid by making a request to the server
          try {
            const currentUser = await getCurrentUser();
            dispatch({ type: 'SET_INITIAL_STATE', payload: { user: currentUser, token: storedToken } });
          } catch (error) {
            // Token is invalid, clear stored data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            dispatch({ type: 'SET_INITIAL_STATE', payload: { user: null, token: null } });
          }
        } else {
          dispatch({ type: 'SET_INITIAL_STATE', payload: { user: null, token: null } });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        dispatch({ type: 'SET_INITIAL_STATE', payload: { user: null, token: null } });
      }
    };

    initializeAuth();
  }, []);

  const login = (user: User, token: string) => {
    dispatch({ type: 'SET_USER', payload: { user, token } });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'CLEAR_USER' });
  };

  const updateUser = (user: User) => {
    if (state.token) {
      dispatch({ type: 'SET_USER', payload: { user, token: state.token } });
    }
  };

  const value = {
    state,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
