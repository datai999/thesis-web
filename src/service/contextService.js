import api from "./api";

const contextHolder = {
  user: null,
  semester: null,
  majors: [],
  educationMethods: [],

  refreshSemester: () =>
    api.get("/semesters/current").then((res) => (contextHolder.semester = res)),
};

const initContext = async () => {
  contextHolder.refreshSemester();
  api.get("/majors").then((res) => (contextHolder.majors = res));
  api
    .get("/education-methods")
    .then((res) => (contextHolder.educationMethods = res));
  const userId = await window.localStorage.getItem("userId");
  api.get(`/users/detail/${userId}`).then((res) => (contextHolder.user = res));
};

export { initContext };

export default contextHolder;
