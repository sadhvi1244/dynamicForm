export const recordConfig = {
  modules: {
    users: {
      route: "/users",
      frontend: {
        apiPath: "/users",
        label: "Users",
        fields: [
          { name: "name", type: "text", label: "Name", required: true },
          { name: "email", type: "email", label: "Email", required: true },
          {
            name: "role",
            type: "dropdown",
            label: "Role",
            required: true,
            options: [
              { value: "admin", label: "Admin" },
              { value: "user", label: "User" },
              { value: "moderator", label: "Moderator" },
            ],
          },
          { name: "status", type: "checkbox", label: "Active" },
        ],
        columns: [
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          {
            key: "status",
            label: "Active",
            render: (val) => (val ? "✓" : "✗"),
          },
        ],
      },
    },
    categories: {
      route: "/categories",
      frontend: {
        apiPath: "/categories",
        label: "Categories",
        fields: [
          { name: "name", type: "text", label: "Name", required: true },
          { name: "description", type: "textarea", label: "Description" },
          { name: "icon", type: "imageLink", label: "Icon URL" },
          { name: "tags", type: "tags", label: "Tags" },
        ],
        columns: [
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          {
            key: "tags",
            label: "Tags",
            render: (val) => val?.join(", ") || "",
          },
        ],
      },
    },
    products: {
      route: "/products",
      frontend: {
        apiPath: "/products",
        label: "Products",
        fields: [
          { name: "name", type: "text", label: "Product Name", required: true },
          { name: "price", type: "number", label: "Price", required: true },
          { name: "description", type: "textarea", label: "Description" },

          {
            name: "category",
            type: "dropdown",
            label: "Category",
            required: true,
            apiOptions: "/categories",
            optionLabel: "name",
            optionValue: "_id",
          },

          { name: "rating", type: "rating", label: "Rating", min: 1, max: 5 },
          { name: "image", type: "imageLink", label: "Product Image" },
          { name: "inStock", type: "checkbox", label: "In Stock" },
          { name: "releaseDate", type: "date", label: "Release Date" },

          {
            name: "materials",
            type: "subString",
            label: "Materials",
            fields: [
              {
                name: "material",
                type: "text",
                label: "Material Name",
                required: true,
              },
              { name: "percentage", type: "number", label: "Percentage" },
            ],
          },
        ],

        columns: [
          { key: "name", label: "Name" },
          { key: "price", label: "Price", render: (val) => `$${val}` },

          {
            key: "category",
            label: "Category",
            render: (val) => val?.name || "",
          },

          { key: "rating", label: "Rating" },
          {
            key: "inStock",
            label: "In Stock",
            render: (val) => (val ? "✓" : "✗"),
          },
          {
            key: "materials",
            label: "Materials",
            type: "subStringTable",
            columns: [
              { key: "material", label: "Material" },
              { key: "percentage", label: "%" },
            ],
          },
        ],
      },
    },
    orders: {
      route: "/orders",
      frontend: {
        apiPath: "/orders",
        label: "Orders",
        fields: [
          { name: "customer", type: "text", label: "Customer", required: true },

          {
            name: "items",
            type: "subString",
            label: "Order Items",
            required: true,
            fields: [
              {
                name: "product",
                type: "dropdown",
                label: "Product",
                required: true,
                apiOptions: "/products",
                optionLabel: "name",
                optionValue: "_id",
              },
              {
                name: "quantity",
                type: "number",
                label: "Quantity",
                required: true,
                min: 1,
              },
            ],
          },

          {
            name: "status",
            type: "dropdown",
            label: "Status",
            required: true,
            options: [
              { value: "pending", label: "Pending" },
              { value: "shipped", label: "Shipped" },
              { value: "delivered", label: "Delivered" },
            ],
          },

          { name: "location", type: "geolocation", label: "Delivery Location" },
        ],
        columns: [
          { key: "customer", label: "Customer" },
          { key: "amount", label: "Amount", render: (v) => `$${v}` },
          { key: "status", label: "Status" },
        ],
      },
    },
  },
};
