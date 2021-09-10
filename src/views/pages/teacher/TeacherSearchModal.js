import {
  CButton,
  CDataTable,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPagination
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import api from "../../../service/api";

const fields = [
  { key: "code", label: "Mã số", _style: { width: "10%" } },
  { key: "firstName", label: "Họ" },
  { key: "lastName", label: "Tên", _style: { width: "10%" } },
  { key: "subjectDepartmentName", label: "Bộ môn" },
  { key: "degreeName", label: "Học vị" },
  { key: "email", label: "Email:@hcmut.edu.vn" },
];

const Component = ({ view, disableView, selected }) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const size = 5;

  const pageChange = (newPage) => {
    if (page !== newPage) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    api.get("/teachers", { params: { direction: "DESC" } }).then(setData);
  }, [page]);

  return (
    <CModal color="info" size="lg" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>Tìm kiếm giáo viên</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CDataTable
          items={data}
          fields={fields}
          sorter
          hover
          striped
          columnFilter
          itemsPerPage={size}
          activePage={page}
          clickableRows
          onRowClick={selected}
        />
        <CPagination
          activePage={page}
          onActivePageChange={pageChange}
          align="center"
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={disableView}>
          Quay về
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default Component;
