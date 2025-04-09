import { GuestUser } from "@/types/chat";
import api from './api';

// Register a new guest user
export const registerGuest = async (
  fullName: string,
  email: string,
  phone: string
): Promise<{ guestUser: GuestUser; sessionId: string }> => {
  try {
    const response = await api.post('guest/register', { fullName, email, phone });
    return {
      guestUser: response.data.guestUser,
      sessionId: response.data.sessionId,
    };
  } catch (error) {
    console.error("Error registering guest:", error);
    throw error;
  }
};

// Get all guest users (admin only)
export const getAllGuests = async (): Promise<GuestUser[]> => {
  try {
    const response = await api.get('guest', true);
    return response.data.guestUsers;
  } catch (error) {
    console.error("Error fetching guest users:", error);
    throw error;
  }
};

// Get a single guest user by ID (admin only)
export const getGuestById = async (id: string): Promise<GuestUser> => {
  try {
    const response = await api.get(`guest/${id}`, true);
    return response.data.guestUser;
  } catch (error) {
    console.error(`Error fetching guest user ${id}:`, error);
    throw error;
  }
};

// Send a message to a chat session
export const sendMessage = async (
  sessionId: string,
  content: string,
  sender: "user" | "assistant" = "user"
): Promise<{ message: any; aiResponse: any }> => {
  try {
    const response = await api.post(`guest/chat/${sessionId}`, { content, sender });
    return {
      message: response.data.message,
      aiResponse: response.data.aiResponse,
    };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Get chat session messages
export const getChatSessionMessages = async (sessionId: string): Promise<any[]> => {
  try {
    const response = await api.get(`guest/chat/${sessionId}`);
    return response.data.messages;
  } catch (error) {
    console.error(`Error fetching chat session ${sessionId} messages:`, error);
    throw error;
  }
};
