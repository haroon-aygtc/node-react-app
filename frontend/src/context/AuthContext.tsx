import { createContext, useContext, useReducer, useEffect } from "react";
import { User, AuthState } from "@/types/auth";
import * as authService from "@/services/authService";

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" };

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: true, // Start with loading true
  error: null,
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
          // No stored credentials, set not loading and not authenticated
          console.log('No stored credentials found');
          dispatch({ type: "LOGOUT" });
          return;
        }

        try {
          const user = JSON.parse(storedUser) as User;

          // Check if token is expired by trying to get current user
          try {
            console.log('Validating stored token...');
            await authService.getCurrentUser();
            // If successful, user is authenticated
            console.log('Token is valid, user authenticated');
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: { user, token },
            });
          } catch (error) {
            console.log('Token may be expired, trying to refresh...');
            // Try to refresh the token
            try {
              const refreshResponse = await authService.refreshToken();
              // Update with new token and user data
              localStorage.setItem("token", refreshResponse.token);
              localStorage.setItem("user", JSON.stringify(refreshResponse.user));

              console.log('Token refreshed successfully');
              dispatch({
                type: "LOGIN_SUCCESS",
                payload: {
                  user: refreshResponse.user,
                  token: refreshResponse.token
                },
              });
            } catch (refreshError) {
              console.error('Failed to refresh token:', refreshError);
              // Clear storage if refresh fails
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              dispatch({ type: "LOGOUT" });
            }
          }
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
        dispatch({ type: "LOGOUT" });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await authService.login({ email, password });
      console.log('Login API response:', response);

      if (!response || !response.token) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: response.user, token: response.token },
      });

      return true;
    } catch (error) {
      console.error('Login error details:', error);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error instanceof Error ? error.message : "Authentication failed. Please try again.",
      });

      return false;
    }
  };

  const logout = () => {
    authService.logout(); // Logout on the server
    authService.clearLocalStorage(); // Clear local storage
    dispatch({ type: "LOGOUT" }); // Logout locally
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await authService.register({ name, email, password });
      console.log('Register API response:', response);

      if (!response || !response.token) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: response.user, token: response.token },
      });

      return true;
    } catch (error) {
      console.error('Registration error details:', error);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: error instanceof Error ? error.message : "Registration failed",
      });

      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
