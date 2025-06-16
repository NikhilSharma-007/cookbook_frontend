import axios from "axios";
import { ApiUrl } from "./Api";

export async function registerUser({ fullName, email, username, password }) {
  const url = `${ApiUrl}/auth/register`;
  const payload = { fullName, email, username, password };

  try {
    const { data } = await axios.post(url, payload, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    throw error?.response?.data || new Error("Registration failed");
  }
}

export async function login({ email, username, password }) {
  if (!email && !username) {
    throw new Error("Email or username is required");
  }

  const url = `${ApiUrl}/auth/login`;
  const formData = { email, username, password };

  try {
    const { data } = await axios.post(url, formData, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    throw error?.response?.data || new Error("Login failed");
  }
}

export async function logoutUser() {
  const url = `${ApiUrl}/auth/logout`;

  try {
    const { data } = await axios.post(url, {}, { withCredentials: true });
    return data;
  } catch (error) {
    throw error?.response?.data || new Error("Logout failed");
  }
}

export async function getCurrentUser() {
  const url = `${ApiUrl}/auth/current-user`;

  try {
    const { data } = await axios.get(url, { withCredentials: true });
    return data;
  } catch (error) {
    throw error?.response?.data || new Error("Fetch user failed");
  }
}
