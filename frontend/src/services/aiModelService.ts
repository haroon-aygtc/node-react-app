import { AIModel } from "@/types/chat";

// Base API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();

  if (!response.ok) {
    console.error("API error response:", { status: response.status, message: data.message, data });
    throw new Error(data.message || "Authentication failed");
  }

  return data;
};

// Get all AI models
export const getAllAIModels = async (): Promise<AIModel[]> => {
  try {
    const response = await fetch(`${API_URL}/ai-models`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await handleResponse(response);
    return data.data.aiModels;
  } catch (error) {
    console.error("Error fetching AI models:", error);
    throw error;
  }
};

// Get a single AI model
export const getAIModel = async (id: string): Promise<AIModel> => {
  try {
    const response = await fetch(`${API_URL}/ai-models/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await handleResponse(response);
    return data.data.aiModel;
  } catch (error) {
    console.error(`Error fetching AI model ${id}:`, error);
    throw error;
  }
};

// Create a new AI model
export const createAIModel = async (aiModel: Omit<AIModel, "id">): Promise<AIModel> => {
  try {
    const response = await fetch(`${API_URL}/ai-models`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(aiModel),
    });

    const data = await handleResponse(response);
    return data.data.aiModel;
  } catch (error) {
    console.error("Error creating AI model:", error);
    throw error;
  }
};

// Update an existing AI model
export const updateAIModel = async (id: string, aiModel: Partial<AIModel>): Promise<AIModel> => {
  try {
    const response = await fetch(`${API_URL}/ai-models/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(aiModel),
    });

    const data = await handleResponse(response);
    return data.data.aiModel;
  } catch (error) {
    console.error(`Error updating AI model ${id}:`, error);
    throw error;
  }
};

// Delete an AI model
export const deleteAIModel = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/ai-models/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    await handleResponse(response);
  } catch (error) {
    console.error(`Error deleting AI model ${id}:`, error);
    throw error;
  }
};

// Toggle AI model active status
export const toggleAIModelStatus = async (id: string): Promise<AIModel> => {
  try {
    const response = await fetch(`${API_URL}/ai-models/${id}/toggle-active`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await handleResponse(response);
    return data.data.aiModel;
  } catch (error) {
    console.error(`Error toggling AI model ${id} status:`, error);
    throw error;
  }
};

// Get the active AI model
export const getActiveAIModel = async (): Promise<AIModel | null> => {
  try {
    const response = await fetch(`${API_URL}/ai-models/active`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await handleResponse(response);
    return data.data.aiModel;
  } catch (error) {
    console.error("Error fetching active AI model:", error);
    return null;
  }
};
