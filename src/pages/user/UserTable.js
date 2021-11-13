import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CPagination,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import api from "src/service/api";

const fields = [
  { key: "code", label: "Mã số", _style: { width: 1 } },
  { key: "firstName", label: "Họ", _style: {} },
  { key: "lastName", label: "Tên", _style: { width: 1 } },
  { key: "gender", label: "Giới tính", _style: { width: 10 } },
  { key: "degreeName", label: "Học vị", _style: { width: 80 } },
  { key: "subjectDepartmentName", label: "Bộ môn", _style: { minWidth: 130 } },
  { key: "educationMethodName", label: "Đào tạo", _style: { width: 120 } },
  { key: "majorName", label: "Chuyên ngành", _style: { width: 150 } },
  { key: "email", label: "Email", _style: { width: 10 } },
  { key: "permissions", label: "Quyền hạn", _style: { width: 1 } },
];

const Component = () => {
  const size = 5;
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const history = useHistory();

  const [page, setPage] = useState(currentPage);
  const [data, setData] = useState([]);

  const pageChange = (newPage) => {
    currentPage !== newPage && history.push(`/users?page=${newPage}`);
    setPage(newPage);
  };

  useEffect(() => {
    api.get("/users", { params: { direction: "DESC" } }).then(setData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol sm="5">
            <h5 className="card-title mb-0">Danh sách người dùng</h5>
          </CCol>
          <CCol sm="7" className="d-none d-md-block">
            {/* <CButton
              color="primary"
              className="float-right"
              onClick={() => history.push(`/students/create`)}
            >
              Thêm sinh viên mới
            </CButton> */}
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          items={data}
          fields={fields}
          size="sm"
          hover
          striped
          sorter
          columnFilter
          tableFilter
          itemsPerPageSelect
          itemsPerPage={size}
          activePage={page}
          clickableRows
          onRowClick={(item) => history.push(`/users/${item.id}`)}
          scopedSlots={{
            permissions: (item) => (
              <td>
                {item.permissions?.map((e) => (
                  <div>{e}</div>
                ))}
              </td>
            ),
          }}
        />
        <CPagination
          size="sm"
          activePage={page}
          onActivePageChange={pageChange}
          align="center"
        />
      </CCardBody>
    </CCard>
  );
};

export default Component;
