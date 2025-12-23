const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

class ApiService {
  async request(url, method = "GET", data = null) {
    // ✅ Always prefix /api here
    const fullUrl = `${API_BASE_URL}/api${url}`;

    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data && (method === "POST" || method === "PUT")) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(fullUrl, options);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      const result = await response.json();
      return { data: result.data || result }; // normalize response
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  get(url) {
    return this.request(url, "GET");
  }

  post(url, data) {
    return this.request(url, "POST", data);
  }

  put(url, data) {
    return this.request(url, "PUT", data);
  }

  delete(url) {
    return this.request(url, "DELETE");
  }
}

export const api = new ApiService();
