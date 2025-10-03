import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://jsonplaceholder.typicode.com/posts";
export const useMock =
  (import.meta.env.VITE_USE_MOCK_API || "false") === "true";

export const http = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Simple localStorage mock fallback (for demo without backend)
const LS = {
  read(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  write(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
};

export const mockApi = {
  products: {
    list: async () =>
      LS.read("mock_products", [
        { id: 1, name: "T-Shirt", price: 12.99, category: "Apparel" },
        { id: 2, name: "Headphones", price: 49.9, category: "Electronics" },
        { id: 3, name: "Mug", price: 7.5, category: "Home" },
        { id: 4, name: "Notebook", price: 5.25, category: "Stationery" },
      ]),
    create: async (p) => {
      const list = await mockApi.products.list();
      const id = (list.at(-1)?.id || 0) + 1;
      const newP = { id, ...p };
      LS.write("mock_products", [...list, newP]);
      return newP;
    },
    update: async (id, patch) => {
      const list = await mockApi.products.list();
      const next = list.map((p) => (p.id === id ? { ...p, ...patch, id } : p));
      LS.write("mock_products", next);
      return next.find((p) => p.id === id);
    },
    remove: async (id) => {
      const list = await mockApi.products.list();
      LS.write(
        "mock_products",
        list.filter((p) => p.id !== id)
      );
      return { ok: true };
    },
  },
  orders: {
    list: async () => LS.read("mock_orders", []),
    create: async (order) => {
      const list = await mockApi.orders.list();
      const id = (list.at(-1)?.id || 0) + 1;
      const newO = {
        id,
        status: "paid",
        createdAt: new Date().toISOString(),
        ...order,
      };
      LS.write("mock_orders", [...list, newO]);
      return newO;
    },
    update: async (id, patch) => {
      const list = await mockApi.orders.list();
      const next = list.map((o) => (o.id === id ? { ...o, ...patch, id } : o));
      LS.write("mock_orders", next);
      return next.find((o) => o.id === id);
    },
  },
  payments: {
    createIntent: async (payload) => {
      // mock client secret
      return {
        clientSecret: "pi_mock_secret_" + Math.random().toString(36).slice(2),
      };
    },
  },
};
