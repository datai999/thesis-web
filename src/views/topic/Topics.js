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
import usersData from "../users/UsersData";

const getBadge = (status) => {
  switch (status) {
    case "Active":
      return "success";
    case "Inactive":
      return "secondary";
    case "Pending":
      return "warning";
    case "Banned":
      return "danger";
    default:
      return "primary";
  }
};
const fields = ["id", "name", "registered", "role", "status"];

const Topics = () => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);

  const pageChange = (newPage) => {
    currentPage !== newPage && history.push(`/topics?page=${newPage}`);
  };

  const addTopic = () => {
    history.push(`/topics/create`);
  };

  useEffect(() => {
    currentPage !== page && setPage(currentPage);
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
            <CButton color="primary" className="float-right" onClick={addTopic}>
              Thêm đề tài
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          items={usersData}
          fields={fields}
          hover
          striped
          itemsPerPage={5}
          activePage={page}
          clickableRows
          onRowClick={(item) => history.push(`/topics/${item.id}`)}
          scopedSlots={{
            status: (item) => (
              <td>
                <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
              </td>
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
