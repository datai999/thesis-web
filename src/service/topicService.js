import { CBadge, CTooltip } from "@coreui/react";
import React from "react";

const fields = [
  { key: "id", label: "Mã", _style: { width: "1%" } },
  { key: "names", label: "Tên đề tài" },
  { key: "type", label: "Loại đề tài", _style: { width: 100 } },
  {
    key: "educationMethodNames",
    label: "Đào tạo",
    _style: { width: 110 },
  },
  { key: "majorNames", label: "Chuyên ngành", _style: { width: 130 } },
  { key: "subjectDepartmentName", label: "Bộ môn" },
  { key: "guideTeachers", label: "Giáo viên hướng dẫn" },
  { key: "studentCount", label: "Số SV đăng ký", _style: { width: 100 } },
];

const multiLine = (array) => (
  <td>
    {array?.map((e) => (
      <tr>{e}</tr>
    ))}
  </td>
);

const renderUserInTable = (users) => (
  <td>
    {users?.map((user) => (
      <tr>
        <CTooltip
          content={
            <>
              <div>Mã số:{user.code}</div>
              <div>{user.email}</div>
            </>
          }
        >
          <div>{user.fullName}</div>
        </CTooltip>
      </tr>
    ))}
  </td>
);

const scopedSlots = {
  names: (item) => multiLine(item.names),
  educationMethodNames: (item) => multiLine(item.educationMethodNames),
  majorNames: (item) => multiLine(item.majorNames),
  guideTeachers: (item) => renderUserInTable(item.guideTeachers),
  reviewTeachers: (item) => renderUserInTable(item.reviewTeachers),
  studentCount: (item) => (
    <td className="py-2">
      {item.students?.length === item.maxStudentTake ? (
        <CBadge
          color={"success"}
        >{`Đủ sinh viên ${item.students.length}/${item.maxStudentTake}`}</CBadge>
      ) : (
        `Đăng ký ${item.students.length}/${item.maxStudentTake}`
      )}
    </td>
  ),
};

export { fields, scopedSlots };
