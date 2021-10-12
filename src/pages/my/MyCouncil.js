import CIcon from "@coreui/icons-react";
import {
  CButton,
  CButtonGroup,
  CCardBody,
  CCol,
  CCollapse,
  CDataTable,
  CPagination,
  CRow,
  CTooltip
} from "@coreui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import api from "src/service/api";
import contextHolder from "src/service/contextService";

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

const MainComponent = () => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const size = 5;

  const pageChange = (newPage) => {
    currentPage !== newPage &&
      history.push(`${window.location.pathname}?page=${newPage}`);
    setPage(newPage);
  };

  const toggleDetails = (item) => {
    const position = details.indexOf(item);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, item];
    }
    setDetails(newDetails);
  };

  useEffect(() => {
    api
      .get(`/council-members/member`, {
        params: {
          memberId: contextHolder.user.id,
          direction: "DESC",
        },
      })
      .then(setData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <CDataTable
        size="sm"
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
            <CButtonGroup vertical size="sm">
              <CTooltip
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
              </CTooltip>
            </CButtonGroup>
          ),
          details: (item) => (
            <CCollapse show={details.includes(item.id)}>
              <CCardBody>
                {item.topics.map((topic) => (
                  <CRow>
                    <CCol md="4">
                      {topic.name?.vi}
                      <br />
                      {topic.name?.en}
                    </CCol>
                    <CCol> {topic.description}</CCol>
                  </CRow>
                ))}
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
    </>
  );
};

const multiLine = (array = []) => (
  <td>{array && array.map((e) => <div>{e}</div>)}</td>
);

export default MainComponent;
