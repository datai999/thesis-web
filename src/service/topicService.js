import CIcon from "@coreui/icons-react";
import { CBadge, CTooltip } from "@coreui/react";
import React from "react";

const fields = [
  { key: "id", label: "Mã", _style: { width: "1%" } },
  { key: "names", label: "Tên đề tài" },
  {
    key: "educationMethodNames",
    label: "Đào tạo",
    _style: { width: "12%" },
  },
  { key: "majorNames", label: "Chuyên ngành" },
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

const scopedSlots = {
  names: (item) => multiLine(item.names),
  educationMethodNames: (item) => multiLine(item.educationMethodNames),
  majorNames: (item) => multiLine(item.majorNames),
  guideTeachers: (item) => (
    <td>
      {item.guideTeachers?.map((guideTeacher) => (
        <tr>
          {guideTeacher.code} {guideTeacher.firstName} {guideTeacher.lastName}{" "}
          <CTooltip content={guideTeacher.email}>
            <CIcon name="cil-envelope-closed" className="mb-1" />
          </CTooltip>
        </tr>
      ))}
    </td>
  ),
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
