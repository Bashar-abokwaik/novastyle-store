import { store } from "../../app/store";
import { logout } from "../../features/auth/authSlice";
// This file contains the API client for making HTTP requests to the backend server.

// The base URL for the API endpoints.
const BASE_URL = import.meta.env.VITE_API_URL;

// A generic function to make HTTP requests and handle responses.
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(BASE_URL + url, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}), // Merge any additional headers provided in the options
    },
    ...options, // Spread the options to allow for method, body, etc.
  });

  const data = await res.json().catch(() => null);
  // Handle unauthorized responses by removing the token and redirecting to the login page
  if (res.status === 401) {
    localStorage.removeItem("token");

    store.dispatch(logout());

    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }
  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data as T;
}

// The API client object that provides methods for making GET, POST, PUT, PATCH, and DELETE requests.
export const api = {
  // GET request method
  get: <T>(url: string, withAuth: boolean = false) => {
    // If withAuth is true, include the authorization header with the token from localStorage
    return request<T>(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(withAuth && localStorage.getItem("token")
          ? {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          : {}),
      },
    });
  },

  // POST request method
  post: <T>(
    url: string,
    body: Record<string, unknown>,
    withAuth: boolean = false,
  ) => {
    return request<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...(withAuth && localStorage.getItem("token")
          ? {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          : {}),
      },
    });
  },

  // PUT request method
  put: <T>(
    url: string,
    body: Record<string, unknown>,
    withAuth: boolean = false,
  ) => {
    return request<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...(withAuth && localStorage.getItem("token")
          ? {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          : {}),
      },
    });
  },

  // PATCH request method
  patch: <T>(
    url: string,
    body: Record<string, unknown>,
    withAuth: boolean = false,
  ) => {
    return request<T>(url, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...(withAuth && localStorage.getItem("token")
          ? {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          : {}),
      },
    });
  },

  // DELETE request method
  delete: <T>(url: string, withAuth: boolean = false) => {
    return request<T>(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(withAuth && localStorage.getItem("token")
          ? {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          : {}),
      },
    });
  },
};
