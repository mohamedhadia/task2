import axios from "axios";

export const axiosFetch = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const axiosAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
const token = process.env.TOKEN;
axiosAuth.interceptors.request.use(
  async (config) => {
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
  },
  (error) => Promise.reject(error)
);

axiosAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401
      //   && originalRequest.url === "/accounts/token/refresh"
    ) {
      return Promise.reject(error);
    }

    // if (error.response.status === 403 && !originalRequest._retry) {
    //   originalRequest._retry = true;

    //   const refresh = Cookies.get("refresh_qa");
    //   if (!refresh) {
    //     return Promise.reject(error);
    //   }
    //   const res = await axiosFetch.post("/accounts/token/refresh", {
    //     refresh: refresh,
    //   });

    //   if (res.status === 200) {
    //     Cookies.set("token", res.data.access);
    //     return axiosFetch(originalRequest);
    //   }
    // }

    return Promise.reject(error);
  }
);
