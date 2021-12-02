import axios from "axios";
import toastHolder from "./toastService";
const config = {
  baseURL: "http://localhost:8080/api",
  // baseURL: "https://datai-thesis.herokuapp.com/api",
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
        window.location.replace(window.location.origin + "/login");
      }
      if ([400, 404, 409].includes(error.response.status)) {
        toastHolder.error(
          responseError.errorMessage ?? responseError.error,
          responseError.errorCode
        );
      }
    }
    throw error;
  }
);

AxiosClient.interceptors.request.use(async (config) => {
  const token = await window.localStorage.getItem("token");
  if (token) {
    config.headers.common["X-auth"] = "Bearer " + token;
  }

  return config;
});

export default AxiosClient;
