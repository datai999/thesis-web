import api from "./api";

const context = {
  token: null,
  user: null,
  semester: null,
  majors: [],
  educationMethods: [],
  subjectDepartments: [],
  degrees: [],

  refreshSemester: () =>
    api.get("/semesters/current").then((res) => (context.semester = res)),
  saveCurrentUser: async () => {
    if (!context.token) {
      context.token = await window.localStorage.getItem("token");
    }
    await api.get("/users/current").then((res) => (context.user = res));
  },
};

const initContext = async () => {
  context.refreshSemester();
  await context.saveCurrentUser();
  api.get("/majors").then((res) => (context.majors = res));
  api.get("/education-methods").then((res) => (context.educationMethods = res));
  api
    .get("/subject-departments")
    .then((res) => (context.subjectDepartments = res));
  api.get("/degrees").then((res) => (context.degrees = res));
  return context.token;
};

export { initContext, context };

export default context;
