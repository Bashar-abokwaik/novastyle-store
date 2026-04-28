const BASE_URL = "/api";

export const api = {
  get: async (url: string) => {
    const res = await fetch(BASE_URL + url);
    const message = await res.text();

    if (!res.ok) {
      throw new Error(message || "Request failed");
    }

    return res.json();
  },

  post: async (url: string, body: Record<string, unknown>) => {
    const res = await fetch(BASE_URL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const message = await res.text();

    if (!res.ok) {
      throw new Error(message || "Request failed");
    }

    return res.json();
  },

  put: async (url: string, body: Record<string, unknown>) => {
    const res = await fetch(BASE_URL + url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const message = await res.text();

    if (!res.ok) {
      throw new Error(message || "Request failed");
    }

    return res.json();
  },

  patch: async (url: string, body: Record<string, unknown>) => {
    const res = await fetch(BASE_URL + url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const message = await res.text();

    if (!res.ok) {
      throw new Error(message || "Request failed");
    }

    return res.json();
  },

  delete: async (url: string) => {
    const res = await fetch(BASE_URL + url, {
      method: "DELETE",
    });
    const message = await res.text();

    if (!res.ok) {
      throw new Error(message || "Request failed");
    }

    return res.json();
  },
};
