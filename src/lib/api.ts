const URLS = {
  auth: "https://functions.poehali.dev/da8c6211-e948-47ba-8caf-102af5801e71",
  products: "https://functions.poehali.dev/a878ccac-511e-4f39-9aaa-0b95fac33530",
  orders: "https://functions.poehali.dev/8b20d717-4fa0-40b9-bf11-3b4b72edd30f",
  stats: "https://functions.poehali.dev/71f05c54-9e86-400c-9e08-0bd2d1dc508c",
};

function getToken() {
  return localStorage.getItem("admin_token") || "";
}

function authHeaders() {
  return { "Content-Type": "application/json", "X-Admin-Token": getToken() };
}

export const api = {
  login: (password: string) =>
    fetch(URLS.auth, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) }).then((r) => r.json()),

  checkAuth: () =>
    fetch(URLS.auth, { method: "GET", headers: authHeaders() }).then((r) => r.json()),

  getProducts: (featured?: boolean) =>
    fetch(`${URLS.products}${featured ? "?featured=true" : ""}`, { headers: { "Content-Type": "application/json" } }).then((r) => r.json()),

  createProduct: (data: object) =>
    fetch(URLS.products, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) }).then((r) => r.json()),

  updateProduct: (data: object) =>
    fetch(URLS.products, { method: "PUT", headers: authHeaders(), body: JSON.stringify(data) }).then((r) => r.json()),

  createOrder: (data: object) =>
    fetch(URLS.orders, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).then((r) => r.json()),

  getOrders: () =>
    fetch(URLS.orders, { method: "GET", headers: authHeaders() }).then((r) => r.json()),

  updateOrderStatus: (id: number, status: string) =>
    fetch(URLS.orders, { method: "PUT", headers: authHeaders(), body: JSON.stringify({ id, status }) }).then((r) => r.json()),

  getStats: () =>
    fetch(URLS.stats, { method: "GET", headers: authHeaders() }).then((r) => r.json()),
};
