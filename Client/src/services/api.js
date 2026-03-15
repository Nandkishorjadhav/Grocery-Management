const RAW_API_URL =
  import.meta.env.VITE_PROD_BASE_URL ||
  (import.meta.env.DEV
    ? "https://grocery-management-lg7u.onrender.com/api"
    : "/api");

const API_URL = RAW_API_URL.replace(/\/$/, "");

class ApiService {
  async request(endpoint, options = {}) {
    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;
    const url = `${API_URL}${normalizedEndpoint}`;

    // Get token from localStorage
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Server error");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Something went wrong");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      // Improve error message for network errors
      if (error.message === "Failed to fetch") {
        throw new Error(
          "Cannot connect to server. Please ensure the backend server is running on port 5000.",
        );
      }
      throw error;
    }
  }

  // GET request
  async get(endpoint, options = {}) {
    let url = endpoint;

    // Handle query parameters
    if (options.params) {
      const queryString = new URLSearchParams(options.params).toString();
      url = queryString ? `${endpoint}?${queryString}` : endpoint;
    }

    return this.request(url, { method: "GET", ...options });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

export default new ApiService();
