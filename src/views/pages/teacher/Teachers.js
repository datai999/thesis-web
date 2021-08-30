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
import _ from "lodash";
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

  const size = 5;

  const fetchData = async () => {
    var response = await api.getPaging({ page, size }, "/teacher");

    let nextData = _.cloneDeep(data);
    response.content.forEach((element, index) => {
      nextData[(page - 1) * size + index] = element;
    });

    setData(nextData);
  };

  const pageChange = (newPage) => {
    currentPage !== newPage && history.push(`/teachers?page=${newPage}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    currentPage !== page && setPage(currentPage);
    fetchData();
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
          itemsPerPage={size}
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
