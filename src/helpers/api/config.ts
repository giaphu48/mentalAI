import axios from "axios";

let token: string | undefined;

if (typeof window !== "undefined") {
  const storedToken = window.localStorage.getItem("token");
  if (storedToken) {
    token = `Bearer ${storedToken}`;
  }
}

const axiosInstance = axios.create({

  baseURL: "http://localhost:3025/",
  withCredentials: true,
  headers: {
    token: token || "",
  },
});

export default axiosInstance;
