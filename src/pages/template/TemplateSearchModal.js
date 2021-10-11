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
import api from "src/service/api";

const fields = [
  { key: "id", label: "Mã", _style: { width: 1 } },
  { key: "name", label: "Tên mẫu" },
  { key: "description", label: "Mô tả" },
];

const MainComponent = ({ view, disableView, selected }) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const size = 5;

  const pageChange = (newPage) => {
    if (page !== newPage) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    api
      .get("/templates", { params: { direction: "DESC" } })
      .then(setData);
  }, [page]);

  return (
    <CModal color="info" size="lg" show={view} onClose={disableView}>
      <CModalHeader closeButton>
        <CModalTitle>Tìm kiếm mẫu tiêu chí</CModalTitle>
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

export default MainComponent;
