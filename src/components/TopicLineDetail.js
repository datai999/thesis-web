import CIcon from "@coreui/icons-react";
import {
  CCardBody,
  CCol,
  CDataTable,
  CLink,
  CRow,
  CTooltip
} from "@coreui/react";
import React from "react";

const fields = [
  { key: "role", label: "Vai trò", _style: { width: "30%" } },
  { key: "code", label: "Mã số" },
  { key: "name", label: "Họ tên và email" },
];

const MainComponent = ({ item }) => {
  const getMember = (topic) => [
    {
      roleId: "guideTeacher",
      role: "Giáo viên hướng dẫn",
      data: topic.guideTeachers,
    },
    {
      roleId: "reviewTeacher",
      role: "Giáo viên phản biện",
      data: topic.reviewTeachers,
    },
    { roleId: "student", role: "Sinh viên", data: topic.students },
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
                      {user.firstName} {user.lastName}
                      <div>
                        <CTooltip content={user.email}>
                          <CIcon name="cil-envelope-closed" className="mb-1" />
                        </CTooltip>
                        {row.roleId === "student" && (
                          <CTooltip content={"Chấm điểm"}>
                            <CLink
                              onClick={() => {
                                window.open(
                                  `${window.location.origin}/my/topics/${
                                    item.id
                                  }/mark?role=${window.location.pathname
                                    .split("/")
                                    .pop()}&student=${user.code}`,
                                  "_blank"
                                );
                              }}
                            >
                              <CIcon name="cil-calculator" className="ml-1" />
                            </CLink>
                          </CTooltip>
                        )}
                      </div>
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
