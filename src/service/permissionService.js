import contextHolder from "src/service/contextService";

export const PERMISSIONS = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  HEAD_SUBJECT_DEPARTMENT: "HEAD_SUBJECT_DEPARTMENT",
  EDUCATION_STAFF: "EDUCATION_STAFF",
  ADMIN: "ADMIN",
};

export const loginUserHasAny = (permissions) => {
  return permissions.includes(contextHolder.user?.permission);
};

export const loginUserIsStudent = () => {
  return [PERMISSIONS.STUDENT].includes(contextHolder.user?.permission);
};

export const loginUserIsHead = () => {
  return [PERMISSIONS.HEAD_SUBJECT_DEPARTMENT].includes(
    contextHolder.user?.permission
  );
};

export const loginUserIsTeacher = () => {
  return [PERMISSIONS.TEACHER, PERMISSIONS.HEAD_SUBJECT_DEPARTMENT].includes(
    contextHolder.user?.permission
  );
};

export const permissionFilter = (e) => {
  return !e?.permissions || loginUserHasAny(e.permissions);
};
