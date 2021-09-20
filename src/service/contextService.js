import api from "./api";

const contextHolder = {
  semester: null,
  majors: [],
  educationMethods: [],

  refreshSemester: () =>
    api.get("/semesters/current").then((res) => (contextHolder.semester = res)),
};

const initContext = () => {
  contextHolder.refreshSemester();
  api.get("/majors").then((res) => (contextHolder.majors = res));
  api
    .get("/education-methods")
    .then((res) => (contextHolder.educationMethods = res));
};

export { initContext };

export default contextHolder;
