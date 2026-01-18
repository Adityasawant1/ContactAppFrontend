import API from "./axios";

export const registerUser = (data) =>
  API.post("/auth/register", data);

export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);

  // backend returns raw JWT string
  localStorage.setItem("token", res.data);

  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
