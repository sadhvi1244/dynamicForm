class ApiService {
  constructor() {
    this.data = {
      categories: [
        {
          id: "1",
          name: "Electronics",
          description: "Electronic devices",
          tags: ["tech", "gadgets"],
        },
        {
          id: "2",
          name: "Clothing",
          description: "Apparel and fashion",
          tags: ["fashion", "wear"],
        },
      ],
      users: [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "admin",
          status: true,
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "user",
          status: true,
        },
      ],
      products: [
        {
          id: "1",
          name: "Laptop",
          price: 999,
          description: "High-performance laptop",
          category: "Electronics",
          rating: 5,
          inStock: true,
          materials: [
            { material: "Aluminum", percentage: 70 },
            { material: "Plastic", percentage: 30 },
          ],
        },
      ],
      orders: [],
    };
  }

  async request(url, method = "GET", data = null) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const modulePath = url.replace("/api/", "");

    if (!this.data[modulePath]) {
      this.data[modulePath] = [];
    }

    switch (method) {
      case "GET":
        return { data: this.data[modulePath] };
      case "POST":
        const newItem = { ...data, id: Date.now().toString() };
        this.data[modulePath].push(newItem);
        return { data: newItem };
      case "PUT":
        const updateId = url.split("/").pop();
        const updateIndex = this.data[modulePath].findIndex(
          (item) => item.id === updateId
        );
        if (updateIndex !== -1) {
          this.data[modulePath][updateIndex] = { ...data, id: updateId };
          return { data: this.data[modulePath][updateIndex] };
        }
        throw new Error("Item not found");
      case "DELETE":
        const deleteId = url.split("/").pop();
        this.data[modulePath] = this.data[modulePath].filter(
          (item) => item.id !== deleteId
        );
        return { data: { success: true } };
      default:
        throw new Error("Unsupported method");
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
