import { AIModel } from "@/types/chat";

// Base API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
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
    // For demo purposes, return mock data if API fails
    return [
      {
        id: "1",
        name: "Default GPT-4 Model",
        description: "OpenAI GPT-4 for general purpose use",
        provider: "openai",
        modelId: "gpt-4",
        apiKey: "sk-xxxxxxxxxxxxxxxxxxxx",
        maxTokens: 2048,
        temperature: 0.7,
        isActive: true,
        contextLength: 8192,
        costPerToken: 0.00006,
      },
      {
        id: "2",
        name: "Claude Assistant",
        description: "Anthropic Claude for customer support",
        provider: "anthropic",
        modelId: "claude-3-sonnet",
        apiKey: "sk-ant-xxxxxxxxxxxxxxxxxxxx",
        maxTokens: 4096,
        temperature: 0.5,
        isActive: false,
        contextLength: 100000,
        costPerToken: 0.00008,
      },
    ];
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
