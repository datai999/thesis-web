import { CCard, CCardBody, CDataTable, CPagination } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { loginUserHasAny, PERMISSIONS } from "src/service/permissionService";
import api from "../../service/api";

const fields = [
  { key: "id", label: "Mã", _style: { width: 1 } },
  { key: "name", label: "Tên mẫu" },
  { key: "description", label: "Mô tả" },
];
const MainComponent = () => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);
  const [data, setData] = useState([]);

  const canEdit = loginUserHasAny([PERMISSIONS.EDUCATION_STAFF]);

  const pageChange = (newPage) => {
    currentPage !== newPage && history.push(`/templates/list?page=${newPage}`);
    setPage(newPage);
  };

  useEffect(() => {
    api.get(`/templates`, { params: { direction: "DESC" } }).then(setData);
  }, [page]);

  return (
    <CCard>
      <CCardBody>
        <CDataTable
          items={data}
          fields={canEdit ? fields : fields.slice(0, -1)}
          activePage={page}
          itemsPerPage={5}
          size="sm"
          hover
          sorter
          striped
          columnFilter
          tableFilter
          itemsPerPageSelect
          clickableRows
          onRowClick={(item) => history.push(`/templates/${item.id}`, item)}
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

export default MainComponent;
