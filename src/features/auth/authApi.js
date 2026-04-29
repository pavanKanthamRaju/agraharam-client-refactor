// src/features/auth/api.js

import apiClient from "../../utils/appClient";

export const login = async (credentials) => {
  try {
    const response = await apiClient.post(
      "/auth/login",
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    // This handles both network errors and HTTP errors
    const message =
      error.response?.data?.message || error.message || "Login failed";
    throw new Error(message);
  }
};
export const signup = async (data) => {
  const response = await apiClient.post("/auth/signup", data);
  return response.data;
};
