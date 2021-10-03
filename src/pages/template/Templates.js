import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CPagination,
  CRow,
  CTooltip
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import api from "../../service/api";

const fields = [
  { key: "id", label: "Mã", _style: { width: 1 } },
  // {
  //   key: "displayOrder",
  //   label: "Thứ tự hiển thị",
  //   _style: { minWidth: 30 },
  // },
  { key: "name", label: "Tên mẫu" },
  { key: "description", label: "Mô tả" },
  {
    key: "actions",
    label: "",
    _style: { width: 1 },
    sorter: false,
    filter: false,
  },
];
const MainComponent = () => {
  const history = useHistory();
  const queryPage = useLocation().search.match(/page=([0-9]+)/, "");
  const currentPage = Number(queryPage && queryPage[1] ? queryPage[1] : 1);
  const [page, setPage] = useState(currentPage);
  const [data, setData] = useState([]);

  const pageChange = (newPage) => {
    currentPage !== newPage && history.push(`/templates?page=${newPage}`);
    setPage(newPage);
  };

  useEffect(() => {
    api
      .get(`/criterions/templates`, { params: { direction: "DESC" } })
      .then(setData);
  }, [page]);

  return (
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol sm="5">
            <h4 id="traffic" className="card-title mb-0">
              Danh sách mẫu tiêu chí
            </h4>
          </CCol>
          <CCol sm="7" className="d-none d-md-block">
            <CButton color="primary" className="float-right" onClick={() => {}}>
              Thêm mẫu mới
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          items={data}
          fields={fields}
          activePage={page}
          itemsPerPage={5}
          hover
          sorter
          columnFilter
          tableFilter
          itemsPerPageSelect
          scopedSlots={{
            actions: (item) => (
              <td>
                <CTooltip content={"Chỉnh sửa"}>
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={() => {
                      history.push(`/templates/${item.id}`, item);
                    }}
                  >
                    <CIcon name="cil-pencil" />
                  </CButton>
                </CTooltip>
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

export default MainComponent;
