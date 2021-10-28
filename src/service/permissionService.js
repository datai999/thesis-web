import contextHolder from "src/service/contextService";

export const permissionFilter = (e) =>
  !e?.permissions ||
  e?.permissions.some((permission) =>
    contextHolder.user?.permissions.includes(permission)
  );
