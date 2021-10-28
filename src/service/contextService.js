import api from "./api";

const context = {
  user: null,
  semester: null,
  majors: [],
  educationMethods: [],
  subjectDepartments: [],

  refreshSemester: () =>
    api.get("/semesters/current").then((res) => (context.semester = res)),
};

const initContext = async () => {
  context.refreshSemester();
  api.get("/majors").then((res) => (context.majors = res));
  api.get("/education-methods").then((res) => (context.educationMethods = res));
  api
    .get("/subject-departments")
    .then((res) => (context.subjectDepartments = res));
  const userId = await window.localStorage.getItem("userId");
  api.get(`/users/detail/${userId}`).then((res) => (context.user = res));
  return true;
};

export { initContext };

export default context;
