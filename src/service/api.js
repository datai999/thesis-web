import axios from "axios";

const config = {
  baseURL: "http://localhost:8080/api",
  headers: {
    "content-type": "application/json",
    Lang: "vi",
  },
};

const AxiosClient = axios.create(config);

AxiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data.data;
    return response;
  },
  (error) => {
    throw error;
  }
);

const CommonApi = (baseURL = "") => {
  return {
    get: (url, config) => {
      return AxiosClient.get(baseURL + url, config);
    },
    post: (url, data, config) => {
      return AxiosClient.post(baseURL + url, data, config);
    },
    getAll: () => {
      return AxiosClient.get(baseURL);
    },
    getPaging: (pageParam, url = "") => {
      return AxiosClient.get(baseURL + url + "/paging", { params: pageParam });
    },
    create: (data, url = baseURL) => {
      return AxiosClient.post(url, data);
    },
    postExample: (example, url = "") => {
      return AxiosClient.post(baseURL + url + "/example", example);
    },
    pagingSearch: (searchRequest) => {
      return AxiosClient.post(baseURL + "/paging/search", searchRequest);
    },
  };
};

export const StudentApi = {
  ...CommonApi("/student"),

  search: (value) => {
    const url = "/student" + "/search?value=" + value;
    return AxiosClient.get(url);
  },
};

export const ConstApi = {
  ...CommonApi("/const"),
};

export default CommonApi();
