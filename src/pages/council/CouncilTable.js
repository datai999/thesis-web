import CIcon from "@coreui/icons-react";
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CDataTable,
  CPagination,
  CRow,
  CTooltip,
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import SubjectDepartmentTab from "src/components/SubjectDepartmentTab";
import api from "src/service/api";

const fields = [
  { key: "id", label: "Mã", _style: { width: 1 } },
  { key: "semesterName", label: "Học kỳ", _style: { width: 90 } },
  { key: "time", label: "Thời gian", _style: { width: 140 } },
  { key: "location", label: "Địa điểm", _style: { width: "15%" } },
  { key: "members", label: "Thành viên", sorter: false },
  { key: "note", label: "Ghi chú" },
  {
    key: "actions",
    label: "",
    _style: { width: 1 },
    sorter: false,
    filter: false,
  },
];

const councilRoleFields = [
  { key: "role", label: "Vai trò" },
  { key: "code", label: "Mã số" },
  { key: "degree", label: "Học vị" },
  { key: "name", label: "Họ tên và email" },
];

const CouncilTable = ({ subjectDepartmentId }) => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const size = 5;

  const pageChange = (newPage) => {
    currentPage !== newPage &&
      history.push(`/councils/${subjectDepartmentId}?page=${newPage}`);
    setPage(newPage);
  };

  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  const getData = () => {
    api
      .post(
        `/councils/example`,
        { subjectDepartment: subjectDepartmentId },
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
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol sm="5">
            <h5 className="card-title mb-0">Danh sách hội đồng</h5>
          </CCol>
          <CCol sm="7" className="d-none d-md-block">
            <CButton
              color="primary"
              className="float-right"
              onClick={() => {
                history.push(`/councils/${subjectDepartmentId}/create`);
              }}
            >
              Tạo hội đồng mới
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CDataTable
        items={data}
        fields={fields}
        hover
        sorter
        columnFilter
        tableFilter
        itemsPerPageSelect
        itemsPerPage={size}
        activePage={page}
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
          actions: (item) => (
            <td className="py-2">
              <CButtonGroup vertical size="sm">
                <CTooltip content={"Chỉnh sửa"}>
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={() => {
                      history.push(
                        `/councils/${subjectDepartmentId}/edit/${item.id}`,
                        item
                      );
                    }}
                  >
                    <CIcon name="cil-pencil" />
                  </CButton>
                </CTooltip>
                {/* <CTooltip
                  content={details.includes(item.id) ? "Ẩn bớt" : "Chi tiết"}
                >
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={() => {
                      toggleDetails(item.id);
                    }}
                  >
                    <CIcon
                      name={`cil-chevron-${
                        details.includes(item.id) ? "top" : "bottom"
                      }`}
                    />
                  </CButton>
                </CTooltip> */}
              </CButtonGroup>
            </td>
          ),
          details: (item) => (
            <CCollapse show={details.includes(item.id)}>
              <CCardBody>
                <CRow>
                  <CCol md="4">
                    Mô tả
                    <br />
                    {item.description}
                  </CCol>
                  <CCol md="5">
                    Nhiệm vụ
                    <br />
                    {item.task}
                    <br />
                    Tài liệu
                    <br />
                    {item.documentReference}
                  </CCol>
                </CRow>
              </CCardBody>
            </CCollapse>
          ),
        }}
      />
      <CPagination
        size="sm"
        activePage={page}
        onActivePageChange={pageChange}
        align="center"
      />
    </CCard>
  );
};

const multiLine = (array = []) => (
  <td>{array && array.map((e) => <div>{e}</div>)}</td>
);

const MainComponent = () => (
  <SubjectDepartmentTab URL="/councils" InnerComponent={CouncilTable} />
);

export default MainComponent;
