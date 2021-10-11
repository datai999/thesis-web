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
import { initContext } from "src/service/contextService";
import ShareSettingModal from "./ShareSettingModal";

const fields = [
  { key: "id", label: "Mã" },
  { key: "name", label: "Tên" },
  { key: "deleted", label: "Sử dụng" },
  {
    key: "actions",
    label: "",
    _style: { width: "10%" },
    sorter: false,
    filter: false,
  },
];

const MainComponent = ({ props }) => {
  const [data, setData] = useState([]);
  const [modalView, setModalView] = useState(false);
  const [defaultForm, setDefaultForm] = useState({});

  const getData = async () => {
    api.get(`${props.baseURL}/all`).then(setData);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CCard>
      <ShareSettingModal
        view={modalView}
        disableView={() => setModalView(false)}
        defaultForm={defaultForm}
        success={() => {
          initContext();
          setDefaultForm({});
          getData();
        }}
        {...props}
      />
      <CCardHeader>
        <CRow>
          <CCol>
            <h4 className="card-title mb-0">{props.headerTitle}</h4>
          </CCol>
          <CCol md="4">
            <CButton
              color="primary"
              className="float-right"
              onClick={async () => {
                await setDefaultForm({});
                setModalView(true);
              }}
            >
              Thêm mới
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
