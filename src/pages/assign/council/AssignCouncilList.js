import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CTooltip,
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import BaseTable from "src/components/BaseTable";
import api from "src/service/api";
import context from "src/service/contextService";
import { loginUserIsHead } from "src/service/permissionService";
import SubjectDepartmentTab from "./SubjectDepartmentTab";

const fields = [
  { key: "id", label: "Mã", _style: { width: 1 } },
  { key: "time", label: "Thời gian", _style: { width: 140 } },
  { key: "location", label: "Địa điểm", _style: { width: "15%" } },
  { key: "members", label: "Thành viên", sorter: false },
  { key: "note", label: "Ghi chú" },
];

const councilRoleFields = [
  { key: "role", label: "Vai trò" },
  { key: "code", label: "Mã số" },
  { key: "degree", label: "Học vị" },
  { key: "name", label: "Họ tên và email" },
];

const CouncilList = ({ subjectDepartmentId }) => {
  const history = useHistory();
  const headSubjectDepartment = loginUserIsHead();

  const [data, setData] = useState([]);

  const getData = () => {
    api
      .post(
        `/councils/example`,
        {
          subjectDepartment: subjectDepartmentId,
          semester: { id: context.semester?.id },
        },
        {
          params: {
            direction: "DESC",
          },
        }
      )
      .then(setData);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CCardHeader>
        <CRow>
          <CCol sm="5">
            <h5 className="card-title mb-0">Danh sách hội đồng</h5>
          </CCol>
          {headSubjectDepartment && (
            <CCol sm="7" className="d-none d-md-block">
              <CButton
                color="primary"
                className="float-right"
                onClick={() => {
                  history.push(
                    `/assign-council/${subjectDepartmentId}/${context.semester?.name}/create`
                  );
                }}
              >
                Tạo hội đồng mới
              </CButton>
            </CCol>
          )}
        </CRow>
      </CCardHeader>
      <BaseTable
        items={data}
        fields={fields}
        selectSemester
        semesterTop={8}
        tableProps={{
          clickableRows: true,
          onRowClick: (item) => {
            history.push(
              `/councils/${subjectDepartmentId}/edit/${item.id}`,
              item
            );
          },
        }}
        scopedSlots={{
          time: (item) => (
            <td>
              <div>
                {"Ngày"}
                <div className="float-right">{item.reserveDate}</div>
              </div>
              <div>
                {"Bắt đầu"}
                <div className="float-right">{item.startTime}</div>
              </div>
              <div>
                {"Kết thúc"}
                <div className="float-right">{item.endTime}</div>
              </div>
            </td>
          ),
          members: (item) => (
            <td className="p-0">
              {
                <CDataTable
                  items={Object.entries(
                    _.groupBy(item.members, (e) => e.role.name)
                  ).sort(
                    (a, b) =>
                      a[1][0].role.displayOrder - b[1][0].role.displayOrder
                  )}
                  fields={councilRoleFields}
                  size="sm"
                  scopedSlots={{
                    role: (row) => <>{row[0]}</>,
                    code: (row) =>
                      multiLine(
                        row[1].map((councilMember) => councilMember.member.code)
                      ),
                    degree: (row) =>
                      multiLine(
                        row[1].map(
                          (councilMember) => councilMember.member.degreeName
                        )
                      ),
                    name: (row) =>
                      multiLine(
                        row[1]
                          .map((councilMember) => councilMember.member)
                          .map((user) => (
                            <div>
                              {user.firstName} {user.lastName}{" "}
                              <CTooltip content={user.email}>
                                <CIcon
                                  name="cil-envelope-closed"
                                  className="mb-2"
                                />
                              </CTooltip>
                            </div>
                          ))
                      ),
                  }}
                />
              }
            </td>
          ),
        }}
      />
    </>
  );
};

const multiLine = (array = []) => (
  <td>{array && array.map((e) => <div>{e}</div>)}</td>
);

const MainComponent = () => (
  <SubjectDepartmentTab URL="/assign-council" InnerComponent={CouncilList} />
);

export default MainComponent;
