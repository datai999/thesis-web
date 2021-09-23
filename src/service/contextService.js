import api from "./api";

const contextHolder = {
  user: null,
  semester: null,
  majors: [],
  educationMethods: [],
  subjectDepartments: [],

  refreshSemester: () =>
    api.get("/semesters/current").then((res) => (contextHolder.semester = res)),
};

const initContext = async () => {
  contextHolder.refreshSemester();
  api.get("/majors").then((res) => (contextHolder.majors = res));
  api
    .get("/education-methods")
    .then((res) => (contextHolder.educationMethods = res));
  api
    .get("/subject-departments")
    .then((res) => (contextHolder.subjectDepartments = res));
  const userId = await window.localStorage.getItem("userId");
  api.get(`/users/detail/${userId}`).then((res) => (contextHolder.user = res));
  return true;
};

export { initContext };

export default contextHolder;
