import CIcon from "@coreui/icons-react";
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import api from "src/service/api";
import CouncilRoleModal from "./CouncilRoleModal";

const fields = [
  { key: "id", label: "Mã", _style: { width: "1%" } },
  {
    key: "displayOrder",
    label: "Thứ tự hiển thị",
    _style: { maxWidth: "50px" },
  },
  { key: "name", label: "Vai trò" },
  { key: "min", label: "Tối thiểu" },
  { key: "max", label: "Tối đa" },
  { key: "deleted", label: "Sử dụng" },
  {
    key: "actions",
    label: "",
    _style: { width: "10%" },
    sorter: false,
    filter: false,
  },
];

const MainComponent = () => {
  const [data, setData] = useState([]);
  const [modalView, setModalView] = useState(false);
  const [defaultForm, setDefaultForm] = useState({});

  const getData = async () => {
    api
      .get(`/council-roles`, {
        params: {
          sort: "displayOrder",
        },
      })
      .then(setData);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard>
      <CouncilRoleModal
        view={modalView}
        disableView={() => setModalView(false)}
        defaultForm={defaultForm}
        success={() => {
          setDefaultForm({});
          getData();
        }}
      />
      <CCardHeader>
        <CRow>
          <CCol>
            <h4 className="card-title mb-0">Cài đặt thành viên hội đồng</h4>
          </CCol>
          <CCol md="2">
            <CButton
              color="primary"
              className="float-right"
              onClick={() => {
                setDefaultForm({});
                setModalView(true);
              }}
            >
              Thêm vai trò mới
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CDataTable
          items={data}
          fields={fields}
          striped
          itemsPerPage={5}
          scopedSlots={{
            deleted: (item) => (
              <td>
                <CBadge color={item.deleted ? "secondary" : "success"}>
                  {item.deleted ? "Không" : "Có"}
                </CBadge>
              </td>
            ),
            actions: (item) => (
              <td>
                <CButton
                  color="primary"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDefaultForm(item);
                    setModalView(true);
                  }}
                >
                  <CIcon name="cil-pencil" />
                </CButton>
              </td>
            ),
          }}
        />
      </CCardBody>
    </CCard>
  );
};

export default MainComponent;
