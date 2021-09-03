import {
  CButton,
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
import api from "../../../service/api";

const fields = [
  { key: "id", label: "Mã", _style: { width: "5%" } },
  { key: "names", label: "Tên đề tài" },
  { key: "thesis", label: "Loại", _style: { width: "10%" } },
  { key: "semester", label: "Học kỳ", _style: { width: "10%" } },
  { key: "educationMethod", label: "Phương thức", _style: { width: "10%" } },
  { key: "majorNames", label: "Ngành" },
  { key: "guideTeacherNames", label: "Giáo viên hướng dẫn" },
  { key: "description", label: "Mô tả" },
];

const Topics = () => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);
  const [data, setData] = useState([]);
  const size = 5;

  const pageChange = (newPage) => {
    currentPage !== newPage && history.push(`/topics?page=${newPage}`);
  };

  useEffect(() => {
    currentPage !== page && setPage(currentPage);
    api.get("/topic/flat").then(setData);
  }, [currentPage, page]);

  return (
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol sm="5">
            <h4 id="traffic" className="card-title mb-0">
              Đề tài
            </h4>
          </CCol>
          <CCol sm="7" className="d-none d-md-block">
            <CButton
              color="primary"
              className="float-right"
              onClick={() => history.push(`/topics/create`)}
            >
              Thêm đề tài
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          items={data}
          fields={fields}
          hover
          striped
          sorter
          columnFilter
          itemsPerPage={size}
          activePage={page}
          clickableRows
          onRowClick={(item) => history.push(`/topics/${item.id}`)}
          scopedSlots={{
            name: (item) => (
              <td>
                <tr>{item.name?.vi}</tr>
                <tr>{item.name?.en}</tr>
              </td>
            ),
            educationMethod: (item) => (
              <td>{item.educationMethod.value?.vi}</td>
            ),
          }}
        />
        <CPagination
          activePage={page}
          onActivePageChange={pageChange}
          align="center"
        />
      </CCardBody>
    </CCard>
  );
};

export default Topics;
