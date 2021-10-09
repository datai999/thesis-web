import CIcon from "@coreui/icons-react";
import { CCardBody, CCol, CDataTable, CRow, CTooltip } from "@coreui/react";
import React from "react";

const fields = [
  { key: "role", label: "Vai trò", _style: { width: "30%" } },
  { key: "code", label: "Mã số" },
  { key: "name", label: "Họ tên và email" },
];

const MainComponent = ({ item, index }) => {
  const getMember = (topic) => [
    { role: "Giáo viên hướng dẫn", data: topic.guideTeachers },
    { role: "Giáo viên phản biện", data: topic.reviewTeachers },
    { role: "Sinh viên", data: topic.students },
  ];

  return (
    <CCardBody>
      <CRow>
        <CCol>
          Mô tả
          <br />
          {item.description}
        </CCol>
        <CCol>
          Nhiệm vụ
          <br />
          {item.task}
          <br />
          Tài liệu
          <br />
          {item.documentReference}
        </CCol>
        <CCol>
          <CDataTable
            items={getMember(item)}
            fields={fields}
            size="sm"
            scopedSlots={{
              code: (row) =>
                multiLine(row.data.map((councilMember) => councilMember.code)),
              name: (row) =>
                multiLine(
                  row.data.map((user) => (
                    <>
                      {user.firstName} {user.lastName}{" "}
                      <CTooltip content={user.email}>
                        <CIcon name="cil-envelope-closed" className="mb-2" />
                      </CTooltip>
                    </>
                  ))
                ),
            }}
          />
        </CCol>
      </CRow>
    </CCardBody>
  );
};

const multiLine = (array = []) => (
  <td>{array && array.map((e) => <div>{e}</div>)}</td>
);

export default MainComponent;
