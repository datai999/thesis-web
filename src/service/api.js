import axios from "axios";
import { toastError } from "./toastService";

const config = {
  baseURL: "http://localhost:8080/api",
  headers: {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

const AxiosClient = axios.create(config);

AxiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data.data;
    return response;
  },
  (error) => {
    if (error && error.response && error.response.data) {
      const responseError = error.response.data;
      if (responseError.errorCode === "EXPIRED_ID_TOKEN") {
        alert(error.response.data.error);
        // TODO: redirect to login page
        window.location.replace(window.location.origin);
      }
      if (error.response.status === 409) {
        toastError(responseError.errorCode, responseError.errorMessage);
      }
    }
    throw error;
  }
);

export const setLocalUser = (user) => {
  window.localStorage.setItem("token", user.email);
  window.localStorage.setItem("userId", user.id);
};

AxiosClient.interceptors.request.use(async (config) => {
  config.headers.common["X-auth"] = await window.localStorage.getItem("token");
  return config;
});

export default AxiosClient;
