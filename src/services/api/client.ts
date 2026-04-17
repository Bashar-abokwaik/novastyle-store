const BASE_URL = "/api";

export const api = {
  get: async (url: string) => {
    const res = await fetch(BASE_URL + url);

    if (!res.ok) {
      throw new Error("Request failed");
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

    if (!res.ok) {
      throw new Error("Request failed");
    }

    return res.json();
  },
};
