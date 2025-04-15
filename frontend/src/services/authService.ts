import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
} from "@/types/auth";
import api from "./api";

/**
 * Login user
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    // Log the request data
    console.log('Login request data:', credentials);

    // Make the API call
    const response = await api.post("auth/login", credentials);

    // Log the raw response
    console.log('Login raw API response:', response);

    // Return the response
    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Register user
 */
export const register = async (
  userData: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    // Log the request data
    console.log('Register request data:', userData);

    // Make the API call
    const response = await api.post("auth/register", userData);

    // Log the raw response
    console.log('Register raw API response:', response);

    // Return the response
    return response;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get("auth/me", true); // Authenticated request
    return response;
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
};

/**
 * Logout user (server-side)
 */
export const logout = () => {
  api.post("auth/logout", {}, true); // Logout on the server-side
};

/**
 * Clear local storage on logout
 */
export const clearLocalStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
