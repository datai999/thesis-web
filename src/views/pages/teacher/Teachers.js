import {
  CBadge,
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
  "id",
  "firstName",
  "lastName",
  "gender",
  "subjectDepartment",
  "degree",
  "email",
  "phone",
];

const Component = () => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);
  const [data, setData] = useState([]);

  const fetchData = async (number) => {
    var response = await api.getPaging(
      { number: number - 1, size: 5 },
      "/teacher"
    );
    await setData(response.content);
    return response.content;
  };

  const pageChange = (newPage) => {
    currentPage !== newPage && history.push(`/teachers?page=${newPage}`);
  };

  useEffect(() => {
    fetchData(page);
  }, []);

  useEffect(() => {
    currentPage !== page && setPage(currentPage);
    fetchData(currentPage);
  }, [currentPage, page]);

  return (
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol sm="5">
            <h4 id="traffic" className="card-title mb-0">
              Danh sách giáo viên
            </h4>
          </CCol>
          <CCol sm="7" className="d-none d-md-block">
            <CButton
              color="primary"
              className="float-right"
              onClick={() => history.push(`/teachers/create`)}
            >
              Thêm giáo viên mới
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
          itemsPerPage={5}
          activePage={page}
          clickableRows
          onRowClick={(item) => history.push(`/teachers/${item.id}`)}
          scopedSlots={{
            gender: (item) => <td>{item.male ? "Nam" : "Nữ"}</td>,
            subjectDepartment: (item) => (
              <td>{item.subjectDepartment?.name?.vi}</td>
            ),
            degree: (item) => <td>{item.degree?.name?.vi}</td>,
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

export default Component;
