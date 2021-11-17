import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import BaseTable from "src/components/BaseTable";
import api from "src/service/api";
import { PERMISSIONS } from "src/service/permissionService";

const fields = [
  { key: "code", label: "Mã số", _style: { width: 1 } },
  { key: "firstName", label: "Họ" },
  { key: "lastName", label: "Tên" },
  { key: "gender", label: "Giới tính", _style: { width: 100 } },
  {
    key: "degreeName",
    userType: ["teacher", "head"],
    label: "Học vị",
    _style: { width: 80 },
  },
  {
    key: "subjectDepartmentName",
    userType: ["teacher", "head"],
    label: "Bộ môn",
    _style: { minWidth: 130 },
  },
  {
    key: "educationMethodName",
    userType: ["student"],
    label: "Đào tạo",
    _style: { width: 120 },
  },
  {
    key: "majorName",
    userType: ["student"],
    label: "Chuyên ngành",
    _style: { width: 150 },
  },
  { key: "email", label: "Email" },
];

const getPermission = (userType) => {
  switch (userType) {
    case "head":
      return PERMISSIONS.HEAD_SUBJECT_DEPARTMENT;
    case "edu-staff":
      return PERMISSIONS.EDUCATION_STAFF;
    case "users":
      return PERMISSIONS.STUDENT;
    default:
      return userType.toUpperCase();
  }
};

const Component = () => {
  const history = useHistory();
  const location = useLocation();
  const userType = location.pathname.split("/").pop();
  const userFields = fields.filter(
    (e) => !e.userType || e.userType?.includes(userType)
  );

  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .post(
        "/users/example",
        {
          permission: getPermission(userType),
        },
        { params: { direction: "DESC" } }
      )
      .then(setData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BaseTable
      fields={userFields}
      items={data}
      tableProps={{
        clickableRows: true,
        onRowClick: (item) => history.push(`/users/${item.id}`),
      }}
    />
  );
};

export default Component;
