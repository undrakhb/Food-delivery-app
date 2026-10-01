import axios from "axios";

export const server = axios.create({
  // Set NEXT_PUBLIC_API_URL once the server is deployed somewhere else.
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://food-delivery-app-orcin-beta.vercel.app",
  headers: { "Content-Type": "application/json" },
});

server.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again.",
) => {
  if (error?.code === "ERR_NETWORK") {
    return "Can't connect to the server. Please try again later.";
  }
  return error?.response?.data?.message || fallback;
};

// ---- Food Category ----
export const fetchFoodCategories = async () => {
  const { data } = await server.get("/food-category/get");
  return data.foodCategories;
};

export const createFoodCategory = async (categoryName) => {
  const { data } = await server.post("/food-category/create", { categoryName });
  return data.foodCategory;
};

export const updateFoodCategory = async (id, categoryName) => {
  const { data } = await server.put(`/food-category/update/${id}`, {
    categoryName,
  });
  return data.foodCategory;
};

export const deleteFoodCategory = async (id) => {
  await server.delete(`/food-category/delete/${id}`);
};

// ---- Food ----
export const fetchFoods = async (categoryId) => {
  const { data } = await server.get("/food/list", {
    params: categoryId ? { category: categoryId } : {},
  });
  return data.foods;
};

export const createFood = async (payload) => {
  const { data } = await server.post("/food/create", payload);
  return data.food;
};

export const updateFood = async (id, payload) => {
  const { data } = await server.put(`/food/update/${id}`, payload);
  return data.food;
};

export const deleteFood = async (id) => {
  await server.delete(`/food/delete/${id}`);
};

// ---- Auth ----
export const loginUser = async (email, password) => {
  const { data } = await server.post("/auth/login", { email, password });
  return data;
};

export const signupUser = async (email, password) => {
  const { data } = await server.post("/auth/sign-up", { email, password });
  return data;
};

// address: { street, details, lat, lng }. Returns the updated user.
export const saveDeliveryAddress = async (address) => {
  const { data } = await server.put("/auth/address", address);
  return data.user;
};

// ---- Order ----
export const createOrder = async (payload) => {
  const { data } = await server.post("/food-order", payload);
  return data.foodOrder;
};

export const fetchMyOrders = async () => {
  const { data } = await server.get("/food-order/my");
  return data.foodOrders;
};

// Admin. Returns { foodOrders, total, page, pageSize }.
// sort: "-date" | "date" | "-status" | "status"; from/to: ISO date strings.
export const fetchAllOrders = async ({ page, sort, from, to }) => {
  const { data } = await server.get("/food-order", {
    params: { page, sort, from, to },
  });
  return data;
};

export const updateOrdersStatus = async (orderIds, status) => {
  await server.patch("/food-order/status", { orderIds, status });
};
