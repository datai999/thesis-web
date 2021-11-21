import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import BaseTable from "src/components/BaseTable";
import api from "src/service/api";

const fields = [
  { key: "id", label: "Mã", _style: { width: 1 } },
  { key: "name", label: "Tên mẫu" },
  { key: "type", label: "Loại đề tài" },
  // { key: "markType", label: "Loại điểm" },
  { key: "numberMark", label: "Thang điểm số" },
  { key: "majorNames", label: "Chuyên ngành" },
  { key: "teacherRoles", label: "Người chấm điểm" },
];
const MainComponent = () => {
  const history = useHistory();

  const [data, setData] = useState([]);

  useEffect(() => {
    api.get(`/templates`, { params: { direction: "DESC" } }).then(setData);
  }, []);

  return (
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol>
            <h5>
              <strong>Danh sách mẫu tiêu chí</strong>
            </h5>
          </CCol>
          <CCol md="0">
            <CButton
              color="primary"
              className="float-right"
              onClick={() => {
                history.push(`/templates/create`);
              }}
            >
              Thêm mẫu mới
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <BaseTable
          items={data}
          fields={fields}
          tableProps={{
            striped: true,
            clickableRows: true,
            onRowClick: (item) => history.push(`/templates/${item.id}`, item),
          }}
        />
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
