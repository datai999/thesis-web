import contextHolder from "src/service/contextService";

export const PERMISSIONS = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  HEAD_SUBJECT_DEPARTMENT: "HEAD_SUBJECT_DEPARTMENT",
  EDUCATION_STAFF: "EDUCATION_STAFF",
  ADMIN: "ADMIN",
};

export const permissionFilter = (e) => {
  return (
    !e?.permissions ||
    e?.permissions.some((permission) =>
      contextHolder.user?.permissions.includes(permission)
    )
  );
};
